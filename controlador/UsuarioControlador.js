const modelo = require('../modelo/UsuarioModelo');
const bcrypt = require('bcrypt');

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

  // Buscar usuario por nombres
  static async buscarUsuario(req, res) {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'El parámetro "name" es obligatorio.' });
    }
    try {
      const usuarios = await modelo.buscarPorNombres(name);
      res.status(200).json(usuarios);
    } catch (err) {
      res.status(500).json({ error: `Error: no se pudo buscar el usuario: ${err.message}` });
    }
  }

  // Inicio de sesión
  static async iniciarSesion(req, res) {
    const { correo, contrasena } = req.body;

    try {
      // Validación de datos
      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
      }

      if (!/^\S+@\S+\.\S+$/.test(correo)) { // Validar formato de correo
        return res.status(400).json({ error: 'Correo electrónico no válido.' });
      }

      // Buscar usuario en la base de datos
      const [usuario] = await modelo.buscarPorCorreo(correo);

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      // Verificar si el usuario está activo
      if (usuario.estado !== 'Activo') {
        return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
      }

      // Comparar contraseñas usando bcrypt
      const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!contrasenaValida) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      // Devolver información básica del usuario (sin datos sensibles)
      const usuarioSeguro = {
        idUsuario: usuario.idUsuario,
        nombreCompleto: usuario.nombreCompleto,
        correo: usuario.correo,
        rol: usuario.rol,
      };

      res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: usuarioSeguro });

    } catch (err) {
      console.error('❌ Error en iniciarSesion:', err.message);
      res.status(500).json({ error: `Error en el servidor: ${err.message}` });
    }
  }
}

module.exports = UsuarioControlador;