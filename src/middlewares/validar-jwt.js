import jwt from 'jsonwebtoken'
import User from '../users/user.model.js';
import { readToken } from '../auth/auth.controller.js';

export const validarJWT = async (req, res, next) => {
    const token = readToken;

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición, Debes iniciar sesión.",
    });
  }

  try {
    //verificación de token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leer el usuario que corresponde al 
    
    const user = await User.findById(uid);
    //verificar que el usuario exista.

    if(!user){
      return res.status(401).json({
        msg: 'Usuario no existe en la base de datos'
      })
    }
    //verificar si el uid está habilidato.
    if(!user.state){
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado:false'
      })
    }

    req.user = user;
    next();

  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Token no válido",
      });
  }
}