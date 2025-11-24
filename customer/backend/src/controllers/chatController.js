import { chatWithAssistant } from "../services/chatService.js";
import AppError from "../utils/AppError.js";

export async function handleChatMessage(req, res, next){
    try{
        const sessionId = req.headers["x-session-id"];
        const { message } = req.body;

        if(!message){
            throw new AppError("message is required", 400);
        }

        const result = await chatWithAssistant(sessionId, message);

        res.json({
            success: true,
            ...result
        });
    }catch(err){
        next(err);
    }
}