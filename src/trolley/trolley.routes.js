import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { addToCart, getCart } from "./trolley.controller.js";

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check("productName", "the product name is required"),
        check("quantity", "the quantity is required"),
        check("state", "the state required 'continued' or 'finaliced' or 'cancelled'")
            .notEmpty()
            .isIn(['continued', 'finaliced', 'cancelled']),
        validarCampos,
    ], addToCart);

router.get('/', validarJWT, getCart);

export default router;