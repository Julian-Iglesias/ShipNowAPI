import productService from "../services/product.service.js";

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAll(req.query);

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);

      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);

      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
