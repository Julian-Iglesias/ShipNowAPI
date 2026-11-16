import { Router } from "express";
import mockController from "../controllers/mock.controller.js";

const router = Router();

router.get("/users", (req, res, next) => {mockController.getUsers(req, res, next)});
router.get("/couriers", (req, res, next) => {mockController.getCouriers(req, res, next)});
router.get("/orders", (req, res, next) => {mockController.getOrders(req, res, next)});
router.get("/deliveries", (req, res, next) => {mockController.getDeliveries(req, res, next)});
router.post("/seed", (req, res, next) => {mockController.seed(req, res, next)});

export default router;
