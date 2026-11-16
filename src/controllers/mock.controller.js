import mockService from "../services/mock.service.js";
import seedService from "../services/seed.service.js";
import { parseMockQuantity } from "../utils/parseMockQuantity.js";

class MockController {
  getUsers(req, res, next) {
    try {
      const qty = parseMockQuantity(req.query.qty);

      const users = mockService.generateUsers(qty);

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  getCouriers(req, res, next) {
    try {
      const qty = parseMockQuantity(req.query.qty);

      const couriers = mockService.generateCouriers(qty);

      return res.status(200).json(couriers);
    } catch (error) {
      next(error);
    }
  }

  getOrders(req, res, next) {
    try {
      const qty = parseMockQuantity(req.query.qty);

      const data = mockService.generateOrders(qty);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  getDeliveries(req, res, next) {
    try {
      const qty = parseMockQuantity(req.query.qty);

      const data = mockService.generateDeliveries(qty);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async seed(req, res, next) {
    try {
      const qty = parseMockQuantity(req.query.qty);

      const result = await seedService.seed(qty);

      return res.status(201).json({
        status: "success",
        message: "Datos de prueba insertados correctamente",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MockController();
