// modelo/AdminModelo.js
import conexion from "./bd/Conexion.js";
import crypto from "crypto";

export class AdminModelo {

  // ======== REGISTRO Y BÚSQUEDA DE USUARIOS ========

  static async insertarAdministrador(admin) {
    const sql = `
      INSERT INTO usuarios 
      (documento, nombreCompleto, telefono, correo, contrasena, rol, estado, fechaCreacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const parametros = [
      admin.documento,
      admin.nombreCompleto,
      admin.telefono,
      admin.correo,
      admin.contrasena,
      "Administrador",
      "Activo",
      admin.fechaCreacion
    ];
    try {
      const resultado = await conexion.query(sql, parametros);
      return resultado;
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorDocumento(doc) {
    try {
      const result = await conexion.query("SELECT * FROM usuarios WHERE documento = ?", [doc]);
      return result?.[0] || null;
    } catch (error) {
      console.error("Error en buscarPorDocumento:", error.message);
      return null;
    }
  }

  static async buscarPorTelefono(tel) {
    try {
      const result = await conexion.query("SELECT * FROM usuarios WHERE telefono = ?", [tel]);
      return result?.[0] || null;
    } catch (error) {
      console.error("Error en buscarPorTelefono:", error.message);
      return null;
    }
  }

  static async buscarPorCorreo(correo) {
    try {
      const result = await conexion.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
      return result?.[0] || null;
    } catch (error) {
      console.error("Error en buscarPorCorreo:", error.message);
      return null;
    }
  }

  static async buscarPorDocumentoYCorreo(documento, correo) {
    try {
      const result = await conexion.query(
        "SELECT * FROM usuarios WHERE documento = ? AND correo = ? AND rol = ?",
        [documento, correo, "Administrador"]
      );
      return result?.[0] || null;
    } catch (error) {
      console.error("Error en buscarPorDocumentoYCorreo:", error.message);
      return null;
    }
  }

  static async buscarPorDocumentoYCorreoSinRol(documento, correo) {
    try {
      const result = await conexion.query(
        "SELECT * FROM usuarios WHERE documento = ? AND correo = ?",
        [documento, correo]
      );
      return result?.[0] || null;
    } catch (error) {
      console.error("Error en buscarPorDocumentoYCorreoSinRol:", error.message);
      return null;
    }
  }

  // ======== INTENTOS FALLIDOS Y BLOQUEO ========

  static async incrementarIntentosFallidos(documento) {
    try {
      await conexion.query(
        "UPDATE usuarios SET intentosFallidos = intentosFallidos + 1 WHERE documento = ?",
        [documento]
      );
    } catch (error) {
      console.error("Error al incrementar intentos fallidos:", error.message);
    }
  }

  static async bloquearSiSuperaIntentos(documento) {
    try {
      console.log(`Verificando estado posterior a intentos para ${documento}`);
    } catch (error) {
      console.error("Error al bloquear usuario:", error.message);
    }
  }

  static async reiniciarIntentosFallidos(documento) {
    try {
      await conexion.query(
        "UPDATE usuarios SET intentosFallidos = 0 WHERE documento = ?",
        [documento]
      );
    } catch (error) {
      console.error("Error al reiniciar intentos:", error.message);
    }
  }

  // ======== GESTIÓN DE TOKENS ========

  static generarToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  static async guardarToken({ nombreCompleto, rol, correo, llave }) {
    const sql = `
      INSERT INTO token (usuario, rol, correo, llave)
      VALUES (?, ?, ?, ?)
    `;
    try {
      await conexion.query(sql, [nombreCompleto, rol, correo, llave]);
    } catch (error) {
      console.error("Error al guardar el token:", error.message);
      throw error;
    }
  }

  static async tokenExistente(correo) {
    const sql = `SELECT * FROM token WHERE correo = ?`;
    try {
      const [resultado] = await conexion.query(sql, [correo]);
      return resultado || null;
    } catch (error) {
      console.error("Error al verificar existencia de token:", error.message);
      throw error;
    }
  }

  static async eliminarToken(correo) {
    try {
      const sql = "DELETE FROM token WHERE correo = ?";
      await conexion.query(sql, [correo]);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  }

  // ======== GESTIÓN DE PERFIL ========

  static async obtenerPerfilPorDocumento(documento) {
    const sql = `SELECT * FROM perfil WHERE documento = ?`;
    try {
      const [resultado] = await conexion.query(sql, [documento]);
      return resultado || null;
    } catch (error) {
      console.error("Error al obtener perfil:", error.message);
      throw error;
    }
  }

  static async actualizarPerfil(data) {
    const sql = `
      UPDATE perfil SET 
        nombreCompleto = ?, 
        telefono = ?, 
        correo = ?, 
        respuesta1 = ?, 
        respuesta2 = ?, 
        respuesta3 = ?, 
        direccion = ?, 
        fechaExpedicion = ?, 
        correoAlternativo = ?, 
        idPregunta1 = ?, 
        idPregunta2 = ?, 
        idPregunta3 = ?
      WHERE documento = ?
    `;
    try {
      await conexion.query(sql, [
        data.nombreCompleto,
        data.telefono,
        data.correo,
        data.respuesta1,
        data.respuesta2,
        data.respuesta3,
        data.direccion,
        data.fechaExpedicion,
        data.correoAlternativo,
        data.idPregunta1,
        data.idPregunta2,
        data.idPregunta3,
        data.documento
      ]);
    } catch (error) {
      console.error("Error al actualizar perfil:", error.message);
      throw error;
    }
  }

  static async actualizarCamposBasicos(documento, data) {
    const sql = `
      UPDATE usuarios 
      SET nombreCompleto = ?, telefono = ?, correo = ?
      WHERE documento = ?
    `;
    const parametros = [
      data.nombreCompleto,
      data.telefono,
      data.correo,
      documento
    ];
    try {
      await conexion.query(sql, parametros);
    } catch (error) {
      console.error("Error al actualizar datos de usuario:", error.message);
      throw error;
    }
  }

  static async actualizarContrasena(documento, nuevaContrasenaHasheada) {
    const sql = `UPDATE usuarios SET contrasena = ? WHERE documento = ?`;
    try {
      await conexion.query(sql, [nuevaContrasenaHasheada, documento]);
    } catch (error) {
      console.error("Error al actualizar contraseña:", error.message);
      throw error;
    }
  }

  static async actualizarEstadoUsuario(documento, nuevoEstado) {
    const sql = `
      UPDATE usuarios 
      SET estado = ?
      WHERE documento = ?
    `;
    try {
      await conexion.query(sql, [nuevoEstado, documento]);
    } catch (error) {
      console.error("Error al actualizar estado del usuario:", error.message);
      throw error;
    }
  }
}