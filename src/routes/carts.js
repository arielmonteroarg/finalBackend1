import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();
const cartManager = new CartManager();

// Ver carrito del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.user._id;

    const cart = await cartManager.getCartByUserId(userId); // <-- Usa el manager correctamente

    if (!cart) {
      return res.render('cart', {
        cart: { products: [] },
        title: 'Tu Carrito',
        user: req.session.user
      });
    }
    const total = cart.products.reduce((sum, item) => {
  return sum + item.product.price * item.quantity;
}, 0);

res.render('cart', { cart, total, title: 'Mi Carrito', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el carrito');
  }
});

// Agregar producto al carrito
router.post('/agregar/:pid', authMiddleware, async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.pid;

  try {
    await cartManager.addProduct(userId, productId);
    res.status(200).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aumentar cantidad de un producto
router.post('/aumentar/:pid', authMiddleware, async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.pid;

  try {
    await cartManager.updateQuantity(userId, productId, 1);
    res.status(200).json({ mensaje: 'Cantidad aumentada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disminuir cantidad de un producto
router.post('/disminuir/:pid', authMiddleware, async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.pid;

  try {
    await cartManager.updateQuantity(userId, productId, -1);
    res.status(200).json({ mensaje: 'Cantidad disminuida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/eliminar/:pid', authMiddleware, async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.pid;

  try {
    await cartManager.removeProduct(userId, productId);
    res.status(200).json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/vaciar', authMiddleware, async (req, res) => {
  const userId = req.session.user._id;
  try {
    await cartManager.clearCart(userId);
    res.status(200).json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
