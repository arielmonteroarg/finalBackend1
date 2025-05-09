// src/app.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import logger from './src//middlewares/logger.js';

import conectarDB from './db.js';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import viewsRouter from './src/routes/views.js';
import usuariosRouter from './src/routes/usuarios.js';

conectarDB();
const app = express();
const httpServer = createServer(app); // <--- Servidor HTTP
const io = new Server(httpServer);    // <--- Servidor de Websockets

const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretoSuperSecreto123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,// O true si usás HTTPS
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 30 // 30 minutos
  } 
}));


// Handlebars setup
/* app.engine('handlebars', engine()); */
app.engine('handlebars',engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  partialsDir: path.join(__dirname, 'src', 'views','partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Guardar io en app.locals para usarlo en rutas
app.locals.io = io;
app.use(logger);
// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/usuarios', usuariosRouter); 


// Socket.IO conexiones
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

// Server
httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
