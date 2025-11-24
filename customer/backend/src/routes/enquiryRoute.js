import { Router } from "express";
import * as ctrl from "../controllers/enquiryController.js";

const router = Router();

// Post /api/enquiries
router.post("/", ctrl.handleCreateEnquiry);

export default router;