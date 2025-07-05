// controlador/admin/DesactivarAdminControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import { CorreoModelo } from "../../modelo/CorreoModelo.js";

export class DesactivarAdminControlador {
  static async desactivar(req, res) {
    try {
      const documento = req.header("x-documento");

      if (!documento || typeof documento !== "string") {
        return res.status(400).json({ error: "Debe proporcionar un documento válido en el header." });
      }

      const usuario = await AdminModelo.buscarPorDocumento(documento);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      // Validar sesión activa
      const tokenActivo = await AdminModelo.tokenExistente(usuario.correo);
      if (!tokenActivo) {
        return res.status(403).json({ error: "No hay sesión activa. Inicie sesión primero." });
      }

      if (usuario.estado === "Inactivo") {
        return res.status(400).json({ error: "El usuario ya está inactivo." });
      }

      // Eliminar token
      await AdminModelo.eliminarToken(usuario.correo);

      // Desactivar la cuenta
      await AdminModelo.actualizarEstadoUsuario(documento, "Inactivo");

      await CorreoModelo.enviarCorreoDesactivacion(usuario.correo, usuario.nombreCompleto);

      return res.status(200).json({ mensaje: "Usuario desactivado correctamente. Si tenía una sesión activa, también fue cerrada." });

    } catch (error) {
      console.error("Error al desactivar usuario:", error.message);
      return res.status(500).json({ error: "Error interno del servidor al desactivar usuario." });
    }
  }
}