import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';

export const userPost = async (req, res) => {
    try {
        const { name, email, password, nit, role } = req.body;

        // Verificar si el usuario tiene el rol de "ADMINISTRATOR"
        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a user",
            });
        }

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
        const userId = req.user._id;
        const isAdmin = req.user.role === 'ADMINISTRATOR';
        const targetUserId = isAdmin ? req.body.id : userId;

        const { password, ...resto } = req.body;

        // Verificar si el usuario tiene permisos para actualizar el perfil especificado
        if (!isAdmin && userId !== targetUserId) {
            return res.status(403).json({
                msg: "No tienes permisos para actualizar este perfil",
            });
        }

        // Si el usuario está actualizando su propio perfil, verificar que se proporcionó la contraseña
        if (!isAdmin && !password) {
            return res.status(400).json({
                msg: "La contraseña es requerida para actualizar tu propio perfil",
            });
        }

        // Actualizar el usuario usando el ID del usuario especificado
        await User.findByIdAndUpdate(targetUserId, resto);

        // Volver a buscar al usuario actualizado
        const usuario = await User.findById(targetUserId);

        res.status(200).json({
            msg: 'The user has been successfully updated',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};

export const userDelete = async(req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === 'ADMINISTRATOR';
        const targetUserId = isAdmin ? req.body.id : userId;

        // Verificar si el usuario tiene permisos para eliminar el perfil especificado
        if (!isAdmin && userId !== targetUserId) {
            return res.status(403).json({
                msg: "No tienes permisos para eliminar este perfil",
            });
        }

        // Si el usuario está eliminando su propio perfil, verificar la contraseña
        if (!isAdmin && userId === targetUserId) {
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({
                    msg: "La contraseña es requerida para eliminar tu propio perfil",
                });
            }

            const user = await User.findById(userId);

            if (!user || !bcryptjs.compareSync(password, user.password)) {
                return res.status(401).json({
                    msg: "Contraseña incorrecta, no se puede eliminar el perfil",
                });
            }
        }

        // Proceder con la eliminación del usuario
        const user = await User.findByIdAndUpdate(targetUserId, { state: false });
        res.status(200).json({ msg: 'Usuario eliminado', usuario: user });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};

export const usersGet = async (req  = request, res = response) => {
    const query = {state: true};

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}