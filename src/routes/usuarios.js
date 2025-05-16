import express from 'express';
import validarUsuario from '../middlewares/validarUsuario.js';
import UsuarioManager from '../dao/UserManager.js'; // Importamos el manager

const router = express.Router();
const userManager = new UsuarioManager(); // Instanciamos el manager

// Trae todos los usuarios creados
router.get('/', async (req, res) => {
  try {
    const usuarios = await userManager.getUsers(); // Usamos el manager
    console.log(usuarios);
    res.render('users', { users: usuarios,title: 'Usuarios',user: req.session.user});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Muestra formulario de registro
router.get('/registro', (req, res) => {
  res.render('registro');
});

// Procesa registro de usuario
router.post('/registro', validarUsuario, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    await userManager.createUser({ nombre, email, password, rol });
    console.log('🔵 Usuario guardado');
    res.redirect('/api/usuarios/');
  } catch (error) {
    console.error('❌ Error al guardar el usuario:', error);
    res.status(500).send(error.message); // Usamos el mensaje de error del manager
  }
});

// Muestra formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Procesa login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await userManager.getUserByEmail(email); // Usamos el manager

    if (!usuario || usuario.password !== password) {
      return res.status(401).send('Credenciales inválidas');
    }

    req.session.user = {
      _id: usuario._id,
      name: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Cierra sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/api/usuarios/login');
  });
});


router.get('/test-session', (req, res) => {
  req.session.prueba = 'ok';
  res.send(req.session.user);
});

router.get('/ver-session', (req, res) => {
  res.send(req.session);
});





export default router;

