// controlador/admin/RegistrarAdminControlador.js
import { AdminModelo } from "../../modelo/AdminModelo.js";
import { CorreoModelo } from "../../modelo/CorreoModelo.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";

export class RegistrarAdminControlador {
  static async registrar(req, res) {
    try {
      const {
        t1, t2, t3, t4, t5,
        documento: d, nombreCompleto: n,
        telefono: tel, correo: c, contrasena: pass
      } = req.body;

      const documento = d || t1;
      const nombreCompleto = n || t2;
      const telefono = tel || t3;
      const correo = c || t4;
      const contrasena = pass || t5;

      // ====== Validaciones obligatorias ======
      if (!documento || !nombreCompleto || !telefono || !correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
      }

      if (!/^\d{8,10}$/.test(documento)) {
        return res.status(400).json({ error: "El documento debe tener entre 8 y 10 números." });
      }

      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/.test(nombreCompleto)) {
        return res.status(400).json({ error: "El nombre debe tener entre 3 y 100 letras sin números." });
      }

      if (!/^\d{10}$/.test(telefono)) {
        return res.status(400).json({ error: "El teléfono debe tener exactamente 10 números." });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return res.status(400).json({ error: "Formato de correo inválido (ejemplo@correo.com)." });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/.test(contrasena)) {
        return res.status(400).json({
          error: "La contraseña debe tener mínimo: entre 8 y 20 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        });
      }

      // ====== Validaciones de existencia en BD ======
      if (await AdminModelo.buscarPorDocumento(documento)) {
        return res.status(400).json({ error: "Documento ya registrado." });
      }

      if (await AdminModelo.buscarPorTelefono(telefono)) {
        return res.status(400).json({ error: "Teléfono ya registrado." });
      }

      if (await AdminModelo.buscarPorCorreo(correo)) {
        return res.status(400).json({ error: "Correo ya registrado." });
      }

      // ====== Inserción del nuevo administrador ======
      const contrasenaHash = await bcrypt.hash(contrasena, 10);
      const fechaCreacion = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");

      const nuevoAdmin = {
        documento,
        nombreCompleto,
        telefono,
        correo,
        contrasena: contrasenaHash,
        rol: "Administrador",
        estado: "Activo",
        fechaCreacion
      };

      await AdminModelo.insertarAdministrador(nuevoAdmin);

      // ====== Envío de correo de bienvenida ======
      await CorreoModelo.enviarCorreoRegistro(correo, nombreCompleto);

      return res.status(201).json({ mensaje: "Administrador registrado correctamente." });

    } catch (error) {
      console.error("Error al registrar administrador:", error.message);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
}