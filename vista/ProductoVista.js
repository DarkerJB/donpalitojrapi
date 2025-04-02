const express = require('express');
const ruta = require('../controlador/ProductoControlador');
const router = express.Router();

// Rutas para productos
router.post('/', ruta.agregarProducto); // Agregar producto
router.put('/:id', ruta.modificarProducto); // Modificar producto
router.delete('/:id', ruta.eliminarProducto); // Eliminar producto
router.put('/:id/precio', ruta.actualizarPrecio); // Actualizar precio

module.exports = router;