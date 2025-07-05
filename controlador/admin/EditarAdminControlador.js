// controlador/admin/EditarAdminControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import { PreguntaSeguridadModelo } from "../../modelo/PreguntaSeguridadModelo.js";
import { CorreoModelo } from "../../modelo/CorreoModelo.js";
import bcrypt from "bcrypt";

function convertirFechaLatina(fechaLatina) {
  const partes = fechaLatina.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, anio] = partes;
  if (!dia || !mes || !anio) return null;
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export class EditarAdminControlador {
  static async editar(req, res) {
    try {
      const documento = req.header("x-documento");

      if (!documento || typeof documento !== "string") {
        return res.status(400).json({ error: "Debe proporcionar un documento válido en el header." });
      }

      const usuario = await AdminModelo.buscarPorDocumento(documento);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      const tokenActivo = await AdminModelo.tokenExistente(usuario.correo);
      if (!tokenActivo) {
        return res.status(403).json({ error: "No hay sesión activa. Inicie sesión primero." });
      }

      const perfilActual = await AdminModelo.obtenerPerfilPorDocumento(usuario.documento);
      if (!perfilActual) {
        return res.status(404).json({ error: "Perfil no encontrado." });
      }

      const {
        p1: documentoBody,
        p2: nombreCompleto,
        p3: telefono,
        p4: correoNuevo,
        Id1,
        Id2,
        Id3,
        r1: respuesta1,
        r2: respuesta2,
        r3: respuesta3,
        p8: direccion,
        p9: fechaExpedicion,
        p10: correoAlternativo,
        p11: nuevaContrasena
      } = req.body;

      // Bloquear intento de editar documento o correo
      if (documentoBody && documentoBody !== usuario.documento) {
        return res.status(400).json({ error: "No puede modificar el documento." });
      }
      if (correoNuevo && correoNuevo !== usuario.correo) {
        return res.status(400).json({ error: "No puede modificar el correo principal." });
      }

      // Validar si es la primera vez y falta algún dato en la tabla perfil
      const camposPerfilActual = [
        perfilActual.nombreCompleto,
        perfilActual.telefono,
        perfilActual.correo,
        perfilActual.idPregunta1,
        perfilActual.idPregunta2,
        perfilActual.idPregunta3,
        perfilActual.respuesta1,
        perfilActual.respuesta2,
        perfilActual.respuesta3,
        perfilActual.direccion,
        perfilActual.fechaExpedicion,
        perfilActual.correoAlternativo
      ];
      const perfilIncompleto = camposPerfilActual.some(val => val === null || val === "");

      if (perfilIncompleto) {
        if (
          !nombreCompleto || !telefono ||
          !Id1 || !Id2 || !Id3 ||
          !respuesta1 || !respuesta2 || !respuesta3 ||
          !direccion || !fechaExpedicion || !correoAlternativo
        ) {
          return res.status(400).json({
            error: "Debe diligenciar todos los campos del perfil al menos una vez antes de realizar ediciones parciales, incluidas las preguntas de seguridad y sus respuestas."
          });
        }
      }

      // Validaciones específicas
      if (nombreCompleto && nombreCompleto.trim().length < 3) {
        return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres." });
      }
      if (telefono && !/^\d{7,10}$/.test(telefono.trim())) {
        return res.status(400).json({ error: "Número de teléfono inválido." });
      }
      if (correoAlternativo && correoAlternativo.trim() !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoAlternativo.trim())) {
        return res.status(400).json({ error: "Correo alternativo inválido." });
      }

      // Validar preguntas de seguridad si se envían
      let idsPreguntasValidas = [];
      if (Id1 || Id2 || Id3) {
        if (Id1 === Id2 || Id1 === Id3 || Id2 === Id3) {
          return res.status(400).json({ error: "Las preguntas de seguridad deben ser diferentes entre sí." });
        }

        const preguntasBD = await PreguntaSeguridadModelo.obtenerTodas();
        idsPreguntasValidas = preguntasBD.map(p => String(p.idPregunta));

        if (Id1 && !idsPreguntasValidas.includes(String(Id1))) {
          return res.status(400).json({ error: "La primera pregunta seleccionada no es válida." });
        }
        if (Id2 && !idsPreguntasValidas.includes(String(Id2))) {
          return res.status(400).json({ error: "La segunda pregunta seleccionada no es válida." });
        }
        if (Id3 && !idsPreguntasValidas.includes(String(Id3))) {
          return res.status(400).json({ error: "La tercera pregunta seleccionada no es válida." });
        }
      }

      // Validación y encriptado de respuestas si se envían
      let respuestaHash1 = perfilActual.respuesta1;
      let respuestaHash2 = perfilActual.respuesta2;
      let respuestaHash3 = perfilActual.respuesta3;

      // Validación de respuestas de seguridad
      const respuestas = [respuesta1, respuesta2, respuesta3];
      for (let i = 0; i < respuestas.length; i++) {
        const r = respuestas[i];
        if (r) {
          if (!/^.{3,20}$/.test(r.trim())) {
            return res.status(400).json({ error: "Cada respuesta de seguridad debe tener entre 3 y 20 caracteres." });
          }
          const hash = await bcrypt.hash(r.trim(), 10);
          if (i === 0) respuestaHash1 = hash;
          if (i === 1) respuestaHash2 = hash;
          if (i === 2) respuestaHash3 = hash;
        }
      }

      let fechaFormateada = null;
      if (fechaExpedicion) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaExpedicion)) {
          return res.status(400).json({ error: "La fecha debe estar en formato DD/MM/YYYY." });
        }
        fechaFormateada = convertirFechaLatina(fechaExpedicion);
      }

      // Si viene nueva contraseña, validarla y actualizar
      if (nuevaContrasena) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/.test(nuevaContrasena)) {
          return res.status(400).json({
            error: "La nueva contraseña debe tener mínimo: entre 8 y 20 caracteres, una mayúscula, una minúscula, un número y un símbolo."
          });
        }
        const contrasenaHasheada = await bcrypt.hash(nuevaContrasena.trim(), 10);
        await AdminModelo.actualizarContrasena(usuario.documento, contrasenaHasheada);
      }

      // Actualización en tabla perfil
      const datosPerfilActualizados = {
        documento: usuario.documento,
        nombreCompleto: nombreCompleto?.trim() || perfilActual.nombreCompleto,
        telefono: telefono?.trim() || perfilActual.telefono,
        correo: usuario.correo,
        idPregunta1: Id1 || perfilActual.idPregunta1,
        idPregunta2: Id2 || perfilActual.idPregunta2,
        idPregunta3: Id3 || perfilActual.idPregunta3,
        respuesta1: respuestaHash1,
        respuesta2: respuestaHash2,
        respuesta3: respuestaHash3,
        direccion: direccion?.trim() || perfilActual.direccion,
        fechaExpedicion: fechaFormateada || perfilActual.fechaExpedicion,
        correoAlternativo: correoAlternativo?.trim() || perfilActual.correoAlternativo
      };

      await AdminModelo.actualizarPerfil(datosPerfilActualizados);
      await CorreoModelo.enviarCorreoEdicionPerfil(usuario.correo, usuario.nombreCompleto);

      await AdminModelo.actualizarCamposBasicos(usuario.documento, {
        nombreCompleto: datosPerfilActualizados.nombreCompleto,
        telefono: datosPerfilActualizados.telefono,
        correo: usuario.correo
      });

      return res.status(200).json({ mensaje: "Perfil actualizado correctamente." });

    } catch (error) {
      console.error("Error al editar administrador:", error.message);
      return res.status(500).json({ error: "Error interno del servidor al editar perfil." });
    }
  }
}