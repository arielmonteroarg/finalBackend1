import { Router } from 'express';
import CartManager from '../dao/CartManager.js';

const router = Router();
const cartManager = new CartManager('carts.json');

// Crear carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Agregar producto a carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = await cartManager.addProductToCart(cid, pid);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ver carrito por ID
router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cid);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

export default router;
