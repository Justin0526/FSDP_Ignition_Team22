import * as svc from "@/core/services/self_service.service";

const ERROR_MAP = {
    DB_QUERY_FAILED: { status: 500, message: "Database query failed.", field: null, hint: null },
    CATEGORY_REQUIRED: {status: 400, message: "Category is required.", field: "category_id", hint: null},
}

export async function getSelfServiceByCategoryController(categoryId){
    try {
        const data = await svc.getSelfServiceByCategory(categoryId);
        return {ok: true, data, status: 200}
    }catch(err){
        console.error("[self_service.controller] DB error:", err);
        const code = err?.message || "DB_QUERY_FAILED";
        const spec = ERROR_MAP[code] || ERROR_MAP.DB_QUERY_FAILED;
        return{
            ok: false,
            error: {code, message: spec.message, field: spec.field, hint: spec.hint},
            status: spec.status,
        };
    }
}