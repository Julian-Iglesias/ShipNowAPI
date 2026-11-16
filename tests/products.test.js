import request from "supertest";
import { expect } from "chai";
import app from "./helpers/testApp.js";

describe("Products", () => {
  const product = {
    name: "Notebook Test",
    description: "Producto de prueba",
    price: 150000,
    stock: 10,
  };

  it("GET /api/products devuelve un listado", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("crea y consulta un producto por ID", async () => {
    const created = await request(app).post("/api/products").send(product);

    expect(created.status).to.equal(201);
    expect(created.body).to.have.property("_id");
    expect(created.body.status).to.equal("AVAILABLE");

    const res = await request(app).get(`/api/products/${created.body._id}`);

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal(product.name);
    expect(res.body.price).to.equal(product.price);
  });

  it("rechaza un precio negativo", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ ...product, price: -10 });

    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal("error");
    expect(res.body.code).to.equal("INVALID_PRODUCT_PRICE");
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza estados de producto inválidos", async () => {
    const res = await request(app).get("/api/products?status=INVALIDO");

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_PRODUCT_STATUS");
  });

  it("devuelve 404 si el producto no existe", async () => {
    const res = await request(app).get(
      "/api/products/507f1f77bcf86cd799439011",
    );

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal("PRODUCT_NOT_FOUND");
    expect(res.body.message).to.be.a("string");
  });
});
