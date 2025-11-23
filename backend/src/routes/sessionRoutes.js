// Defines session-related endpoints for verification flow.
import { Router } from "express";
import * as ctrl from "../controllers/sessionController.js";

const router = Router();

// 1. Click link and create session
router.post("/start", ctrl.handleStartSession);

// 2. Enter phone
router.post("/phone", ctrl.handleSubmitPhone);

// 3. Enter NRIC last 4
router.post("/nric", ctrl.handleSubmitNric);

// 4. Enter OTP
router.post("/otp", ctrl.handleVerifyOtp);

export default router;