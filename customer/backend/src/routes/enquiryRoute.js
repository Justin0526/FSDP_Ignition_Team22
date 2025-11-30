import { Router } from "express";
import * as ctrl from "../controllers/enquiryController.js";

const router = Router();

// POST /api/enquiries
router.post("/", ctrl.handleCreateEnquiry);

// POST /api/enquiries/:enquiryId/self-service-feedback
router.post("/:enquiryId/self-service-feedback", ctrl.handleSelfServiceFeedback);

// GET /api/enquiries/history?categoryId=...&subcategoryId=...
router.get("/history", ctrl.handleGetHelpfulHistory);

export default router;
