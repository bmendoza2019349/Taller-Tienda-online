import categoryModel from "../categories/category.model.js";

export const validarUsuario = (req, res, next) => {
    try {
        const userId = req.user._id;
        const requestedUserId = req.params.id;
        const isAdmin = req.user.role === 'ADMINISTRATOR';

        // Si no es un administrador, verificar si está intentando actualizar o eliminar su propio perfil
        if (!isAdmin && userId !== requestedUserId) {
            return res.status(403).json({
                msg: "No tienes permisos para realizar esta operación en este perfil",
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contact the administrator",
        });
    }
};

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({email});
    if (existeEmail){
        throw new Error(`El email ${email} ya fue registrado`);
    }
}

export const existenteCategory = async(name = '') =>{
    const existeCategory = await categoryModel.findOne({name});

    if(existeCategory){
        throw new Error(`The category exists in the database ${name}`)
    }
}

export const existeCategoryById = async (id = '') => {
    const existeCategory = await categoryModel.findById(id);

    if(!existeCategory){
        throw new Error(`The category with id ${id} does not exist in the database`)
    }
}
