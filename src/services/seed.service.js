import mockService from "./mock.service.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";
import config from "../config/env.config.js";
import AppError from "../utils/AppError.js";

class SeedService {
  async seed(qty = 2) {
    if (config.nodeEnv !== "development") {
      throw new AppError(
        "La carga de prueba solo está permitida en desarrollo",
        403,
      );
    }

    const { users, couriers, orders, deliveries } =
      mockService.generateDeliveries(qty);

    await userRepository.createMany([...users, ...couriers]);

    await orderRepository.createMany(orders);

    await deliveryRepository.createMany(deliveries);

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
