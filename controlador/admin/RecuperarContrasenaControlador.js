// controlador/admin/RecuperarContrasenaControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import { RecuperarContrasenaModelo } from "../../modelo/RecuperarContrasenaModelo.js";
import { enviarCorreoRecuperacionContrasena } from "../../services/mailer.js";
import bcrypt from "bcrypt";

export class RecuperarContrasenaControlador {

  // 1. Obtener una pregunta de seguridad aleatoria
  static async obtenerPregunta(req, res) {
    try {
      const { p1: documento, p2: correo } = req.body;

      if (!documento || !correo) {
        return res.status(400).json({ error: "Debe proporcionar documento y correo." });
      }

      const usuario = await AdminModelo.buscarPorDocumentoYCorreo(documento, correo);
      if (!usuario) {
        return res.status(404).json({ error: "No se encontró un usuario con esos datos." });
      }

      const perfil = await RecuperarContrasenaModelo.obtenerPreguntasYRespuestas(documento);
      if (!perfil) {
        return res.status(404).json({ error: "No se encontró un perfil asociado a ese usuario." });
      }

      const preguntasDisponibles = [
        { id: perfil.idPregunta1, texto: perfil.pregunta1, respuestaHash: perfil.respuesta1 },
        { id: perfil.idPregunta2, texto: perfil.pregunta2, respuestaHash: perfil.respuesta2 },
        { id: perfil.idPregunta3, texto: perfil.pregunta3, respuestaHash: perfil.respuesta3 }
      ];

      const indiceAleatorio = Math.floor(Math.random() * 3);
      const preguntaSeleccionada = preguntasDisponibles[indiceAleatorio];

      return res.status(200).json({
        Id: preguntaSeleccionada.id,
        Pregunta: preguntaSeleccionada.texto
      });

    } catch (error) {
      console.error("Error al obtener pregunta de seguridad:", error.message);
      return res.status(500).json({ error: "Error interno al obtener la pregunta de seguridad." });
    }
  }

  // 2. Validar respuesta y permitir cambio de contraseña
  static async recuperar(req, res) {
    try {
      const {
        p1: documento,
        p2: correo,
        Id,
        r1: respuesta,
        pNueva: nuevaContrasena
      } = req.body;

      if (!documento || !correo || !Id || !respuesta || !nuevaContrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      const usuario = await AdminModelo.buscarPorDocumentoYCorreo(documento, correo);
      if (!usuario) {
        return res.status(404).json({ error: "No se encontró un usuario con esos datos." });
      }

      const perfil = await RecuperarContrasenaModelo.obtenerPreguntasYRespuestas(documento);
      if (!perfil) {
        return res.status(404).json({ error: "No se encontró un perfil asociado a ese usuario." });
      }

      // Obtener el hash correcto según la pregunta
      let respuestaHash = null;
      if (String(Id) === String(perfil.idPregunta1)) respuestaHash = perfil.respuesta1;
      else if (String(Id) === String(perfil.idPregunta2)) respuestaHash = perfil.respuesta2;
      else if (String(Id) === String(perfil.idPregunta3)) respuestaHash = perfil.respuesta3;
      else return res.status(400).json({ error: "La pregunta seleccionada no es válida." });

      const respuestaValida = await bcrypt.compare(respuesta.trim(), respuestaHash);
      if (!respuestaValida) {
        return res.status(401).json({ error: "La respuesta de seguridad no coincide." });
      }

      // Validar fortaleza de la nueva contraseña
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/.test(nuevaContrasena)) {
        return res.status(400).json({
          error: "La nueva contraseña debe tener mínimo: entre 8 y 20 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        });
      }

      // Validar que no sea igual a la actual
      const mismaContrasena = await bcrypt.compare(nuevaContrasena, usuario.contrasena);
      if (mismaContrasena) {
        return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior." });
      }

      const hash = await bcrypt.hash(nuevaContrasena, 10);
      await AdminModelo.actualizarContrasena(documento, hash);

      await enviarCorreoRecuperacionContrasena(usuario.correo, usuario.nombreCompleto);

      return res.status(200).json({ mensaje: "Contraseña actualizada exitosamente. Se ha enviado una notificación a su correo." });

    } catch (error) {
      console.error("Error al recuperar contraseña:", error.message);
      return res.status(500).json({ error: "Error interno al intentar recuperar la contraseña." });
    }
  }
}