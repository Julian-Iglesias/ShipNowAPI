
import AppError from "../utils/AppError.js";
import { ERROR_DICTIONARY } from "../errors/errorDictionary.js";

export const errorHandler = (error, req, res, next) => {

  if (res.headersSent) {
    return next(error);
  }

  const normalizedError =
    error.type === "entity.parse.failed"
      ? new AppError("INVALID_JSON")
      : error;

  const isAppError = normalizedError instanceof AppError;

  const statusCode = isAppError
    ? normalizedError.statusCode
    : 500;

  const code = isAppError
    ? normalizedError.code
    : "INTERNAL_ERROR";

  const message = statusCode >= 500
    ? code === "SEED_FAILED"
      ? ERROR_DICTIONARY.SEED_FAILED.message
      : ERROR_DICTIONARY.INTERNAL_ERROR.message
    : normalizedError.message;

  if (statusCode >= 500) {
    console.error("Error del servidor:", error);
  }

  return res.status(statusCode).json({
    status: "error",
    code,
    message
  });
};
