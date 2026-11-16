import request from "supertest";
import { expect } from "chai";
import { afterEach } from "mocha";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import app from "./helpers/testApp.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";
import swaggerSpec from "../src/config/swagger.js";

const testUploads = path.join(process.cwd(), "uploads", "test");

const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n");

const attachPdf = (request) =>
  request.attach("file", pdf, {
    filename: "comprobante.pdf",
    contentType: "application/pdf",
  });

// Solo se limpian los archivos del entorno de testing.
afterEach(async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Limpieza bloqueada fuera de testing");
  }

  await fs.rm(testUploads, {
    recursive: true,
    force: true,
  });
});

async function createUser() {
  const res = await request(app).post("/api/users").send({
    name: "Usuario Upload Test",
    email: "upload@test.com",
  });

  expect(res.status).to.equal(201);
  return res.body._id;
}

async function createOrder() {
  const user = await createUser();

  const res = await request(app).post("/api/orders").send({
    user,
    description: "Pedido con comprobante",
    total: 5000,
  });

  expect(res.status).to.equal(201);
  return res.body._id;
}

describe("Uploads - Módulo 7", () => {
  it("sube un documento y guarda metadatos en el usuario", async () => {
    const id = await createUser();

    const res = await attachPdf(
      request(app)
        .post(`/api/users/${id}/documents`)
        .field("documentType", "DNI"),
    );

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body.data.entityId).to.equal(id);

    const file = res.body.data.file;

    expect(file).to.include({
      originalName: "comprobante.pdf",
      mimeType: "application/pdf",
      documentType: "DNI",
    });

    expect(file.storedName).to.be.a("string");
    expect(file.size).to.be.greaterThan(0);
    expect(file.uploadedAt).to.be.a("string");

    expect(existsSync(path.resolve(process.cwd(), file.path))).to.equal(true);

    const user = await User.findById(id).lean();

    expect(user.documents).to.have.lengthOf(1);
    expect(user.documents[0].documentType).to.equal("DNI");
  });

  it("rechaza la carga cuando falta el archivo", async () => {
    const id = await createUser();

    const res = await request(app)
      .post(`/api/users/${id}/documents`)
      .field("documentType", "DNI");

    expect(res.status).to.equal(400);
    expect(res.body).to.include({
      status: "error",
      code: "FILE_REQUIRED",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza un tipo de documento inválido", async () => {
    const id = await createUser();

    const res = await attachPdf(
      request(app)
        .post(`/api/users/${id}/documents`)
        .field("documentType", "OTRO"),
    );

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_DOCUMENT_TYPE");

    const user = await User.findById(id).lean();
    expect(user.documents).to.have.lengthOf(0);
  });

  it("rechaza tipos de archivo no permitidos", async () => {
    const id = await createUser();

    const res = await request(app)
      .post(`/api/users/${id}/documents`)
      .field("documentType", "DNI")
      .attach("file", Buffer.from("archivo de texto"), {
        filename: "archivo.txt",
        contentType: "text/plain",
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_FILE_TYPE");
  });

  it("rechaza archivos cuyo contenido no coincide con el tipo", async () => {
    const id = await createUser();

    const res = await request(app)
      .post(`/api/users/${id}/documents`)
      .field("documentType", "DNI")
      .attach("file", Buffer.from("No es un PDF"), {
        filename: "falso.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_FILE_TYPE");
  });

  it("rechaza archivos mayores a 5 MB", async () => {
    const id = await createUser();

    const res = await request(app)
      .post(`/api/users/${id}/documents`)
      .field("documentType", "DNI")
      .attach("file", Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: "grande.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).to.equal(413);
    expect(res.body.code).to.equal("FILE_TOO_LARGE");
  });

  it("rechaza un nombre incorrecto del campo file", async () => {
    const id = await createUser();

    const res = await request(app)
      .post(`/api/users/${id}/documents`)
      .field("documentType", "DNI")
      .attach("documento", pdf, {
        filename: "dni.pdf",
        contentType: "application/pdf",
      });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_FILE_FIELD");
  });

  it("asocia un comprobante a un pedido", async () => {
    const id = await createOrder();

    const res = await attachPdf(request(app).post(`/api/orders/${id}/proofs`));

    expect(res.status).to.equal(201);
    expect(res.body.data.file.documentType).to.equal("ORDER_PROOF");

    const order = await Order.findById(id).lean();

    expect(order.proofs).to.have.lengthOf(1);
    expect(order.proofs[0].storedName).to.equal(res.body.data.file.storedName);
  });

  it("devuelve 404 si el pedido no existe", async () => {
    const res = await attachPdf(
      request(app).post("/api/orders/507f1f77bcf86cd799439011/proofs"),
    );

    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      status: "error",
      code: "ORDER_NOT_FOUND",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("asocia un comprobante a una entrega", async () => {
    const seed = await request(app).post("/api/mocks/seed?qty=1");

    expect(seed.status).to.equal(201);

    const delivery = await Delivery.findOne().lean();

    expect(delivery).to.not.equal(null);

    const res = await attachPdf(
      request(app).post(`/api/deliveries/${delivery._id}/proofs`),
    );

    expect(res.status).to.equal(201);
    expect(res.body.data.file.documentType).to.equal("DELIVERY_PROOF");

    const updated = await Delivery.findById(delivery._id).lean();

    expect(updated.proofs).to.have.lengthOf(1);
  });

  it("devuelve 404 si la entrega no existe", async () => {
    const res = await attachPdf(
      request(app).post("/api/deliveries/507f1f77bcf86cd799439011/proofs"),
    );

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal("DELIVERY_NOT_FOUND");
  });

  it("documenta los endpoints de archivos en Swagger", () => {
    expect(swaggerSpec.paths).to.have.property("/api/users/{id}/documents");

    expect(swaggerSpec.paths).to.have.property("/api/orders/{id}/proofs");

    expect(swaggerSpec.paths).to.have.property("/api/deliveries/{id}/proofs");
  });
});
