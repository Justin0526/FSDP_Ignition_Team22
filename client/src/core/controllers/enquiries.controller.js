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

export async function index(){
    return svc.getAll();
}

export async function getAllCategories(){
    return svc.getAllCategories();
}