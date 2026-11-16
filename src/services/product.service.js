import productRepository from "../repositories/product.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";
import AppError from "../utils/AppError.js";

class ProductService {
  async getAll(filters = {}) {
    if (
      filters.status !== undefined &&
      !Object.values(PRODUCT_STATUS).includes(filters.status)
    ) {
      throw new AppError("Estado de producto inválido", 400);
    }

    return productRepository.getAll(filters);
  }

  async getById(id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new AppError("El ID del producto no es válido", 400);
    }

    const product = await productRepository.getById(id);

    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }

    return product;
  }

  async create(productData) {
    const { name, price, stock, description = "" } = productData;

    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("El nombre del producto es obligatorio", 400);
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      throw new AppError(
        "El precio debe ser un número válido y no negativo",
        400,
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new AppError("El stock debe ser un número entero no negativo", 400);
    }

    const status =
      stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

    const newProduct = {
      name,
      description,
      price,
      stock,
      status,
    };
    return productRepository.create(newProduct);
  }
}

export default new ProductService();
