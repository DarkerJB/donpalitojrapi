require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const registrousuario = require('./vista/UsuarioVista');

const app = express();
const PORT = process.env.PORT || 4545;

// Middleware de CORS
app.use(cors({
  origin: '*', // Cambiar por dominios permitidos en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parseo de solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', registrousuario);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('🔥 Error en el servidor:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});