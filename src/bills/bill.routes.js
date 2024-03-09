import { validarJWT } from "../middlewares/validar-jwt.js";
import { Router } from "express";
import { billPost, getFacturas, getFacturasByClient, updateFactura } from "./bill.controller.js";

const router = Router();

router.post("/",validarJWT, billPost);
router.get('/facturas', validarJWT, getFacturas);

router.put('/:facturaById', validarJWT, getFacturasByClient);
router.put('/:facturaIdByUser', validarJWT, updateFactura);

export default router;