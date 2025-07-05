// datos.js
import express from "express";
import cors from "cors";
import rutaAdmin from "./vista/admin/AdminVista.js";
import "./modelo/bd/Config.js";

const app = express();

// ======= Configuración CORS =======
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ======= Middlewares para manejar datos =======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======= Archivos estáticos (Frontend, imágenes, etc) =======
app.use(express.static("public"));

// ======= Rutas para Administradores =======
// Todo lo relacionado con el rol administrador se accede por: http://localhost:3000/admin/...
app.use("/admin", rutaAdmin);

// ======= Inicialización del servidor =======
const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor API corriendo en http://localhost:${puerto}`);
});