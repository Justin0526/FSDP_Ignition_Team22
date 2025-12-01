import * as svc from "../services/selfServiceService.js";

// Get /api/selfService/:categoryId
export async function handleGetSelfServiceByCategoryId(req, res, next){
    try{
        const { categoryId } = req.params;
        const selfServices = await svc.getSelfServiceByCategoryId(categoryId);
        res.json({
            success: true,
            selfServices,
        });
    }catch(err){
        next(err);
    }
}

// Get api/selfService/:subcategoryId/subcategory
export async function handleGetSelfServiceBySubcategoryId(req, res, next){
    try{
        const { subcategoryId } = req.params;
        const selfServices = await svc.getSelfServiceBySubcategoryId(subcategoryId);
        res.json({
            success: true,
            selfServices,
        });
    }catch(err){
        next(err);
    }
}

// Get api/selfService/recommendations
export async function handleGetSelfServiceRecommendations(req, res, next){
    try{
        const { categoryId, subcategoryId } = req.query;

        const { primary, primaryList, related } = await svc.getSelfServiceRecommendations(categoryId, subcategoryId);

        res.json({
            success: true,
            primary,
            primaryList,
            related
        });
    } catch(err){
        next(err);
    }
}