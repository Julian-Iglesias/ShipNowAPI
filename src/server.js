import app from "./app.js";
import config from "./config/env.config.js";
import { connectDB } from "./config/db.js";
import logger from "./config/logger.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      logger.info(`Servidor ShipNow escuchando en el puerto ${config.port}`);
    });
  } catch (error) {
    logger.fatal(`No se pudo iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
