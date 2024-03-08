import {Router} from "express";
import {check} from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { addToCart, viewCart } from './CartController';

const router = Router();

router.post('/add-to-cart/:productId',
[
    check(),
    check()
], addToCart);
router.get('/view-cart', viewCart);

export default router;