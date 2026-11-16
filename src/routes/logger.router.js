import { Router } from "express";
import logger from "../config/logger.js";
import config from "../config/env.config.js";
import AppError from "../utils/AppError.js";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    // Disponible solamente en desarrollo
    if (!["development", "test"].includes(config.nodeEnv)) {
      throw new AppError("ROUTE_NOT_FOUND");
    }

    logger.debug("Prueba de nivel debug");
    logger.http("Prueba de nivel http");
    logger.info("Prueba de nivel info");
    logger.warning("Prueba de nivel warning");
    logger.error("Prueba de nivel error");
    logger.fatal("Prueba de nivel fatal");

    return res.status(200).json({
      status: "success",
      message: "Prueba de logger ejecutada correctamente",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
