import productService from "../services/product.service.js";

class ProductController {
  async getAll(req, res) {
    try {
      const products = await productService.getAll(req.query);

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await productService.getById(id);

      return res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const product = await productService.create(req.body);

      return res.status(201).json({
        status: "success",
        message: "Producto creado correctamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        status: "error",
        message:
          statusCode === 500 ? "Error interno del servidor" : error.message,
      });
    }
  }
}

export default new ProductController();
