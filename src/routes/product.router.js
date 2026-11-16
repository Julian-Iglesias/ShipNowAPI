import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", (req, res) => productController.getAll(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));
router.post("/", (req, res) => productController.create(req, res));

export default router;