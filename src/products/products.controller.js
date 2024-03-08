import { response, request } from "express";
import Category from "../categories/category.model.js";
import Products from "./products.model.js";
import { existenteProduct } from "../helpers/db-validartors.js"

export const productPost = async (req, res) => {
    try {
        const { category,
            nameProduct,
            characteristics,
            price,
            brand,
            stock,
            dateOfExpiry,
            kindOfPerson,
            sizes,
            presentation,
            material } = req.body;

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a category",
            });
        }
        const upperCaseNameProduct = nameProduct.toUpperCase();
        const existingStock = await existenteProduct(upperCaseNameProduct, stock);
        
        const nameCategory = category.toUpperCase();

        let categoryInstance = await Category.findOne({ nameCategory });

        if (!categoryInstance) {
            return res.status(404).json({
                msg: "The specified category does not exist",
            });
        }


        if (existingStock !== null) {
            return res.status(200).json({
                msg: `The product ${nameProduct} already exists. Stock has been updated.`,
                product: existingStock,
                category: categoryInstance.nameCategory,
                products: categoryInstance.product
            });
        }

        const product = new Products({
            nameProduct: upperCaseNameProduct, characteristics, price, brand, stock,
            dateOfExpiry, kindOfPerson, sizes, presentation, material
        });

        await product.save();

        categoryInstance.product.push(product._id);
        await categoryInstance.save();

        res.status(200).json({
            msg: "The product was added sucessfully",
            product,
            category: categoryInstance.nameCategory,
            products: categoryInstance.product
        })

    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator"
        })
    }
}


//buscar productos por nombre
export const getProductByName = async (req, res) => {
    try {
        // Puedes acceder al producto validado a través de req.product
        const product = req.product;

        res.status(200).json({
            msg: 'Producto encontrado exitosamente',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener el producto',
        });
    }
};


export const productPut = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, nameProduct, ...resto } = req.body; // Cambiado de resto
        const upperCaseNameProduct = nameProduct.toUpperCase();

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to update a product",
            });
        }

        await Products.findByIdAndUpdate(id, { nameProduct: upperCaseNameProduct, ...resto }); // Cambiado de nameProduct

        const producto = await Products.findOne({ _id: id });

        res.status(200).json({
            msg: 'Product successfully updated',
            producto
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator"
        });
    }
};

export const productDelete = async (req, res) => {
    const {id} = req.params;

    if (req.user.role !== 'ADMINISTRATOR') {
        return res.status(403).json({
            msg: "You don't have permission to create a category",
        });
    }

    const product = await Products.findByIdAndUpdate(id, { state: "DISCONTINUED"});

    res.status(200).json({msg:'product sucessfull delete', product });
}

export const productGet = async (req=request, res= response) => {
    const query = { state: "EXISTENT"}
    const [total, product] = await Promise.all([
        Products.countDocuments(query),
        Products.find(query)
    ]);
    res.status(200).json({
        total,
        product
    });
}


