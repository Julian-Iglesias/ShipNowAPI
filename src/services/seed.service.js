import mockService from "./mock.service.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";
import config from "../config/env.config.js";
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";

class SeedService {
  async seed(qty = 2) {
    if (!["development", "test"].includes(config.nodeEnv)) {
      throw new AppError("SEED_FORBIDDEN");
    }

    if (
      config.nodeEnv === "test" &&
      mongoose.connection.name !== "shipnow_test"
    ) {
      throw new AppError("SEED_FORBIDDEN");
    }

    const { users, couriers, orders, deliveries } =
      mockService.generateDeliveries(qty);

    try {
      await userRepository.createMany([...users, ...couriers]);

      await orderRepository.createMany(orders);

      await deliveryRepository.createMany(deliveries);
    } catch (error) {
      logger.error(
        `Falló la carga de datos de prueba. Tipo: ${error.name}, código: ${error.code ?? "N/A"}`,
      );

      throw new AppError("SEED_FAILED");
    }

    logger.info(
      `Seed completado: ${users.length} usuarios, ` +
        `${couriers.length} repartidores, ` +
        `${orders.length} pedidos y ` +
        `${deliveries.length} entregas`,
    );

    return {
      inserted: {
        users: users.length,
        couriers: couriers.length,
        orders: orders.length,
        deliveries: deliveries.length,
      },
    };
  }
}

export default new SeedService();
