import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", (req, res) => userController.getAll(req, res));
router.get("/:id", (req, res) => userController.getById(req, res));
router.post("/", (req, res) => userController.create(req, res));

export default router;