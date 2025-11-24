// Handles reading enquiry categories (main + subcategories) from supabase
import supabase from "../config/supabase.js";
import AppError from "../utils/AppError.js";

// Get all top level categories and sort by sort order
export async function getRootCategories(){
    const { data, error } = await supabase
        .from("enquiry_categories")
        .select("*")
        .is("parent_id", null)
        .eq("is_active", true)
        .order("sort_order", {ascending: true});

        if (error || !data){
            console.error("[getRootCategories] error:", error);
            throw new AppError("Failed to load categories ", 500);
        }

        return data;
}

// Get subcategories via the parent category id
export async function getSubcategoriesByParentId(parentId){
    const { data, error } = await supabase
        .from("enquiry_categories")
        .select("*")
        .eq("parent_id", parentId)
        .eq("is_active", true)
        .order("sort_order", {ascending: true});

    if (error || !data){
        console.error("[getSubcategoriesByParentId] error: ", error);
        throw new AppError("Failed to load subcategories", 500);
    }

    return data;
}

// Get category by categoryId
export async function getCategoryByCategoryId(categoryId){
    const { data, error } = await supabase
        .from("enquiry_categories")
        .select("*")
        .eq("category_id", categoryId)
        .single();

    if(error || !data){
        console.error("[getCategoryByCategoryId] error: ", error);
        throw new AppError("Failed to fetch category", 500);
    }

    return data;
}