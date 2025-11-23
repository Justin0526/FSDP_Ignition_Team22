// Handles HTTP requests for session flow
import * as svc from "../services/sessionService.js";

// User clicks on link and create sessoin
export async function handleStartSession(req, res, next){
    try{
        const session = await svc.startSession();
        res.json({
            success: true,
            session
        })
    }catch (err){
        // Pass the error to the global error handler
        next(err);
    }
}

// User enters phone number
export async function handleSubmitPhone(req, res, next){
    try{
        const { sessionId, mobileNumber } = req.body;
        const session = await svc.submitPhone(sessionId, mobileNumber);
        res.json({
            success: true,
            session
        });
    }catch(err){
        next(err);
    }
}

// User enters NRIC last 4
export async function handleSubmitNric(req, res, next){
    try{
        const { sessionId, nricLast4 } = req.body;
        const result = await svc.submitNric(sessionId, nricLast4);
        res.json({
            success: true,
            session: result.session,
            otp: result.otp, // For demo, show in UI
        });
    }catch(err){
        next(err);
    }
}

// User enters OTP
export async function handleVerifyOtp(req, res, next){
    try{
        const { sessionId, otp } = req.body;
        const session = await svc.verifyOtp(sessionId, otp);
        res.json({
            success: true,
            session
        });
    }catch(err){
        next(err);
    }
}