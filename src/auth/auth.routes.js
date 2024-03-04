// Importar módulos y controladores necesarios
import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

// Crear instancia del enrutador de Express
const router = Router();

// Definir la ruta y sus validaciones correspondientes para el endpoint de login
router.post(
    '/login',
    [
        check('usuario', 'El usuario o correo es obligatorio').not().isEmpty(),
        // Validar que el campo 'password' no esté vacío
        check('password', 'El password es obligatorio').not().isEmpty(),
        // Ejecutar el middleware de validación de campos
        validarCampos,
    ],
    // Controlador para el endpoint de login
    login
);

// Exportar el enrutador
export default router;
