// ============================================
// enquiries.service.js
// --------------------------------------------
// The service layer contains business logic.
//
// Its main responsibilities:
// - Process, filter, or transform data before returning
// - Handle business rules (e.g., assign queue numbers)
// - Combine multiple repository calls if needed
//
// Services never interact directly with HTTP (that’s the controller’s job)
// and never use raw database queries (that’s the repository’s job).
// ============================================
import * as repo from "@/core/repos/enquiries.repo";
export async function getAll(){
    return repo.list();
}

export async function getAllCategories(){
    return repo.getAllCategories();
}