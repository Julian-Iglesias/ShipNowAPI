import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";
import logger from "./logger.js";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const mimeExtensions = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const allowedExtensions = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const uploadRoot = path.join(
  process.cwd(),
  "uploads",
  process.env.NODE_ENV === "test" ? "test" : "",
);

const createUpload = (folder) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const destination = path.join(uploadRoot, folder);

      try {
        mkdirSync(destination, { recursive: true });
        cb(null, destination);
      } catch (error) {
        cb(error);
      }
    },

    filename(req, file, cb) {
      const extension = mimeExtensions[file.mimetype];
      cb(null, `${randomUUID()}${extension}`);
    },
  });

  return multer({
    storage,

    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
      fields: 2,
      parts: 3,
    },

    fileFilter(req, file, cb) {
      const originalName = path.basename(file.originalname.replace(/\\/g, "/"));

      const extension = path.extname(originalName).toLowerCase();

      const valid = allowedExtensions[file.mimetype]?.includes(extension);

      if (!valid) {
        logger.warning("Intento de subir un archivo no permitido");
        return cb(new AppError("INVALID_FILE_TYPE"));
      }

      cb(null, true);
    },
  });
};

export const userUpload = createUpload("users");
export const orderUpload = createUpload("orders");
export const deliveryUpload = createUpload("deliveries");
