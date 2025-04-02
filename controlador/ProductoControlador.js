const modelo = require('../modelo/ProductoModelo');

class ProductoControlador {
  // Agregar un nuevo producto
  static async agregarProducto(req, res) {
    //Agregar seudónimo a los campos para que no se vean los nombres de la base de datos
    const { t1: nomProd, t2: descProd, t3: precProd, t4: cantiProd, t5: imgProd } = req.body;
    try {
      const result = await modelo.agregarProducto(nomProd, descProd, precProd, cantiProd, imgProd);
      res.status(201).json({ mensaje: 'Producto agregado exitosamente', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: `Error: no se pudo agregar el producto: ${err.message}` });
    }
  }

  // Modificar un producto existente
  static async modificarProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad, imagen } = req.body;
    try {
      await modelo.modificarProducto(id, nombre, descripcion, precio, cantidad, imagen);
      res.status(200).json({ mensaje: 'Producto modificado exitosamente' });
    } catch (err) {
      res.status(500).json({ error: `Error: no se pudo modificar el producto: ${err.message}` });
    }
  }

  // Desactivar un producto
  static async eliminarProducto(req, res) {
    const { id } = req.params;
    try {
      await modelo.eliminarProducto(id);
      res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (err) {
      res.status(500).json({ error: `Error: no se pudo eliminar el producto: ${err.message}` });
    }
  }

  // Actualizar el precio de un producto
  static async actualizarPrecio(req, res) {
    const { id } = req.params;
    const { nuevoPrecio } = req.body;
    try {
      await modelo.actualizarPrecio(id, nuevoPrecio);
      res.status(200).json({ mensaje: 'Precio actualizado exitosamente' });
    } catch (err) {
      res.status(500).json({ error: `Error: no se pudo actualizar el precio: ${err.message}` });
    }
  }
}

module.exports = ProductoControlador;