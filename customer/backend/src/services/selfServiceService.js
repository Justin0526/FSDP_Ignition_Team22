import supabase from "../config/supabase.js"
import AppError from "../utils/AppError.js"

// Get self-service via categoryId
export async function getSelfServiceByCategoryId(categoryId){
    const cleanId = String(categoryId).trim();
    const { data, error } = await supabase
        .from("self_service_items")
        .select("*")
        .eq("category_id", cleanId)
        .order("sort_order", {ascending: true})

    if (error || !data){
        console.error("[getSelfServiceByCategoryId] error: ", error);
        throw new AppError("Failed to load self-services ", 500);

    }

    return data;
}

// Get self-service via subcategory
export async function getSelfServiceBySubcategoryId(subcategoryId){
    const cleanId = String(subcategoryId).trim();
    const { data, error } = await supabase
        .from("self_service_items")
        .select("*")
        .eq("subcategory_id", cleanId)
        .order("sort_order", {ascending: true})

    if (error || !data){
        console.error("[getSelfServiceBySubcategoryId] error: ",error);
        throw new AppError("Failed to load self-services ", 500);

    }

    return data;
}


// Get recommendations via category
export async function getSelfServiceRecommendations(categoryId, subcategoryId){
    const [ catResult, subResult ] = await Promise.all([
        getSelfServiceByCategoryId(categoryId),
        getSelfServiceBySubcategoryId(subcategoryId),
    ]);

    const primaryList = subResult || [];
    const primary = primaryList[0] || null;

    // Build a set of Ids to exclude from related
    const excludeIds = new Set(primaryList.map((item) => item.self_service_id));

    const related = (catResult || []).filter(
        (item) => !excludeIds.has(item.self_service_id)
    );

    return{ primary, primaryList, related}
}