import mockService from "../services/mock.service.js";
import seedService from "../services/seed.service.js";

class MockController {
  async getUsers(req, res) {
    try {
      const qty = req.query.qty === undefined ? 2 : Number(req.query.qty);

      const users = mockService.generateUsers(qty);

      return res.status(200).json(users);
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async getCouriers(req, res) {
    try {
      const qty = req.query.qty === undefined ? 2 : Number(req.query.qty);

      const couriers = mockService.generateCouriers(qty);

      return res.status(200).json(couriers);
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async getOrders(req, res) {
    try {
      const qty = req.query.qty === undefined ? 2 : Number(req.query.qty);

      const data = mockService.generateOrders(qty);

      return res.status(200).json(data);
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async getDeliveries(req, res) {
    try {
      const qty = req.query.qty === undefined ? 2 : Number(req.query.qty);

      const data = mockService.generateDeliveries(qty);

      return res.status(200).json(data);
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async seed(req, res) {
    try {
      const qty = req.query.qty === undefined ? 2 : Number(req.query.qty);

      const result = await seedService.seed(qty);

      return res.status(201).json({
        status: "success",
        message: "Datos de prueba insertados correctamente",
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;

      if (statusCode === 500) {
        console.error("Error al ejecutar seed:", error);
      }

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }
}

export default new MockController();
