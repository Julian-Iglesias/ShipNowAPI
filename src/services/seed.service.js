import mockService from "./mock.service.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";
import config from "../config/env.config.js";
import AppError from "../utils/AppError.js";

class SeedService {
  async seed(qty = 2) {
    if (config.nodeEnv !== "development") {
      throw new AppError("SEED_FORBIDDEN");
    }

    const { users, couriers, orders, deliveries } =
      mockService.generateDeliveries(qty);

    try {
      await userRepository.createMany([...users, ...couriers]);

      await orderRepository.createMany(orders);

      await deliveryRepository.createMany(deliveries);
    } catch (error) {
      console.error("Error al insertar datos de prueba:", error);

      throw new AppError("SEED_FAILED");
    }

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
