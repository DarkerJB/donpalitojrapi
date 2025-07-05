//controlador/admin/LoginAdminControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import bcrypt from "bcrypt";

export class LoginAdminControlador {
  static async login(req, res) {
    try {
      // Verificar si ya hay token en la cabecera
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
          error: "Ya tienes una sesión activa, cierra sesión antes de volver a iniciar."
        });
      }

      // Obtener datos desde el body o desde los aliases t1, t4, t5
      const {
        t1, t4, t5,
        documento: d, correo: c, contrasena: p
      } = req.body;

      const documento = d || t1;
      const correo = c || t4;
      const contrasena = p || t5;

      if (!documento || !correo || !contrasena) {
        return res.status(400).json({
          error: "Todos los campos son obligatorios."
        });
      }

      // Buscar usuario sin filtrar por rol
      const usuarioGeneral = await AdminModelo.buscarPorDocumentoYCorreoSinRol(documento, correo);
      if (!usuarioGeneral) {
        return res.status(401).json({ error: "Credenciales incorrectas." });
      }

      // Validar rol
      if (usuarioGeneral.rol !== "Administrador") {
        return res.status(403).json({
          error: "Usted no tiene permisos para iniciar sesión como administrador."
        });
      }

      // Validar estado (basado en ENUM: 'Activo', 'Inactivo', 'Bloqueado')
      if (usuarioGeneral.estado === "Inactivo") {
        return res.status(403).json({ error: "Cuenta inactiva. Contacte al administrador." });
      }

      if (usuarioGeneral.estado === "Bloqueado") {
        return res.status(403).json({ error: "Cuenta bloqueada por múltiples intentos fallidos." });
      }

      // Validar contraseña
      const coincide = await bcrypt.compare(contrasena, usuarioGeneral.contrasena);
      if (!coincide) {
        await AdminModelo.incrementarIntentosFallidos(documento);
        await AdminModelo.bloquearSiSuperaIntentos(documento);
        return res.status(401).json({
          error: "Credenciales incorrectas."
        });
      }

      // Reiniciar intentos si la contraseña es correcta
      await AdminModelo.reiniciarIntentosFallidos(documento);

      // Validar si ya hay sesión activa
      const tokenPrevio = await AdminModelo.tokenExistente(correo);
      if (tokenPrevio) {
        return res.status(400).json({
          error: "Usuario con sesión activa, cierre sesión antes de volver a ingresar."
        });
      }

      // Generar y guardar token
      const token = AdminModelo.generarToken();
      await AdminModelo.guardarToken({
        nombreCompleto: usuarioGeneral.nombreCompleto,
        rol: usuarioGeneral.rol,
        correo: usuarioGeneral.correo,
        llave: token
      });

      // Respuesta exitosa
      res.status(200).json({
        mensaje: "Inicio de sesión exitoso.",
        administrador: {
          id: usuarioGeneral.idUsuario,
          nombre: usuarioGeneral.nombreCompleto,
          rol: usuarioGeneral.rol,
          correo: usuarioGeneral.correo
        },
        token
      });

    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}