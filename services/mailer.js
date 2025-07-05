// services/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configuración de transporter con Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// ================= FUNCIONES PARA ENVÍO DE CORREOS =================

// Registro exitoso
async function enviarCorreoRegistro(destino, nombre) {
  const mailOptions = {
    from: '"Don Palito Junior" <no-reply@donpalitojr.com>',
    to: destino,
    subject: "Bienvenido a Don Palito Junior",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>¡Hola, ${nombre}!</h2>
        <p>Tu cuenta ha sido registrada exitosamente como administrador en Don Palito Junior.</p>
        <p>Recuerda mantener tus credenciales seguras y no compartirlas con nadie.</p>
        <p style="margin-top: 20px;">Te recomendamos <strong>completar tu perfil</strong> más adelante para garantizar que puedas recuperar tu cuenta en caso de olvido o pérdida de acceso.</p>
        <br>
        <p>Este es un mensaje automático, por favor no respondas.</p>
        <hr>
        <footer style="font-size: 12px; color: #888;">© 2025 Don Palito Junior. Todos los derechos reservados.</footer>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// Edición de perfil exitosa
async function enviarCorreoEdicionPerfil(destino, nombre) {
  const mailOptions = {
    from: '"Don Palito Junior" <no-reply@donpalitojr.com>',
    to: destino,
    subject: "Perfil actualizado correctamente",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>¡Hola, ${nombre}!</h2>
        <p>Te informamos que tu perfil ha sido actualizado satisfactoriamente en Don Palito Junior.</p>
        <p>Si no realizaste esta modificación, contáctanos de inmediato.</p>
        <br>
        <p>Este es un mensaje automático, por favor no respondas.</p>
        <hr>
        <footer style="font-size: 12px; color: #888;">© 2025 Don Palito Junior. Todos los derechos reservados.</footer>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// Desactivación de cuenta
async function enviarCorreoDesactivacion(destino, nombre) {
  const mailOptions = {
    from: '"Don Palito Junior" <no-reply@donpalitojr.com>',
    to: destino,
    subject: "Tu cuenta ha sido desactivada",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola, ${nombre}.</h2>
        <p>Te notificamos que tu cuenta ha sido desactivada en Don Palito Junior.</p>
        <p>Si no reconoces esta acción o deseas reactivar tu cuenta, por favor contáctanos.</p>
        <br>
        <p>Este es un mensaje automático, por favor no respondas.</p>
        <hr>
        <footer style="font-size: 12px; color: #888;">© 2025 Don Palito Junior. Todos los derechos reservados.</footer>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// Reactivación de cuenta
async function enviarCorreoReactivacion(destino, nombre) {
  const mailOptions = {
    from: '"Don Palito Junior" <no-reply@donpalitojr.com>',
    to: destino,
    subject: "Tu cuenta ha sido reactivada",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>¡Hola, ${nombre}!</h2>
        <p>Nos alegra informarte que tu cuenta ha sido reactivada en Don Palito Junior.</p>
        <p>Ya puedes volver a acceder a nuestros servicios.</p>
        <br>
        <p>Este es un mensaje automático, por favor no respondas.</p>
        <hr>
        <footer style="font-size: 12px; color: #888;">© 2025 Don Palito Junior. Todos los derechos reservados.</footer>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// Recuperación de contraseña
async function enviarCorreoRecuperacionContrasena(destino, nombre) {
  const mailOptions = {
    from: '"Don Palito Junior" <no-reply@donpalitojr.com>',
    to: destino,
    subject: "Contraseña actualizada exitosamente",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>¡Hola, ${nombre}!</h2>
        <p>Tu contraseña ha sido recuperada y actualizada correctamente.</p>
        <p>Si no reconoces esta acción, por favor contáctanos inmediatamente para proteger tu cuenta.</p>
        <br>
        <p>Este es un mensaje automático, por favor no respondas.</p>
        <hr>
        <footer style="font-size: 12px; color: #888;">© 2025 Don Palito Junior. Todos los derechos reservados.</footer>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// ================= EXPORTACIÓN DE FUNCIONES =================
export {
  enviarCorreoRegistro,
  enviarCorreoEdicionPerfil,
  enviarCorreoDesactivacion,
  enviarCorreoReactivacion,
  enviarCorreoRecuperacionContrasena
};