import Order from "../models/order.model.js";

class OrderRepository {
  async getAll() {
    return Order.find().lean();
  }

  async getById(id) {
    return Order.findById(id).lean();
  }

  async create(data) {
    return Order.create(data);
  }

  async updateStatus(id, status) {
    return Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true },
    ).lean();
  }

  async createMany(orders) {
    return Order.insertMany(orders, { ordered: true });
  }
}

export default new OrderRepository();
