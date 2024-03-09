import Product from '../products/products.model.js';
import mongoose from 'mongoose';
import { response, request } from "express";
import Cart from './trolley.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productName, quantity, state } = req.body;
        const lowerCaseState = state.toLowerCase();

        const product = await Product.findOne({ nameProduct: productName });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found in the database' });
        }

        // Verificar si la cantidad es menor o igual al stock
        if (quantity > product.stock) {
            return res.status(400).json({ msg: 'Not enough stock available.' });
        }

        const { user } = req;
        let userCart = await Cart.findOne({ userId: user._id });

        if (!userCart) {
            userCart = new Cart({
                userId: user._id,
                items: [],
                state: 'continued',
                subTotal: 0,
                total: 0,
            });
            await userCart.save();
        }


        // Restar la cantidad del stock si el estado es 'finaliced'
        if (lowerCaseState === "finaliced") {
            const parsedQuantity = parseInt(quantity);

            if (product.stock >= parsedQuantity) {
                product.stock -= parsedQuantity;
                product.ProductBestSeller = (product.ProductBestSeller || 0) + parsedQuantity; // Sumar al ProductBestSeller

                await product.save();

                userCart.state = 'finaliced';
                return res.json({ msg: 'You cannot add more products. The cart has been finalized.', cart: userCart });

                await userCart.save();
            } else {
                return res.status(400).json({ msg: 'Not enough stock available.' });
            }
            userCart = new Cart({
                userId: user._id,
                items: [],
                state: 'continued',
                subTotal: 0,
                total: 0,
            });
            await userCart.save();
        }


        // Eliminar el carrito si el estado es 'cancelled'
        if (lowerCaseState === 'cancelled') {
            if (userCart) {
                await Cart.deleteOne({ _id: userCart._id });
                return res.status(400).json({ msg: 'The cart has been cancelled. Cannot add products.' });
            } else {
                return res.status(400).json({ msg: 'The cart does not exist or has already been cancelled.' });
            }
        }

        const existingCartItem = userCart.items.find(item => item.productId.equals(product._id));

        if (existingCartItem) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            existingCartItem.quantity += parseInt(quantity);
            existingCartItem.itemSubTotal = product.price * existingCartItem.quantity;

            // Verificar si la cantidad en el carrito es igual al stock
            if (existingCartItem.quantity === product.stock) {
                return res.status(400).json({ msg: 'Stock has reached its limit for this product.' });
            }
        } else {
            // Si el producto no está en el carrito, agregar un nuevo ítem
            const itemSubTotal = product.price * parseInt(quantity);
            userCart.items.push({
                productId: product._id,
                productName: product.nameProduct,
                price: product.price,
                quantity: parseInt(quantity),
                itemSubTotal,
            });
        }

        // Actualizar subTotal y total del carrito
        userCart.subTotal = userCart.items.reduce((total, item) => total + (isNaN(item.itemSubTotal) ? 0 : item.itemSubTotal), 0);
        userCart.total = userCart.subTotal;

        await userCart.save();

        res.json({ msg: 'Product added to the cart successfully', cart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const getCart = async (req, res) => {
    try {
        const { user } = req;
        const userCart = await Cart.findOne({ userId: user._id });

        if (!userCart) {
            return res.status(404).json({ msg: 'Cart not found for the user' });
        }

        res.json({ cart: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};