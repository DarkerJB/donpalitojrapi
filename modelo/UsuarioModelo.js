const conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt');

class UsuarioModelo {
  // Crear un nuevo usuario
  static async crearUsuarios(documento, nombreCompleto, telefono, correo, contrasena) {
    const query =
      'INSERT INTO usuarios (documento, nombreCompleto, telefono, correo, contrasena, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
      // Validar entrada
      if (!documento || !nombreCompleto || !telefono || !correo || !contrasena) {
        throw new Error('Todos los campos son obligatorios.');
      }

      // Generar el hash de la contraseña con bcrypt
      const saltRounds = 10; // Nivel de seguridad de encriptación
      const contraHash = await bcrypt.hash(contrasena, saltRounds);

      // Insertar el usuario en la base de datos
      return await conexion.query(query, [
        documento,
        nombreCompleto,
        telefono,
        correo,
        contraHash,
        'Admin', // Rol predeterminado para el administrador
        'Activo', // Estado predeterminado
      ]);
    } catch (err) {
      console.error('❌ Error al crear el usuario:', err.message);
      throw err;
    }
  }

  // Obtener todos los usuarios (opcional)
  static async obtenerUsuarios() {
    try {
      const query = 'SELECT * FROM usuarios';
      const resultados = await conexion.query(query);
      return resultados;
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error.message);
      throw error;
    }
  }
}

module.exports = UsuarioModelo;