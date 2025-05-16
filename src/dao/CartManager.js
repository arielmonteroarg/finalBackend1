// src/dao/CartManager.js
import Cart from '../models/Cart.js';

class CartManager {
  async getCartByUserId(userId) {
    if (!userId) throw new Error('Falta userId para buscar el carrito');

    return await Cart.findOne({ userId })
      .populate('products.product')
      .lean();
  }

  async createCart(userId) {
    if (!userId) throw new Error('Falta userId para crear carrito');
    return await Cart.create({ userId, products: [] });
  }

  async addProduct(userId, productId) {
    let cart = await this.getCartByUserId(userId);
    if (!cart) cart = await this.createCart(userId);

    const existing = cart.products.find(p => p.product._id.toString() === productId.toString());

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await Cart.findOneAndUpdate({ userId }, cart, { new: true });
  }

  async updateQuantity(userId, productId, delta) {
    const cart = await this.getCartByUserId(userId);
    if (!cart) throw new Error('No se encontró el carrito');

    const prod = cart.products.find(p => p.product._id.toString() === productId.toString());
    if (!prod) throw new Error('Producto no encontrado en el carrito');

    prod.quantity += delta;

    if (prod.quantity <= 0) {
      cart.products = cart.products.filter(p => p.product._id.toString() !== productId.toString());
    }

    return await Cart.findOneAndUpdate({ userId }, cart, { new: true });
  }

  async removeProduct(userId, productId) {
    const cart = await this.getCartByUserId(userId);
    if (!cart) throw new Error('No se encontró el carrito');

    cart.products = cart.products.filter(p => p.product._id.toString() !== productId.toString());

    return await Cart.findOneAndUpdate({ userId }, cart, { new: true });
  }


  async clearCart(userId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('No se encontró carrito');
  cart.products = [];
  await cart.save();
}
}

export default CartManager;
