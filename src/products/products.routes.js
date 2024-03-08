import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { getProductByName, productDelete, productPost, productPut } from "./products.controller.js";
import { existProductById, validateProductExistence } from "../helpers/db-validartors.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("category", "The category products is required").not().isEmpty(),
        check("nameProduct", "The name products is required").not().isEmpty(),
        check("characteristics", "The characteristics products is required").not().isEmpty(),
        check("price", "The price products is required").not().isEmpty(),
        check("brand", "The brand products is required").not().isEmpty(),
        check("stock", "The stock products is required").not().isEmpty(),
        validarCampos,
    ], productPost
)

router.get(
    '/getProductByName',
    [
        validateProductExistence,
        check("nameProduct", "The name products is required").not().isEmpty(),
        validarCampos
    ], getProductByName);

// Editar un producto por ID
router.put(
    '/:id',
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existProductById),
        validarCampos,
    ], productPut
);

// Eliminar un producto por ID
router.delete(
    '/:id',
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existProductById),
        validarCampos,
    ], productDelete
);

export default router;