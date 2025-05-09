// src/dao/ProductManager.js
import Product from '../models/Product.js';

class ProductManager {
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