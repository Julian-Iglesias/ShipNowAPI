import mongoose from "mongoose";
import config from "./env.config.js";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);

    logger.info("Conexión a MongoDB establecida");
  } catch (error) {
    logger.error(`Error al conectar con MongoDB: ${error.message}`);

    throw error;
  }
};
