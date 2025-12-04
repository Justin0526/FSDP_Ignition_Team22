import * as svc from "../services/enquiryService.js";
import AppError from "../utils/AppError.js";

export async function handleCreateEnquiry(req, res, next){
    try{
        const sessionId = req.headers["x-session-id"];
        const { categoryId, subcategoryId, details } = req.body;

        if(!categoryId){
            throw new AppError("categoryId, is required", 400);
        }

        const enquiry = await svc.createEnquiry(sessionId, { categoryId, subcategoryId, details});

        res.json({
            success: true,
            enquiry,
        });
    }catch(err){
        next(err);
    }
}