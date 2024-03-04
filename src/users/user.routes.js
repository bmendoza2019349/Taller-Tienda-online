import {Router} from "express";
import { check} from "express-validator";
import { userDelete, userPost, userPut, usersGet } from "./user.controller.js";
import { validarCampos, validarRole } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", usersGet);

router.post(
    "/",
    [
        validarJWT,
        validarRole,
        check("name", "The name is required").not().isEmpty(),
        check("password", "The password is required").not().isEmpty(),
        check("email", "The email is required").not().isEmpty().isEmail(),
        check('nit', "The caracters max length is 9 and min length 8").isLength({min:8, max:9,}),
        validarCampos,
    ], userPost
);

router.put(
  "/",
  [
    validarJWT,
    validarRole,
    validarCampos,
  ], userPut
);

router.delete(
    "/",
    [
      validarJWT,
      validarRole,
      validarCampos,
    ], userDelete
);

export default router;