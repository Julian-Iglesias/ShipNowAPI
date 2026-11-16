import request from "supertest";
import { expect } from "chai";
import app from "./helpers/testApp.js";

describe("Orders", () => {
  async function createUser() {
    const res = await request(app).post("/api/users").send({
      name: "Cliente Test",
      email: "cliente@test.com",
    });

    expect(res.status).to.equal(201);
    return res.body._id;
  }

  async function createOrder() {
    const userId = await createUser();

    return request(app).post("/api/orders").send({
      user: userId,
      description: "Entrega de paquete",
      total: 25000,
      priority: "HIGH",
    });
  }

  it("GET /api/orders devuelve un listado", async () => {
    const res = await request(app).get("/api/orders");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/orders crea un pedido válido", async () => {
    const res = await createOrder();

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.status).to.equal("PENDING");
    expect(res.body.priority).to.equal("HIGH");
    expect(res.body.total).to.equal(25000);
    expect(res.body).to.have.property("user");
  });

  it("GET /api/orders/:id consulta el pedido creado", async () => {
    const created = await createOrder();

    expect(created.status).to.equal(201);

    const res = await request(app).get(`/api/orders/${created.body._id}`);

    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(created.body._id);
    expect(res.body.description).to.equal("Entrega de paquete");
  });

  it("PATCH actualiza el estado del pedido", async () => {
    const created = await createOrder();

    expect(created.status).to.equal(201);

    const res = await request(app)
      .patch(`/api/orders/${created.body._id}/status`)
      .send({ status: "IN_TRANSIT" });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("IN_TRANSIT");
    expect(res.body._id).to.equal(created.body._id);
  });

  it("rechaza un pedido incompleto", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ description: "Pedido sin usuario" });

    expect(res.status).to.equal(400);
    expect(res.body).to.include({
      status: "error",
      code: "INVALID_ORDER_DATA",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza un estado inválido", async () => {
    const created = await createOrder();

    expect(created.status).to.equal(201);

    const res = await request(app)
      .patch(`/api/orders/${created.body._id}/status`)
      .send({ status: "DESCONOCIDO" });

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_ORDER_STATUS");
    expect(res.body.message).to.be.a("string");
  });

  it("devuelve 404 si el pedido no existe", async () => {
    const res = await request(app).get("/api/orders/507f1f77bcf86cd799439011");

    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      status: "error",
      code: "ORDER_NOT_FOUND",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza un usuario inexistente al crear pedido", async () => {
    const res = await request(app).post("/api/orders").send({
      user: "507f1f77bcf86cd799439011",
      description: "Pedido de prueba",
      total: 1000,
    });

    expect(res.status).to.equal(404);
    expect(res.body.code).to.equal("USER_NOT_FOUND");
  });
});
