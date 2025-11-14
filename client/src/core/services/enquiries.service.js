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

// Get all categories for customer to choose
export async function getAllCategories(){
    return repo.getAllCategories();
}

// Create new enquiry 
export async function createEnquiry(customerId, categoryId, description) {
    if (!customerId) throw new Error("CUSTOMER_REQUIRED");
    if (!categoryId) throw new Error("CATEGORY_REQUIRED");

    // Map to the repo’s expected shape
    return repo.createEnquiry({
        customer_id: customerId,
        category_id: categoryId,
        description: description ?? null,
    });
}