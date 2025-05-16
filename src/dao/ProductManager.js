// src/dao/ProductManager.js
import Product from '../models/Product.js';

class ProductManager {



  async getProductsPaginated({ limit = 10, page = 1, sort, query }) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };

    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const filter = {};

    if (query) {
      if (query.startsWith('category=')) {
        filter.category = query.split('=')[1];
      } else if (query.startsWith('status=')) {
        filter.status = query.split('=')[1] === 'true';
      }
    }

    return await Product.paginate(filter, options);
  }



  async getProducts() {
    try {
      return await Product.find().lean(); // lean() devuelve objetos planos
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id).lean(); // lean() para usar con Handlebars
    } catch (error) {
      console.error(`Error al obtener producto por ID: ${error.message}`);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await Product.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default ProductManager;