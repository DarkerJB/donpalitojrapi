const modelo = require('../modelo/UsuarioModelo');

class UsuarioControlador {
  // Crear un nuevo usuario
  static async crearUsuario(req, res) {
    const { t1: documento, t2: nombreCompleto, t3: telefono, t4: correo, t5: contrasena } = req.body;

    try {
      // Validación de datos
      if (!documento || !nombreCompleto || !telefono || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      if (!/^\S+@\S+\.\S+$/.test(correo)) { // Validar formato de correo
        return res.status(400).json({ error: 'Correo electrónico no válido.' });
      }

      // Crear usuario en la BD
      const result = await modelo.crearUsuarios(documento, nombreCompleto, telefono, correo, contrasena);

      if (result.insertId) {
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', id: result.insertId });
      } else {
        res.status(500).json({ error: 'No se pudo obtener el ID del usuario creado.' });
      }

    } catch (err) {
      console.error('❌ Error en crearUsuario:', err.message);
      res.status(500).json({ error: `Error en el servidor: ${err.message}` });
    }
  }
}

module.exports = UsuarioControlador;