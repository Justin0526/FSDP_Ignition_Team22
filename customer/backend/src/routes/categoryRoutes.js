// Define endpoints for viewing categories and subcategories
import { Router } from "express";
import * as ctrl from "../controllers/categoryController.js";

import { requireVerifiedSession } from "../middleware/requireVerifiedSession.js";

const router = Router();

// Get all main categories
router.get("/", requireVerifiedSession, ctrl.handleGetRootCategories);

// Get subcategories for a given parent category
router.get("/:parentId/subcategories",requireVerifiedSession, ctrl.handleGetSubcategories);

// Get category by category id
router.get("/:categoryId", requireVerifiedSession, ctrl.handleGetCategoryByCategoryId);

export default router;