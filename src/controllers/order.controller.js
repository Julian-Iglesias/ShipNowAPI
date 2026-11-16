import orderService from "../services/order.service.js";
import logger from "../config/logger.js";

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAll();
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);
      logger.info(`Pedido creado: ${order._id}`);
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        req.body?.status,
      );

      logger.info(`Estado de pedido actualizado: ${order._id}`);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
