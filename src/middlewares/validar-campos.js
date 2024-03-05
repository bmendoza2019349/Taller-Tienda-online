import { validationResult } from "express-validator";
import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js'

export const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
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
        return res.status(400).json({ error: "El campo 'role' no es un valor válido. solo se permite ADMINISTRATOR o CLIENT" });
    }
};

export const validarPut = async (req, res, next) => {
    try {
        const roles = req.user.role;

        if (roles === "CLIENT" || roles === "ADMINISTRATOR") {
            if (req.body.hasOwnProperty('idCliente')) {
                const { idCliente } = req.body;

                const clienteExistente = await User.findById(idCliente);
                if (!clienteExistente) {
                    return res.status(404).json({
                        msg: 'Cliente no encontrado',
                    });
                }
            } else {
                const userId = req.user._id;

                if (!req.body.password) {
                    return res.status(400).json({
                        msg: 'Bad Request: El campo password es requerido para actualizar el usuario',
                    });
                }

                const usuario = await User.findById(userId);
                const storedPassword = usuario.password;

                const passwordMatch = await bcryptjs.compare(req.body.password, storedPassword);

                if (!passwordMatch) {
                    return res.status(401).json({
                        msg: 'Unauthorized: La contraseña proporcionada no es válida',
                    });
                }
            }

            // Agrega cualquier otra validación que necesites realizar antes de pasar al controlador

            // Si todas las validaciones pasan, puedes continuar con la ejecución
            next();
        } else {
            res.status(403).json({
                msg: 'Forbidden: You do not have permission to perform this action',
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};

export const validarDelete = async (req, res, next) => {
    const roles = req.user.role;
    const userId = req.user._id;

    try {
        if (roles === "ADMINISTRATOR" || roles === "CLIENT") {

            // Verificar si se proporciona un idCliente en el cuerpo
            if (req.body.hasOwnProperty('idCliente')) {
                const idCliente = req.body.idCliente;

                // Verificar si el usuario tiene permisos para eliminar al cliente
                if (roles === "ADMINISTRATOR" || userId === idCliente) {
                    // Realizar eliminación lógica del usuario
                    await User.findByIdAndUpdate(idCliente, { state: false });
                    return res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
                    next();
                } else {
                    return res.status(403).json({ msg: 'Forbidden: No tienes permisos para eliminar este usuario' });
                }
            } else {
                if (req.body.hasOwnProperty('password')) {
                    const passwordProvided = req.body.password;

                    // Obtener la contraseña almacenada del usuario
                    const usuario = await User.findById(userId);
                    const storedPassword = usuario.password;

                    // Comparar la contraseña proporcionada con la almacenada
                    const passwordMatch = await bcryptjs.compare(passwordProvided, storedPassword);

                    if (!passwordMatch) {
                        return res.status(401).json({
                            msg: 'La contraseña proporcionada no es válida',
                        });
                    }

                    if (req.body.hasOwnProperty('password')) {
                        const passwordProvided = req.body.password;

                        // Obtener la contraseña almacenada del usuario
                        const usuario = await User.findById(userId);
                        const storedPassword = usuario.password; // Asumiendo que la contraseña está almacenada en el campo "password"

                        // Comparar la contraseña proporcionada con la almacenada
                        const passwordMatch = await bcryptjs.compare(passwordProvided, storedPassword);

                        if (!passwordMatch) {
                            return res.status(401).json({
                                msg: 'La contraseña proporcionada no es válida',
                            });
                        }

                        // Realizar eliminación lógica del usuario
                        await User.findByIdAndUpdate(userId, { state: false });
                        return res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
                    }
                    next();
                } else {
                    return res.status(400).json({ msg: 'Bad Request: La contraseña es requerida para eliminar el usuario' });
                }
            }
        } else {
            return res.status(403).json({ msg: 'Forbidden: No tienes permisos para realizar esta acción' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Contacta al ADMINISTRATOR' });
    }
};