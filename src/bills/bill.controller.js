import { response, request } from "express";
import Factura from '../bills/bill.model.js';
import Cart from '../trolley/trolley.model.js';
import Product from '../products/products.model.js'
import User from '../users/user.model.js';

export const billPost = async (req, res) => {
    try {
        const { cartId } = req.body;
        const userCart = await Cart.findById(cartId).populate('userId');

        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to create a product",
            });
        }

        if (!userCart) {
            return res.status(404).json({ msg: 'Cart not found.' });
        }

        const factura = new Factura({
            user: userCart.userId._id,
            cart: userCart._id,
            total: userCart.total,
        });

        // Extract products from the items array in the userCart
        const products = userCart.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
        }));

        factura.products = products;

        await factura.save();
        res.json({ msg: 'Invoice created successfully', factura, products });

    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator",
        });
    }
}

export const getFacturasByClient = async (req, res) => {
    try {
        // Obtener el ID del usuario desde el cuerpo de la solicitud
        const { userId } = req.body;

        // Verificar si el ID del usuario está presente en el cuerpo de la solicitud
        if (!userId) {
            return res.status(400).json({
                msg: "User ID is required in the request body",
            });
        }

        // Buscar facturas del usuario con el ID proporcionado
        const userFacturas = await Factura.find({ user: userId })
            .populate({
                path: 'cart',
                select: 'total state items',
                populate: {
                    path: 'items.productId',
                    model: 'Products', // Reemplaza 'Product' con el nombre de tu modelo de productos
                    select: 'productName price',
                },
            })
            .exec();

        res.json({ facturas: userFacturas });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
            msg: "Error al obtener las facturas",
        });
    }
};

export const getFacturas = async (req, res) => {
    try {
        const userFacturas = await Factura.find({ user: req.user._id })
            .populate({
                path: 'cart',
                select: 'total state items',
                populate: {
                    path: 'items.productId',
                    model: 'Products', // Reemplaza 'Product' con el nombre de tu modelo de productos
                    select: 'productName price',
                },
            })
            .exec();

        res.json({ facturas: userFacturas });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
            msg: "Error al obtener las facturas",
        });
    }
};

export const updateFactura = async (req, res) => {
    try {
        const { facturaId } = req.params;
        const { _id, ...resto } = req.body;

        // Verificar si el usuario es administrador
        if (req.user.role !== 'ADMINISTRATOR') {
            return res.status(403).json({
                msg: "You don't have permission to update the invoice",
            });
        }

        // Actualizar factura
        await Factura.findByIdAndUpdate(facturaId, resto);

        // Obtener factura actualizada con detalles del carrito y productos
        const factura = await Factura.findById(facturaId)
            .populate({
                path: 'cart',
                populate: {
                    path: 'userId',
                    model: 'User', // Reemplaza 'User' con el nombre real de tu modelo de usuario
                },
            })
            .populate({
                path: 'cart.items.productId',
                model: 'Product', // Reemplaza 'Product' con el nombre real de tu modelo de productos
                select: 'productName price',
            })
            .exec();

        res.status(200).json({
            msg: 'Factura successfully updated',
            factura,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
            msg: "Error updating the invoice",
        });
    }
};