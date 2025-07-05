// controlador/admin/CerrarSesionControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";

export class CerrarSesionControlador {
  static async cerrarSesion(req, res) {
    try {
      const documento = req.header("x-documento");

      if (!documento || typeof documento !== "string") {
        return res.status(400).json({ error: "Debe proporcionar un documento válido en el header." });
      }

      // Buscar usuario por documento
      const usuario = await AdminModelo.buscarPorDocumento(documento);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      // Validar existencia de token asociado al correo del usuario
      const tokenActivo = await AdminModelo.tokenExistente(usuario.correo);
      if (!tokenActivo) {
        return res.status(404).json({
          error: "El usuario no tiene una sesión activa."
        });
      }

      await AdminModelo.eliminarToken(usuario.correo);
      res.status(200).json({ mensaje: "Sesión cerrada correctamente." });

    } catch (error) {
      console.error("Error en cierre de sesión:", error.message);
      res.status(500).json({ error: "Error interno al cerrar sesión." });
    }
  }
}