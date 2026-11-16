import Product from "../models/product.model.js";

class ProductRepository {
  async getAll(filters = {}) {
    const query = {};
    if (filters.status) {
      query.status = filters.status;
    }
    return Product.find(query)
      .select("name description price stock status createdAt")
      .lean();
  }

  async getById(id) {
    return Product.findById(id);
  }

  async create(productData) {
    return Product.create(productData);
  }
}

export default new ProductRepository();
