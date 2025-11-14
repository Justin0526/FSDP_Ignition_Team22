import * as svc from "@/core/services/consultation.services";

const ERROR_MAP = {
    INVALID_JSON: { status: 400, message: "Invalid JSON body.", field: null, hint: null },
    DB_QUERY_FAILED: { status: 500, message: "Database query failed.", field: null, hint: null },
    ENQUIRY_REQUIRED: { status: 400, message: "Enquiry is required.", field: "enquiry_id", hint: null },
    MODE_REQUIRED: { status: 400, message: "Mode is required.", field: "mode", hint: "Select Online or Physical" },
}

export async function createConsultationController(body){
    const {enquiryId, mode} = body || {};

    try{
        const data = await svc.createConsultation(enquiryId, mode);
        return {ok: true, data, status: 201}
    } catch(err){
        console.error("[consultation.controller] DB error:", err);
        const code = err?.message || "DB_QUERY_FAILED";
        const spec = ERROR_MAP[code] || ERROR_MAP.DB_QUERY_FAILED;
        return{
            ok: false,
            error: {code, message: spec.message, field: spec.field, hint: spec.hint},
            status: spec.status,
        };
    }
}