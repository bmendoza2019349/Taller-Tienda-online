import { response, request } from "express";
import Category from '../categories/category.model.js';
import Products from "../products/products.model.js";

export const categoryPost = async (req, res) => {
    try {
        const { nameCategory, descriptCategory } = req.body;

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a category",
            });
        }

        const nameCategoryup = nameCategory.toUpperCase();

        const category = new Category({ nameCategory: nameCategoryup, descriptCategory });

        await category.save();

        res.status(200).json({
            msg: "The category was added successfully",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator"
        })
    }

}

export const categoryGet = async (req = request, res = response) => {
    const query = { state: true };
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);

    res.status(200).json({
        total,
        categories
    });
};

export const categoryPut = async (req = request, res = response) => {
    try {
        const { id } = req.body;
        const { _id, nameCategory, ...resto } = req.body;
        const user = req.user;

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a category",
            });
        }
        const nameCategoryup = nameCategory ? nameCategory.toUpperCase() : undefined;

        const uPresto = { ...resto, nameCategory: nameCategoryup };

        await Category.findByIdAndUpdate(id, uPresto);

        const category = await Category.findOne({ _id: id });

        res.status(200).json({
            msg: 'The category was update successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator"
        })
    }
};

export const categoryDelete = async (req, res) => {
    try {
        const { id } = req.body;

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a category",
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                msg: "Category not found",
            });
        }

        if(category.nameCategory === "GENERAL"){
            return res.status(404).json({
                msg: "This category cannot be deleted",
            });
        }

        if (category.state === false) {
            return res.status(400).json({
                msg: "The category already has status false",
            });
        }

        category.state = false;
        await category.save();

        res.status(200).json({
            msg: 'Category deactivated successfully',
            category,
        });

    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator"
        })
    }
}

//buscar category por nombre

export const getProductsByCategory = async (req, res) => {
    try {
        // Obtén la categoría validada a través de req.category
        const category = req.category;

        // Obtén los productos asociados a la categoría
        const products = await Products.find({ _id: { $in: category.product } });

        res.status(200).json({
            msg: 'Productos encontrados exitosamente para la categoría',
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos para la categoría',
        });
    }
};