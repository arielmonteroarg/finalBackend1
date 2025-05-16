// src/routes/products.js
import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js';
import authMiddleware  from '../middlewares/auth.js';


const router = Router();
const productManager = new ProductManager();

// GET productos
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
     const { limit = 10, page = 1, sort, query } = req.query;
    const products = await productManager.getProductsPaginated({ limit, page, sort, query }); // Obtenemos los productos desde MongoDB
    res.render('realtimeproducts', {
   products,
      title: 'Productos',
      user: req.session.user,
      products: products.payload,          
      currentPage: products.currentPage,  
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      totalPages: products.totalPages
    });
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).send('Error interno del servidor');
  }
});







// GET producto por ID
router.get('/detalleproduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log(product);

    // Renderizar la vista detalleProducto.handlebars
    res.render('detalleproduct', { product,title: 'Detalle de Productos', user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});





// POST agregar producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    // Emitir evento a todos los clientes conectados
    const io = req.app.locals.io;
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// PUT actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productManager.updateProduct(pid, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const io = req.app.locals.io;
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});


// DELETE eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const io = req.app.locals.io;
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;