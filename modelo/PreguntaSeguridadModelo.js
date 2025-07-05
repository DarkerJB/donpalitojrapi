// modelo/PreguntaSeguridadModelo.js
import conexion from "./bd/Conexion.js";

export class PreguntaSeguridadModelo {

  // Obtener todas las preguntas del banco
  static async obtenerTodas() {
    const sql = "SELECT idPregunta, pregunta FROM preguntas_seguridad";
    try {
      const resultado = await conexion.query(sql);
      return resultado;  // Retorna directamente el arreglo completo de resultados
    } catch (error) {
      console.error("Error al obtener preguntas de seguridad:", error.message);
      throw error;
    }
  }
}