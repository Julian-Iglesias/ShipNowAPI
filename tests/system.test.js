
import request from "supertest";
import { expect } from "chai";
import app from "./helpers/testApp.js";

describe("Sistema", () => {

  it("Swagger UI está disponible", async () => {
    const res = await request(app).get("/api/docs/");

    expect(res.status).to.equal(200);
    expect(res.headers["content-type"]).to.include("text/html");
    expect(res.text).to.include("Swagger UI");
  });

  it("el endpoint de logger funciona en testing", async () => {
    const res = await request(app).get("/api/loggerTest");

    expect(res.status).to.equal(200);
    expect(res.body).to.include({
      status: "success",
      message: "Prueba de logger ejecutada correctamente",
    });
  });

  it("las rutas inexistentes devuelven un error uniforme", async () => {
    const res = await request(app).get("/api/ruta-inventada");

    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      status: "error",
      code: "ROUTE_NOT_FOUND",
    });
    expect(res.body.message).to.be.a("string");
  });

  it("los JSON inválidos devuelven HTTP 400", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send('{"name":"Test",}');

    expect(res.status).to.equal(400);
    expect(res.body).to.include({
      status: "error",
      code: "INVALID_JSON",
    });
    expect(res.body.message).to.be.a("string");
  });
});
