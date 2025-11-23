// Protects route so only verified + active sessions can access them
import { getAndValidateActiveSession } from "../services/sessionService";

export async function requireVerifiedSession(req, res, next){
    try {
        const { sessionId } = req.body;
        const session = await getAndValidateActiveSession(sessionId);

        req.session = session;
        next();
    }catch(err){
        next(err);
    }
}