import request from "supertest";
import { expect } from "chai";
import app from "./helpers/testApp.js";

describe("Users", () => {
  it("GET /api/users devuelve un listado", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/users crea un usuario", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Usuario Test",
      email: "usuario@test.com",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.email).to.equal("usuario@test.com");
    expect(res.body.role).to.equal("USER");
  });

  it("GET /api/users/:id consulta un usuario creado", async () => {
    const created = await request(app).post("/api/users").send({
      name: "Juan Test",
      email: "juan@test.com",
    });

    expect(created.status).to.equal(201);

    const res = await request(app).get(`/api/users/${created.body._id}`);

    expect(res.status).to.equal(200);
    expect(res.body._id).to.equal(created.body._id);
    expect(res.body.name).to.equal("Juan Test");
  });

  it("rechaza un nombre vacío", async () => {
    const res = await request(app).post("/api/users").send({
      name: "",
      email: "test@test.com",
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.include({
      status: "error",
      code: "INVALID_USER_NAME",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza un email duplicado", async () => {
    const data = {
      name: "Usuario",
      email: "duplicado@test.com",
    };

    await request(app).post("/api/users").send(data);

    const res = await request(app).post("/api/users").send(data);

    expect(res.status).to.equal(409);
    expect(res.body.code).to.equal("DUPLICATE_EMAIL");
    expect(res.body.message).to.be.a("string");
  });

  it("devuelve 404 cuando el usuario no existe", async () => {
    const res = await request(app).get("/api/users/507f1f77bcf86cd799439011");

    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      status: "error",
      code: "USER_NOT_FOUND",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("rechaza un ID inválido", async () => {
    const res = await request(app).get("/api/users/abc");

    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal("INVALID_USER_ID");
  });
});
