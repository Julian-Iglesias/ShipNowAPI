import { fakerES as faker } from "@faker-js/faker";
import {
  USER_ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
} from "../constants/index.js";
import AppError from "../utils/AppError.js";

class MockService {
  generateUsers(qty = 2) {
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      throw new AppError("INVALID_MOCK_QUANTITY");
    }

    return Array.from({ length: qty }, () => ({
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: `test-${faker.string.uuid()}@example.com`,
      role: faker.helpers.arrayElement([USER_ROLES.USER, USER_ROLES.COURIER]),
    }));
  }

  generateCouriers(qty = 2) {
    return this.generateUsers(qty).map((user) => ({
      ...user,
      role: USER_ROLES.COURIER,
    }));
  }

  generateOrders(qty = 2) {
    const users = this.generateUsers(qty).map((user) => ({
      ...user,
      role: USER_ROLES.USER,
    }));

    const orders = Array.from({ length: qty }, (_, index) => ({
      _id: faker.database.mongodbObjectId(),
      user: users[index]._id,
      description: faker.commerce.productName(),
      total: faker.number.int({ min: 1000, max: 100000 }),
      status: ORDER_STATUS.PENDING,
      priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
    }));

    return { users, orders };
  }

  generateDeliveries(qty = 2) {
    const { users, orders } = this.generateOrders(qty);

    const couriers = this.generateCouriers(qty);

    const deliveries = Array.from({ length: qty }, (_, index) => ({
      _id: faker.database.mongodbObjectId(),

      order: orders[index]._id,

      courier: couriers[index]._id,

      status: DELIVERY_STATUS.IN_TRANSIT,

      deliveredAt: null,
    }));

    orders.forEach((order) => {
      order.status = ORDER_STATUS.IN_TRANSIT;
    });

    return {
      users,
      couriers,
      orders,
      deliveries,
    };
  }
}

export default new MockService();
