import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json(error);
    }

    next();
}

export const validarRole = (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        // Si el campo role está vacío, asignar "CLIENT"
        req.body.role = "CLIENT";
        next();
    } else if (role === 'ADMINISTRATOR' || role === 'CLIENT') {
        // Si el role es "ADMINISTRATOR" o "CLIENT", continuar con la ejecución
        next();
    } else {
        // Si el role no es válido, devolver un error
        return res.status(400).json({ error: "El campo 'role' no es un valor válido." });
    }
};
