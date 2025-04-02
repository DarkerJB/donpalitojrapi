const conexion = require('./bd/Conexion');
const bcrypt = require('bcrypt');

class UsuarioModelo {
  // Crear un nuevo usuario
  static async crearUsuarios(doc, name, tel, email, contras) {
    const query =
      'INSERT INTO usuarios (documento, nombreCompleto, telefono, correo, contrasena, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';

    try {
      // Validar entrada
      if (!doc || !name || !tel || !email || !contras) {
        throw new Error('Todos los campos son obligatorios.');
      }

      // Generar el hash de la contraseña con bcrypt
      const saltRounds = 10; // Nivel de seguridad de encriptación
      const contraHash = await bcrypt.hash(contras, saltRounds);

      // Insertar el usuario en la base de datos
      return await conexion.query(query, [
        doc,
        name,
        tel,
        email,
        contraHash, // Almacenar la contraseña encriptada
        'Cliente', // Rol predeterminado para el cliente
        'Activo', // Estado predeterminado
      ]);
    } catch (err) {
      console.error('❌ Error al crear el usuario:', err.message);
      throw new Error(`Error al crear el usuario: ${err.message}`);
    }
  }

  // Buscar usuario por nombres (autocompletado)
  static async buscarPorNombres(name) {
    const query = 'SELECT * FROM usuarios WHERE nombreCompleto LIKE ?';
    try {
      return await conexion.query(query, [`%${name}%`]);
    } catch (err) {
      throw new Error(`Error al buscar el usuario por nombres: ${err.message}`);
    }
  }

  // Buscar usuario por correo electrónico (para inicio de sesión)
  static async buscarPorCorreo(email) {
    const query = 'SELECT * FROM usuarios WHERE correo = ? AND estado = "Activo"';
    try {
      const [usuario] = await conexion.query(query, [email]);
      return usuario; // Devuelve el usuario encontrado o undefined si no existe
    } catch (err) {
      throw new Error(`Error al buscar el usuario por correo: ${err.message}`);
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
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }
}

module.exports = UsuarioModelo;