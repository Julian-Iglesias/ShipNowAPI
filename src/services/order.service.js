import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";
import AppError from "../utils/AppError.js";

const validId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

class OrderService {
  async getAll() {
    return orderRepository.getAll();
  }

  async getById(id) {
    if (!validId(id)) {
      throw new AppError("INVALID_ORDER_ID");
    }

    const order = await orderRepository.getById(id);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }

  async create(data) {
    const {
      user,
      description,
      total,
      priority = ORDER_PRIORITY.MEDIUM,
    } = data ?? {};

    if (
      !validId(user) ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof total !== "number" ||
      !Number.isFinite(total) ||
      total < 0 ||
      !Object.values(ORDER_PRIORITY).includes(priority)
    ) {
      throw new AppError("INVALID_ORDER_DATA");
    }

    const existingUser = await userRepository.getById(user);

    if (!existingUser) {
      throw new AppError("USER_NOT_FOUND");
    }

    return orderRepository.create({
      user,
      description: description.trim(),
      total,
      priority,
      status: ORDER_STATUS.PENDING,
    });
  }

  async updateStatus(id, status) {
    if (!validId(id)) {
      throw new AppError("INVALID_ORDER_ID");
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new AppError("INVALID_ORDER_STATUS");
    }

    const order = await orderRepository.updateStatus(id, status);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }
}

export default new OrderService();
