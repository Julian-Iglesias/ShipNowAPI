import { unlink } from "node:fs/promises";
import fileService from "../services/file.service.js";
import logger from "../config/logger.js";

const uploadFile = (kind) => async (req, res, next) => {
  try {
    const file = await fileService.save(
      kind,
      req.params.id,
      req.file,
      req.body?.documentType,
    );

    return res.status(201).json({
      status: "success",
      message: "Archivo cargado correctamente",
      data: {
        entityId: req.params.id,
        file,
      },
    });
  } catch (error) {
    if (req.file?.path) {
      try {
        await unlink(req.file.path);
      } catch (cleanupError) {
        logger.error(`No se pudo limpiar un archivo: ${cleanupError.message}`);
      }
    }

    next(error);
  }
};

class FileController {
  uploadUserDocument = uploadFile("users");
  uploadOrderProof = uploadFile("orders");
  uploadDeliveryProof = uploadFile("deliveries");
}

export default new FileController();
