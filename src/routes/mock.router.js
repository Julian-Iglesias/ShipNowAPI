import { Router } from "express";
import mockController from "../controllers/mock.controller.js";

const router = Router();

router.get("/users", (req, res) => mockController.getUsers(req, res));
router.get("/couriers", (req, res) => mockController.getCouriers(req, res));
router.get("/orders", (req, res) => mockController.getOrders(req, res));
router.get("/deliveries", (req, res) => mockController.getDeliveries(req, res));
router.post("/seed", (req, res) => mockController.seed(req, res));

export default router;
