import express from "express";
import * as customerController from "../controllers/customer_controller.js";

const router = express.Router();
router.get("/", customerController.getAllCustomers);

export default router;