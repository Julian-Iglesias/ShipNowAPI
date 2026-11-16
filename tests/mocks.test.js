
import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "./helpers/testApp.js";

describe("Mocks", () => {

  it("genera usuarios mock", async () => {
    const res = await request(app)
      .get("/api/mocks/users?qty=3");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").with.lengthOf(3);
    expect(res.body[0]).to.have.property("email");
    expect(res.body[0]).to.have.property("_id");
  });

  it("genera repartidores mock", async () => {
    const res = await request(app)
      .get("/api/mocks/couriers?qty=2");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0].role).to.equal("COURIER");
  });

  it("genera pedidos mock con usuarios relacionados", async () => {
    const res = await request(app)
      .get("/api/mocks/orders?qty=2");

    expect(res.status).to.equal(200);
    expect(res.body.users).to.have.lengthOf(2);
    expect(res.body.orders).to.have.lengthOf(2);

    expect(res.body.orders[0].user)
      .to.equal(res.body.users[0]._id);
  });

  it("genera entregas mock relacionadas", async () => {
    const res = await request(app)
      .get("/api/mocks/deliveries?qty=2");

    expect(res.status).to.equal(200);
    expect(res.body.deliveries).to.have.lengthOf(2);
    expect(res.body.orders).to.have.lengthOf(2);
    expect(res.body.couriers).to.have.lengthOf(2);

    expect(res.body.deliveries[0].order)
      .to.equal(res.body.orders[0]._id);

    expect(res.body.deliveries[0].courier)
      .to.equal(res.body.couriers[0]._id);
  });

  it("los GET de mocks no guardan documentos", async () => {
    await request(app).get("/api/mocks/orders?qty=3");

    const count = await mongoose.connection
      .collection("orders")
      .countDocuments();

    expect(count).to.equal(0);
  });

  it("rechaza una cantidad negativa", async () => {
    const res = await request(app)
      .get("/api/mocks/users?qty=-5");

    expect(res.status).to.equal(400);
    expect(res.body).to.include({
      status: "error",
      code: "INVALID_MOCK_QUANTITY",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza cantidades no numéricas", async () => {
    const res = await request(app)
      .get("/api/mocks/orders?qty=abc");

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_MOCK_QUANTITY");
  });

  it("rechaza una cantidad inválida en seed", async () => {
    const res = await request(app)
      .post("/api/mocks/seed?qty=0");

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_MOCK_QUANTITY");
  });

  it("POST seed inserta datos en la base de testing", async () => {
    const res = await request(app)
      .post("/api/mocks/seed?qty=1");

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
    expect(res.body.data.inserted).to.include({
      users: 1,
      couriers: 1,
      orders: 1,
      deliveries: 1,
    });

    const ordersCount = await mongoose.connection
      .collection("orders")
      .countDocuments();

    expect(ordersCount).to.equal(1);
  });
});
