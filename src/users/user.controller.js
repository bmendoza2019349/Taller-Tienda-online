import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';

export const userPost = async (req, res) => {
    try {
        const { name, email, password, nit, role } = req.body;

        const user = new User({ name, email, password, nit, role });

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(200).json({
            msg: "The user was added successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator",
        });
    }
};

export const userPut = async (req, res) => {
    try {
        // El middleware ya ha realizado las validaciones necesarias, 
        //por lo que aquí solo necesitas ejecutar la lógica de actualización

        if (req.body.hasOwnProperty('idCliente')) {
            const { idCliente, role, ...resto } = req.body;

            await User.findByIdAndUpdate(idCliente, resto);

            const usuario = await User.findById(idCliente);

            return res.status(200).json({
                msg: 'The user has been successfully updated',
                usuario
            });
        } else {
            const userId = req.user._id;
            const { password, role, ...resto } = req.body;

            // El middleware ya ha validado la existencia del campo password
            const usuario = await User.findById(userId);

            // Aquí puedes realizar cualquier lógica adicional si es necesario

            await User.findByIdAndUpdate(userId, resto);

            const usuarioActualizado = await User.findById(userId);

            res.status(200).json({
                msg: 'El usuario ha sido actualizado exitosamente',
                usuario: usuarioActualizado,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};

export const userDelete = async (req, res) => {
    try {
        // La lógica principal ya ha sido trasladada al middleware 
        //validarDelete, aquí solo necesitas responder con el resultado del middleware
        res.status(200).json({ msg: 'Usuario eliminado exitosamente' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Contacta al ADMINISTRATOR' });
    }
};

export const usersGet = async (req = request, res = response) => {
    const query = { state: true };
    const queryFalse = { state: false  };
    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);
    const [totalFalse, usuariosFalse] = await Promise.all([
        User.countDocuments(queryFalse),
        User.find(queryFalse)
    ]);

    res.status(200).json({
        total,
        usuarios,
        totalFalse,
        usuariosFalse
    });
}