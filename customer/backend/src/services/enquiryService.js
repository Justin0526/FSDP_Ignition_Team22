import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";
import { getAndValidateActiveSession } from "./sessionService.js";

// Create new enquiry for the current customer
export async function createEnquiry(sessionId, {categoryId, subcategoryId, details}){
    if(!categoryId){
        throw new AppError("categoryId is required", 400);
    }

    const session = await getAndValidateActiveSession(sessionId);

    if(!session.customer_id){
        throw new AppError("No customer linked to this session", 400);
    }

    const { data, error } = await supabase
        .from("enquiries")
        .insert({
            session_id: session.session_id,
            customer_id: session.customer_id,
            category_id: categoryId,
            subcategory_id: subcategoryId,
            details: details || null,
        })
        .select("*")
        .single();

    if(error || !data){
        throw new AppError("Failed to create enquiry", 500);
    }

    return data;
}