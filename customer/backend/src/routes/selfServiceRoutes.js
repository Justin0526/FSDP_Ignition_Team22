// Define endpoints for viewing self-servies
import { Router } from "express";
import * as ctrl from "../controllers/selfServiceController.js";

import { requireVerifiedSession } from "../middleware/requireVerifiedSession.js";

const router = Router();

// // Get self-services by categories
// router.get("/:categoryId", requireVerifiedSession, ctrl.handleGetSelfServiceByCategoryId);

// // Get self-services by subcategories
// router.get("/:subcategoryId/subcategory", requireVerifiedSession, ctrl.handleGetSelfServiceBySubcategoryId);

router.get("/recommendations", requireVerifiedSession, ctrl.handleGetSelfServiceRecommendations)

export default router;