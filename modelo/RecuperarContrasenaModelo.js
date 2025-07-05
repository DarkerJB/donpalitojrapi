// modelo/RecuperarContrasenaModelo.js
import conexion from "./bd/Conexion.js";

export class RecuperarContrasenaModelo {

  // Obtener IDs de las 3 preguntas de seguridad y sus textos
  static async obtenerPreguntasYRespuestas(documento) {
    const sql = `
      SELECT 
        perfil.idPregunta1, ps1.pregunta AS pregunta1,
        perfil.idPregunta2, ps2.pregunta AS pregunta2,
        perfil.idPregunta3, ps3.pregunta AS pregunta3,
        perfil.respuesta1, perfil.respuesta2, perfil.respuesta3
      FROM perfil
      LEFT JOIN preguntas_seguridad ps1 ON ps1.idPregunta = perfil.idPregunta1
      LEFT JOIN preguntas_seguridad ps2 ON ps2.idPregunta = perfil.idPregunta2
      LEFT JOIN preguntas_seguridad ps3 ON ps3.idPregunta = perfil.idPregunta3
      WHERE perfil.documento = ?
    `;
    try {
      const [resultado] = await conexion.query(sql, [documento]);
      return resultado || null;
    } catch (error) {
      console.error("Error al obtener preguntas de seguridad:", error.message);
      throw error;
    }
  }
}