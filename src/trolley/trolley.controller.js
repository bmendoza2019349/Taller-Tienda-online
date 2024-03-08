import Product from '../products/products.model.js';
import { response, request } from "express";
import Cart from './trolley.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productName, quantity, state } = req.body;

        const product = await Product.findOne({ nameProduct: productName });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found in the database' });
        }

        const { user } = req;
        let userCart = await Cart.findOne({ userId: user._id });

        if (!userCart) {
            userCart = new Cart({
                userId: user._id,
                items: [],
                state: 'continued'
            });
            await userCart.save();
        }

        if (userCart.state === 'finaliced') {
            return res.status(400).json({ msg: 'You cannot add more products. The cart has been finalized.' });
        }

        userCart.items.push({
            productId: product._id,
            productName: product.nameProduct,
            price: product.price,
            quantity: parseInt(quantity),
        });

        await userCart.save();

        res.json({ msg: 'Product added to the cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const viewCart = async (req, res) => {
    try {
        // Assuming the user information is extracted from the token
        const { user } = req;
        
        // Find the user's cart
        const userCart = shoppingCart.find(cartItem => cartItem.userId === user._id);

        if (!userCart) {
            return res.json({ msg: 'User has no items in the cart' });
        }

        res.json(userCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};