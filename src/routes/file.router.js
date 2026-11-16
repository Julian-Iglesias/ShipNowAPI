import { Router } from "express";
import multer from "multer";
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import {
  userUpload,
  orderUpload,
  deliveryUpload,
} from "../config/upload.config.js";
import fileController from "../controllers/file.controller.js";

const router = Router();

const handleUpload = (middleware) => (req, res, next) => {
  middleware(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError || error instanceof AppError) {
      return next(error);
    }

    logger.error("Error inesperado al almacenar un archivo");
    return next(new AppError("FILE_SAVE_FAILED"));
  });
};

router.post(
  "/users/:id/documents",
  handleUpload(userUpload.single("file")),
  fileController.uploadUserDocument,
);

router.post(
  "/orders/:id/proofs",
  handleUpload(orderUpload.single("file")),
  fileController.uploadOrderProof,
);

router.post(
  "/deliveries/:id/proofs",
  handleUpload(deliveryUpload.single("file")),
  fileController.uploadDeliveryProof,
);

export default router;
