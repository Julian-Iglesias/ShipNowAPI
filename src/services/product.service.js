import productRepository from "../repositories/product.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";
import AppError from "../utils/AppError.js";

class ProductService {
  async getAll(filters = {}) {
    if (
      filters.status !== undefined &&
      !Object.values(PRODUCT_STATUS).includes(filters.status)
    ) {
      throw new AppError("INVALID_PRODUCT_STATUS");
    }

    return productRepository.getAll(filters);
  }

  async getById(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new AppError("INVALID_PRODUCT_ID");
    }

    const product = await productRepository.getById(id);

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async create(productData) {
    const { name, price, stock, description = "" } = productData ?? {};

    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("INVALID_PRODUCT_NAME");
    }

    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      throw new AppError("INVALID_PRODUCT_PRICE");
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new AppError("INVALID_PRODUCT_STOCK");
    }

    const status =
      stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

    const newProduct = {
      name: name.trim(),
      description,
      price,
      stock,
      status,
    };

    return productRepository.create(newProduct);
  }
}

export default new ProductService();
