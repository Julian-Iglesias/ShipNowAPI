import Order from "../models/order.model.js";

class OrderRepository {

    async createMany(ordersData) {
        return Order.insertMany(ordersData, {
            ordered: true
        });
    }

}

export default new OrderRepository();