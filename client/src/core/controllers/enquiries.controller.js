// ============================================
// enquiries.controller.js
// --------------------------------------------
// The controller layer handles incoming API requests.
//
// Its main responsibilities:
// - Validate request data (using Zod or manual checks)
// - Call the appropriate service function
// - Handle any service-level errors gracefully
//
// Controllers should NOT contain business logic or database code.
// ============================================

import * as svc from "@/core/services/enquiries.service";

const ERROR_MAP = {
  INVALID_JSON: { status: 400, message: "Invalid JSON body.", field: null, hint: null },
  CATEGORY_REQUIRED: { status: 400, message: "Category is required.", field: "category_id", hint: null },
  CUSTOMER_REQUIRED: { status: 400, message: "Customer is required.", field: "customer_id", hint: "Pass customerId or phone." },
  DB_QUERY_FAILED: { status: 500, message: "Database query failed.", field: null, hint: null },
};

export async function index(){
    return svc.getAll();
}

export async function getAllCategories(){
    return svc.getAllCategories();
}

export async function createEnquiryController(body) {
  const { customerId, categoryId, description } = body || {};

  try {
    const data = await svc.createEnquiry(customerId, categoryId, description);
    return { ok: true, data, status: 200 };
  } catch (err) {
    const code = err?.message || "DB_QUERY_FAILED";
    const spec = ERROR_MAP[code] || ERROR_MAP.DB_QUERY_FAILED;
    return {
      ok: false,
      error: { code, message: spec.message, field: spec.field, hint: spec.hint },
      status: spec.status,
    };
  }
}