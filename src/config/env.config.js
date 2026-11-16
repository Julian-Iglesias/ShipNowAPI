import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["PORT", "MONGODB_URI", "NODE_ENV"];

for (const variable of requiredVars) {
  if (!process.env[variable]?.trim()) {
    throw new Error(`Falta la variable de entorno: ${variable}`);
  }
}

const config = {
  port: Number(process.env.PORT),
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error("PORT debe ser un puerto válido");
}

export default Object.freeze(config);
