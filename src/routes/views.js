// src/routes/views.js
import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';  // <- Importamos ProductManager
import authMiddleware  from '../middlewares/auth.js';

const router = Router();
const productManager = new ProductManager(); // <- Creamos una instancia de ProductManager

// Home - muestra productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts(); // Obtenemos los productos desde MongoDB
    res.render('home', {
      title: 'Página Principal',  // Datos de layout/título
      user: req.session.user,     // Datos de sesión
      products: products          // Lista de productos
    });
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).send('Error interno del servidor');
  }
});

// RealTimeProducts - formulario
router.get('/realtimeproducts', authMiddleware, async (req, res) => {
  try {
    const products = await productManager.getProducts(); // Obtenemos los productos desde MongoDB
    res.render('realtimeproducts', { products, title: 'Productos', user: req.session.user });
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;