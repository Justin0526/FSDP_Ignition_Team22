// Define endpoints for viewing categories and subcategories
import { Router } from "express";
import * as ctrl from "../controllers/categoryController.js";

const router = Router();

// Get all main categories
router.get("/", ctrl.handleGetRootCategories);

// Get subcategories for a given parent category
router.get("/:parentId/subcategories", ctrl.handleGetSubcategories);

export default router;