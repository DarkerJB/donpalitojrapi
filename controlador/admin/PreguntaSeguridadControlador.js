// controlador/admin/PreguntaSeguridadControlador.js
import { PreguntaSeguridadModelo } from "../../modelo/PreguntaSeguridadModelo.js";

export class PreguntaSeguridadControlador {
  
  // Obtener todas las preguntas de seguridad
  static async obtenerPreguntas(req, res) {
    try {
      const preguntas = await PreguntaSeguridadModelo.obtenerTodas();
      
      if (!preguntas || preguntas.length === 0) {
        return res.status(404).json({ error: "No hay preguntas de seguridad registradas." });
      }

      return res.status(200).json({ preguntas });

    } catch (error) {
      console.error("Error al obtener preguntas de seguridad:", error.message);
      return res.status(500).json({ error: "Error interno al obtener las preguntas de seguridad." });
    }
  }
}