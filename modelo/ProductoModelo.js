const dbService = require('./bd/Conexion');
const bcrypt = require('bcrypt');

class ProductoModelo {
  // Agregar un nuevo producto
  static async agregarProducto(nombre, descripcion, precio, cantidad, imagen) {
    const query = 'INSERT INTO productos (nombre, descripcion, precio, cantidad, imagen, estado) VALUES (?, ?, ?, ?, ?, ?)';
    try {
      return await dbService.query(query, [nombre, descripcion, precio, cantidad, imagen, 'Activo']);
    } catch (err) {
      throw new Error(`Error al agregar el producto: ${err.message}`);
    }
  }

  // Modificar un producto existente
  static async modificarProducto(idProducto, nombre, descripcion, precio, cantidad, imagen) {
    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, imagen = ? WHERE idProducto = ?';
    try {
      return await dbService.query(query, [nombre, descripcion, precio, cantidad, imagen, idProducto]);
    } catch (err) {
      throw new Error(`Error al modificar el producto: ${err.message}`);
    }
  }

  // Desactivar un producto (eliminar lógico)
  static async eliminarProducto(idProducto) {
    const query = 'UPDATE productos SET estado = ? WHERE idProducto = ?';
    try {
      return await dbService.query(query, ['Inactivo', idProducto]);
    } catch (err) {
      throw new Error(`Error al eliminar el producto: ${err.message}`);
    }
  }

  // Actualizar el precio de un producto
  static async actualizarPrecio(idProducto, nuevoPrecio) {
    const query = 'UPDATE productos SET precio = ? WHERE idProducto = ?';
    try {
      return await dbService.query(query, [nuevoPrecio, idProducto]);
    } catch (err) {
      throw new Error(`Error al actualizar el precio del producto: ${err.message}`);
    }
  }
}

module.exports = ProductoModelo;