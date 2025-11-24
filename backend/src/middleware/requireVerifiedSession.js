// Protects route so only verified + active sessions can access them
import { getAndValidateActiveSession } from "../services/sessionService.js";

export async function requireVerifiedSession(req, res, next){
    try {
        const  sessionId  = req.headers["x-session-id"];
        const session = await getAndValidateActiveSession(sessionId);

        req.session = session;
        next();
    }catch(err){
        const status = err.statusCode || 401;
        return res.status(status).json({
            success: false,
            error: err.message || "Session invalid",
        });
    }
}