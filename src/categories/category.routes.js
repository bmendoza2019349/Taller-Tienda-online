import { Router } from "express";
import { check } from "express-validator";


import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { categoryDelete, categoryGet, categoryPost, categoryPut } from "./category.controller.js";
import { existeCategoryById, existenteCategory } from "../helpers/db-validartors.js";

const router = Router();

router.get("/", categoryGet);

router.post(
    "/",
    [
        check("nameCategory", "the name is required").not().isEmpty(),
        check("nameCategory").custom(existenteCategory),
        check("descriptCategory", "The description is required").not().isEmpty(),
        check("descriptCategory", "The min length password is 10").isLength({ min: 10, }),
        validarCampos,
        validarJWT,
    ], categoryPost
);

router.put(
    "/",
    [
        validarJWT,
        validarCampos,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existeCategoryById),
    ], categoryPut
);

router.delete(
    "/",
    [
        validarJWT,
        validarCampos,
        check("id", "Not a valid ID").isMongoId(),
        check("id").custom(existeCategoryById),
    ], categoryDelete
);

export default router;