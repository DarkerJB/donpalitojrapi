const express = require('express');
const UsuarioControlador = require('../controlador/UsuarioControlador');

const router = express.Router();

// Middleware para validar los datos antes de registrar un usuario
const validarRegistroUsuario = (req, res, next) => {
    const { t1: doc, t2: nombreCompleto, t3: telefono, t4: correo, t5: contrasena } = req.body;

    if (!doc || !nombreCompleto || !telefono || !correo || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!/^\d{7,10}$/.test(doc)) {
        return res.status(400).json({ error: 'El documento debe ser numérico y tener entre 7 y 10 dígitos' });
    }

    if (!/^\d{10}$/.test(telefono)) {
        return res.status(400).json({ error: 'El teléfono debe ser numérico y de 10 dígitos' });
    }

    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico no es válido' });
    }

    if (contrasena.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    next(); // Pasa al controlador si todo está correcto
};

// Ruta para registrar un usuario con validación
router.post('/registro', validarRegistroUsuario, UsuarioControlador.crearUsuario);

module.exports = router;