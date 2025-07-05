// middleware/verificarToken.js

import conexion from "../modelo/bd/Conexion.js";

export const verificarToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado." });
  }

  try {
    const [tokenValido] = await conexion.query(
      "SELECT * FROM token WHERE llave = ?",
      [token]
    );

    if (!tokenValido || tokenValido.length === 0) {
      return res.status(403).json({ error: "Token inválido o expirado." });
    }

    // Verificar que el usuario esté activo
    const usuario = tokenValido[0];
    const [estadoUsuario] = await conexion.query(
      "SELECT estado FROM usuarios WHERE correo = ?",
      [usuario.correo]
    );

    if (!estadoUsuario || estadoUsuario[0].estado !== "Activo") {
      return res.status(403).json({ error: "Usuario inactivo o bloqueado." });
    }

    // Si todo está bien, continúa con la solicitud
    req.usuario = usuario; // opcional, por si lo quieres usar más adelante
    next();

  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.status(500).json({ error: "Error interno al verificar token." });
  }
};