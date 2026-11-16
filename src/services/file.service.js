import fs from "node:fs/promises";
import path from "node:path";
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import fileRepository from "../repositories/file.repository.js";

const documentTypes = ["DNI", "PASSPORT", "LICENSE"];

const idErrors = {
  users: "INVALID_USER_ID",
  orders: "INVALID_ORDER_ID",
  deliveries: "INVALID_DELIVERY_ID",
};

const notFoundErrors = {
  users: "USER_NOT_FOUND",
  orders: "ORDER_NOT_FOUND",
  deliveries: "DELIVERY_NOT_FOUND",
};

async function validateSignature(file) {
  const handle = await fs.open(file.path, "r");

  let bytes;

  try {
    bytes = Buffer.alloc(8);
    await handle.read(bytes, 0, 8, 0);
  } finally {
    await handle.close();
  }

  const pdf = bytes.subarray(0, 5).toString() === "%PDF-";

  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  const png = bytes
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  const valid =
    (file.mimetype === "application/pdf" && pdf) ||
    (file.mimetype === "image/jpeg" && jpg) ||
    (file.mimetype === "image/png" && png);

  if (!valid) {
    logger.warning("Archivo rechazado por contenido no permitido");
    throw new AppError("INVALID_FILE_TYPE");
  }
}

class FileService {
  async save(kind, id, file, requestedDocumentType) {
    if (!file) {
      throw new AppError("FILE_REQUIRED");
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new AppError(idErrors[kind]);
    }

    if (kind === "users" && !documentTypes.includes(requestedDocumentType)) {
      throw new AppError("INVALID_DOCUMENT_TYPE");
    }

    const documentType =
      kind === "users"
        ? requestedDocumentType
        : kind === "orders"
          ? "ORDER_PROOF"
          : "DELIVERY_PROOF";

    try {
      await validateSignature(file);

      const metadata = {
        originalName: path
          .basename(file.originalname.replace(/\\/g, "/"))
          .slice(0, 150),
        storedName: file.filename,
        path: path.relative(process.cwd(), file.path).replace(/\\/g, "/"),
        mimeType: file.mimetype,
        size: file.size,
        documentType,
        uploadedAt: new Date(),
      };

      const saved = await fileRepository.attach(kind, id, metadata);

      if (!saved) {
        throw new AppError(notFoundErrors[kind]);
      }

      logger.info(`Archivo asociado correctamente a ${kind}, ID ${id}`);

      return saved;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error(`Error al guardar archivo: ${error.name}`);

      throw new AppError("FILE_SAVE_FAILED");
    }
  }
}

export default new FileService();
