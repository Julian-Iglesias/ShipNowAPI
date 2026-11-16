import mongoose from "mongoose";
import { before, beforeEach, after } from "mocha";

const uri = process.env.MONGODB_URI;
const expectedDb = "shipnow_test";

if (
  process.env.NODE_ENV !== "test" ||
  !uri ||
  new URL(uri).pathname.slice(1) !== expectedDb
) {
  throw new Error(
    "TEST BLOQUEADO: se requiere NODE_ENV=test y la base shipnow_test",
  );
}

const { default: app } = await import("../../src/app.js");

before(async function () {
  await mongoose.connect(uri);

  if (mongoose.connection.name !== expectedDb) {
    throw new Error("Conexión de testing incorrecta");
  }
});

beforeEach(async function () {
  if (mongoose.connection.name !== expectedDb) {
    throw new Error("Limpieza bloqueada: base incorrecta");
  }

  await mongoose.connection.dropDatabase();
});

after(async function () {
  if (mongoose.connection.readyState === 1) {
    if (mongoose.connection.name === expectedDb) {
      await mongoose.connection.dropDatabase();
    }

    await mongoose.disconnect();
  }
});

export default app;
