// modelo/CorreoModelo.js
import {
  enviarCorreoRegistro,
  enviarCorreoEdicionPerfil,
  enviarCorreoDesactivacion,
  enviarCorreoReactivacion,
  enviarCorreoRecuperacionContrasena
} from "../services/mailer.js";

export class CorreoModelo {

  static async enviarCorreoRegistro(destino, nombre) {
    return await enviarCorreoRegistro(destino, nombre);
  }

  static async enviarCorreoEdicionPerfil(destino, nombre) {
    return await enviarCorreoEdicionPerfil(destino, nombre);
  }

  static async enviarCorreoDesactivacion(destino, nombre) {
    return await enviarCorreoDesactivacion(destino, nombre);
  }

  static async enviarCorreoReactivacion(destino, nombre) {
    return await enviarCorreoReactivacion(destino, nombre);
  }

  static async enviarCorreoRecuperacionContrasena(destino, nombre) {
    return await enviarCorreoRecuperacionContrasena(destino, nombre);
  }
}