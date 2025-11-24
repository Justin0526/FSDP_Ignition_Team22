import * as svc from "../services/categoryService.js";

// Get /api/categories
export async function handleGetRootCategories(req, res, next){
    try{
        const categories = await svc.getRootCategories();
        res.json({
            success: true,
            categories,
        });
    }catch(err){
        next(err);
    }
}

// Get api/categories/:parentId/subcategories
export async function handleGetSubcategories(req, res, next){
    try{
        const { parentId } = req.params;
        const subcategories = await svc.getSubcategoriesByParentId(parentId);
        res.json({
            success: true,
            subcategories,
        });
    }catch(err){
        next(err);
    }
}