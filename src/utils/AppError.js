import { ERROR_DICTIONARY } from "../errors/errorDictionary.js";

class AppError extends Error {
  constructor(codeOrMessage, statusCode) {
    const isKnown =
      typeof codeOrMessage === "string" &&
      Object.hasOwn(ERROR_DICTIONARY, codeOrMessage);

    const errorInfo = isKnown ? ERROR_DICTIONARY[codeOrMessage] : null;

    super(errorInfo?.message ?? codeOrMessage);

    this.name = "AppError";

    this.code = isKnown ? codeOrMessage : "APP_ERROR";

    this.statusCode = errorInfo?.statusCode ?? statusCode ?? 500;
  }
}

export default AppError;
