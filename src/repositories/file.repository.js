import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Delivery from "../models/delivery.model.js";

const models = {
  users: { model: User, field: "documents" },
  orders: { model: Order, field: "proofs" },
  deliveries: { model: Delivery, field: "proofs" },
};

class FileRepository {
  async attach(kind, id, metadata) {
    const { model, field } = models[kind];

    const updated = await model
      .findByIdAndUpdate(
        id,
        { $push: { [field]: metadata } },
        { returnDocument: "after", runValidators: true },
      )
      .lean();

    if (!updated) return null;

    return updated[field].at(-1);
  }
}

export default new FileRepository();
