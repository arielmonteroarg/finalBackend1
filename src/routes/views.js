// src/routes/views.js
import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';  // <- Importamos ProductManager
import authMiddleware  from '../middlewares/auth.js';

const router = Router();
const productManager = new ProductManager(); // <- Creamos una instancia de ProductManager

// Home - muestra productos -paginacion

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productManager.getProductsPaginated({ limit, page, sort, query });


    res.render('home', {
      title: 'Página Principal',
      user: req.session.user,
      products: result.payload,          
      currentPage: result.currentPage,  
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      totalPages: result.totalPages
    });

  } catch (error) {
    console.error('Error al obtener productos paginados', error);
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