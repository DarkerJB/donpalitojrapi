// vista/admin/AdminVista.js
import express from "express";
import { RegistrarAdminControlador } from "../../controlador/admin/RegistrarAdminControlador.js";
import { LoginAdminControlador } from "../../controlador/admin/LoginAdminControlador.js";
import { PreguntaSeguridadControlador } from "../../controlador/admin/PreguntaSeguridadControlador.js";
import { EditarAdminControlador } from "../../controlador/admin/EditarAdminControlador.js";
import { DesactivarAdminControlador } from "../../controlador/admin/DesactivarAdminControlador.js";
import { ReactivarAdminControlador } from "../../controlador/admin/ReactivarAdminControlador.js";
import { CerrarSesionControlador } from "../../controlador/admin/CerrarSesionControlador.js";
import { RecuperarContrasenaControlador } from "../../controlador/admin/RecuperarContrasenaControlador.js";
import { verificarToken } from "../../middleware/verificarToken.js";
import { CorreoModelo } from "../../modelo/CorreoModelo.js";

const rutaAdmin = express.Router();

// ======= RUTAS PARA LOS REQUISITOS FUNCIONALES DE ADMINISTRADOR =======

// RF-27: Registro de nuevo administrador
rutaAdmin.post("/registrar", RegistrarAdminControlador.registrar);

// RF-28: Inicio de sesión de administrador
rutaAdmin.post("/login", LoginAdminControlador.login);

// RF-29: Editar o Modificar Cuentas de Usuario
// Paso 1. Obtener todas las preguntas de seguridad para elegir 3 de ellas
rutaAdmin.get("/preguntas-seguridad", PreguntaSeguridadControlador.obtenerPreguntas);
// Paso 2. Editar perfil usando las 3 preguntas elegidas
rutaAdmin.put("/editar-perfil", EditarAdminControlador.editar);

// RF-30: Desactivar o eliminar cuentas de usuario
rutaAdmin.put("/desactivar", DesactivarAdminControlador.desactivar);

// RF-31: Reactivar o recuperar cuentas de usuario
rutaAdmin.put("/reactivar", ReactivarAdminControlador.reactivar);

// RF-32: Cierre de sesión de administrador
rutaAdmin.delete("/logout", CerrarSesionControlador.cerrarSesion);

// RF-33: Recuperación de contraseña de administrador
// Paso 1. Obtener pregunta de seguridad aleatoria
rutaAdmin.post("/recuperar-contrasena/pregunta", RecuperarContrasenaControlador.obtenerPregunta);
// Paso 2. Validar respuesta y permitir cambio de contraseña
rutaAdmin.put("/recuperar-contrasena", RecuperarContrasenaControlador.recuperar);

// ======= Rutas de perfil protegidas (Para usar con frontend posteriormente) =======
// rutaAdmin.post("/perfil/obtener", verificarToken, EditarAdminControlador.obtenerPerfil);
// rutaAdmin.post("/perfil/actualizar", verificarToken, EditarAdminControlador.actualizarPerfil);

// ======= Ruta protegida de prueba =======
rutaAdmin.get("/protegido", verificarToken, (req, res) => {
  res.json({
    mensaje: "Accediste a una ruta protegida con token",
    usuario: req.usuario
  });
});

// ======= Envío de correo de prueba =======
rutaAdmin.get("/probar-correo", async (req, res) => {
  try {
    const datosCorreo = {
      destino: "cuentaturcacompras@gmail.com",
      asunto: "Bienvenido a Don Palito Jr",
      mensaje: `
        <h2>¡Bienvenido, Administrador!</h2>
        <p>Tu cuenta ha sido registrada correctamente en el sistema <strong>Don Palito Junior</strong>.</p>
        <p>Recuerda mantener tus credenciales seguras y no compartirlas con nadie.</p>
        <br>
        <p>Atentamente,<br>Equipo Don Palito Jr</p>
      `
    };

    const resultado = await CorreoModelo.enviarCorreo(datosCorreo);
    res.status(200).json({ mensaje: "Correo enviado correctamente", resultado });
  } catch (error) {
    console.error("Error en /probar-correo:", error.message);
    res.status(500).json({ error: "No se pudo enviar el correo." });
  }
});

export default rutaAdmin;