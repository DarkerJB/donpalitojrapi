// controlador/admin/ReactivarAdminControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import { CorreoModelo } from "../../modelo/CorreoModelo.js";

export class ReactivarAdminControlador {
  static async reactivar(req, res) {
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

      if (usuario.estado === "Activo") {
        return res.status(400).json({ error: "La cuenta ya está activa." });
      }

      await AdminModelo.actualizarEstadoUsuario(documento, "Activo");

      await CorreoModelo.enviarCorreoReactivacion(usuario.correo, usuario.nombreCompleto);

      return res.status(200).json({ mensaje: "La cuenta ha sido reactivada correctamente." });

    } catch (error) {
      console.error("Error al reactivar usuario:", error.message);
      return res.status(500).json({ error: "Error interno al intentar reactivar la cuenta." });
    }
  }
}