// Handles the verification + session lifecycle logic
import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";

const MAX_IDLE_MS = 5 * 60 * 1000; // 5 minutes idle timeout
const OTP_LIFETIME_MS = 5 * 60 * 1000; // OTP valid for 5 minutes

// -------- Helpers --------

// Generate a simple 6-digit OTP 
function generateOtpCode(){
    return String(Math.floor(100000 + Math.random() * 900000));
}

// Get session
async function getSessionOrThrow(sessionId){
    const { data, error } = await supabase
        .from("chatbot_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .single();

    if (error || !data){
        throw new AppError("Session not found", 404);
    }

    return data;
}

// Find customer by session and nric
async function findCustomerBySessionAndNric(session, nricLast4){
    if(!session.mobile_number){
        throw new AppError("Phone number not set for this session", 400);
    }

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("mobile_number", session.mobile_number)
        .eq("nric_last4", nricLast4)
        .single();

    if (error || !data){
        throw new AppError("Customer not found or details do not match", 401);
    }

    return data;
}

// Update session and allow customer to enter otp
async function updateSessionForOtp(sessionId, customerId, nricLast4){
    const { data, error } = await supabase
        .from("chatbot_sessions")
        .update({
            nric_last4: nricLast4,
            customer_id: customerId,
            status: "awaiting_otp",
            last_active_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .select("*")
        .single();

    if (error || !data){
        throw new AppError("Failed to update session", 500);
    }

    return data;
}

// Create otp for session
async function createOtpForSession(sessionId){
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_LIFETIME_MS).toISOString();

    const { error } = await supabase
        .from("otps")
        .insert({
            session_id: sessionId,
            code: otpCode,
            expires_at: expiresAt,
        });
    
    if (error){
        throw new AppError("Failed to generate OTP", 500);
    }

    return otpCode;
}

// fetch otp
async function getLatestActiveOtp(sessionId){
    const { data, error } = await supabase
        .from("otps")
        .select("*")
        .eq("session_id", sessionId)
        .is("consumed_at", null)
        .order("created_at", {ascending:false})
        .limit(1)
        .single();

    if (error || !data){
        throw new AppError("No active OTP found", 404);
    }
    
    return data;
}

//check otp expiry
function validateOtpExpiry(otp){
    const now = new Date();
    if (new Date(otp.expires_at) < now){
        throw new AppError("OTP expired", 401);
    }
}

// Validate OTP
async function validateOtpCode(otp, otpCode){
    if (otp.code !== otpCode){
        await supabase
            .from("otps")
            .update({
                attempts: (otp.attmepts ?? 0) + 1
            })
            .eq("otp_id", otp.otp_id);

        throw new ApppError("OTP incorrect", 401);
    }
}

// Use OTP
async function consumeOtp(otp){
    await supabase
        .from("otps")
        .update({
            consumed_at: new Date().toISOString()
        })
        .eq("otp_id", otp.otp_id);
}

// Activate session
async function activateSession(sessionId){
    const now = new Date();
    const { data, error } = await supabase
        .from("chatbot_sessions")
        .update({
            is_verified: true,
            status: "active",
            verified_at: now.toISOString(),
            last_active_at: now.toISOString(),
        })
        .eq("session_id", sessionId)
        .select("*")
        .single();

    if (error || !data ){
        throw new AppError("Failed to activate session", 500);
    }

    return data;
}

// -------- Public Service Functions --------
// 1) Start session when user clicks the link
export async function startSession(){
    const { data, error } = await supabase
        .from("chatbot_sessions")
        .insert({
            status: "awaiting_phone", // mobile number is null at this point
        })
        .select("*")
        .single();

    if (error) throw new AppError("Failed to create session", 500);
    return data;
}

// 2) After session is created, user enters phone number
// We update the session with the mobile_number and move to awaiting_nric
export async function submitPhone(sessionId, mobileNumber){
    if(!sessionId || !mobileNumber){
        throw new AppError("sessionId and mobileNumber are required", 400);
    }

    const { data: session, error } = await supabase
        .from("chatbot_sessions")
        .update({
            mobile_number: mobileNumber,
            status: "awaiting_nric",
            last_active_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .select("*")
        .single();

    if (error || !session){
        throw new AppError("Session not found", 404);
    }

    return session;
}

// 3. User submits NRIC last 4, we match to a customer and generate OTP
export async function submitNric(sessionId, nricLast4){
    if (!sessionId || !nricLast4){
        throw new AppError("sessionId and nricLast4 are required", 400);
    }

    // 1. Load session
    const session = await getSessionOrThrow(sessionId);

    // 2. Find matching customer
    const customer = await findCustomerBySessionAndNric(session, nricLast4);

    // 3. Update session to "awaiting_otp"
    const updatedSession = await updateSessionForOtp(sessionId, customer.customer_id, nricLast4);

    // 4. createOtp for session
    const otpCode = await createOtpForSession(sessionId);

    return {
        session: updatedSession,
        otp: otpCode, 
    }
}

// 4. Verify OTP and activate session
export async function verifyOtp(sessionId, otpCode){
    if (!sessionId || !otpCode){
        throw new AppError("sessionId and otp are required", 400);
    }

    // 1. Get OTP
    const otp = await getLatestActiveOtp(sessionId);

    // 2. Validate OTP
    validateOtpExpiry(otp);
    await validateOtpCode(otp, otpCode);

    // 3. Use OTP
    await consumeOtp(otp);

    // 4. Load and validate session
    const session = await getSessionOrThrow(sessionId);
    if(!session.customer_id){
        throw new AppError("Customer data not linked.", 400);
    }

    return await activateSession(sessionId);
}

// 5. Used by middleware to check active + verified + not idle.
export async function getAndValidateActiveSession(sessionId){
    if(!sessionId){
        throw new AppError("sessionId is required", 401);
    }

    const session = await getSessionOrThrow(sessionId);

    // Check if session has expired
    const now = Date.now();
    const lastActive = new Date(session.last_active_at).getTime();
    const idleMs = now - lastActive;

    if (idleMs > MAX_IDLE_MS){
        await supabase
            .from("chatbot_sessions")
            .update({
                status: "expired",
                ended_at: new Date().toISOString(),
                end_reason: "idle_timeout",
            })
            .eq("session_id", sessionId)

        throw new AppError("Session expired", 440); // 440 = login timeout
    }

    if (!session.is_verified || session.status !== "active"){
        throw new AppError("Session not verified", 401);
    }

    await supabase
        .from("chatbot_sessions")
        .update({
            last_active_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);

    return session;
}