import categoryModel from "../categories/category.model.js";
import productsModel from "../products/products.model.js";

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

export const existenteCategory = async (nameCategory) => {
    const nameCategoryup = nameCategory.toUpperCase();
    const existeCategory = await categoryModel.findOne({ nameCategory: nameCategoryup });

    if (existeCategory) {
        throw new Error(`The category ${nameCategory} already exists in the database`);
    }
};

export const existenteProduct = async (nameProduct, stock) => {
    const existingProduct = await productsModel.findOne({ nameProduct });

    if (existingProduct) {
        // Verifica si el producto está descontinuado
        if (existingProduct.state === 'DISCONTINUED') {
            throw new Error(`The product ${nameProduct} is discontinued and cannot be updated.`);
        }

        // Si el producto existe y no está descontinuado, actualiza el stock
        existingProduct.stock += stock;
        await existingProduct.save();
        return existingProduct.stock;
    }

    return null;  // Indica que el producto no existe
};

export const existeCategoryById = async (id = '') => {
    const existeCategory = await categoryModel.findById(id);

    if(!existeCategory){
        throw new Error(`The category with id ${id} does not exist in the database`)
    }
}

export const existProductById = async (id) => {
    const existeProduct = await productsModel.findById(id);

    if(!existeProduct){
        throw new Error(`The product with id ${id} does not exist in the database`)
    }
}

export const validateProductExistence = async (req, res, next) => {
    try {
        const { nameProduct } = req.body;
        const upperCaseNameProduct = nameProduct.toUpperCase();

        const product = await productsModel.findOne({ nameProduct: upperCaseNameProduct });

        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado',
            });
        }

        req.product = product;  // Agrega el producto a la solicitud para que esté disponible en las rutas siguientes
        next();  // Llama a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al buscar el producto',
        });
    }
};

export const validateCategoryExistence = async (req, res, next) => {
    try {
        const { nameCategory } = req.body;
        const upperCasenameCategory = nameCategory.toUpperCase();

        const category = await categoryModel.findOne({ nameCategory: upperCasenameCategory});

        if (!category) {
            return res.status(404).json({
                msg: 'categoria no encontrada',
            });
        }

        req.category = category;  // Agrega el producto a la solicitud para que esté disponible en las rutas siguientes
        next();  // Llama a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al buscar el producto',
        });
    }
};