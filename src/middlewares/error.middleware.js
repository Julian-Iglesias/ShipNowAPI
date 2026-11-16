import AppError from "../utils/AppError.js";
import { ERROR_DICTIONARY } from "../errors/errorDictionary.js";
import logger from "../config/logger.js";
import multer from "multer";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError =
    error instanceof multer.MulterError
      ? new AppError(
          error.code === "LIMIT_FILE_SIZE"
            ? "FILE_TOO_LARGE"
            : error.code === "LIMIT_UNEXPECTED_FILE"
              ? "INVALID_FILE_FIELD"
              : "INVALID_UPLOAD_DATA",
        )
      : error.type === "entity.parse.failed"
        ? new AppError("INVALID_JSON")
        : error;

  const isAppError = normalizedError instanceof AppError;

  const statusCode = isAppError ? normalizedError.statusCode : 500;

  const code = isAppError ? normalizedError.code : "INTERNAL_ERROR";

  const message =
    statusCode >= 500
      ? (ERROR_DICTIONARY[code]?.message ??
        ERROR_DICTIONARY.INTERNAL_ERROR.message)
      : normalizedError.message;

  if (statusCode >= 500) {
    logger.error(`[${code}] ${req.method} ${req.path} - ${error.message}`);
  } else {
    logger.warning(`[${code}] ${req.method} ${req.path} - ${message}`);
  }

  return res.status(statusCode).json({
    status: "error",
    code,
    message,
  });
};
