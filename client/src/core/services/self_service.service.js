import * as repo from "@/core/repos/self_service.repo";

export async function getSelfServiceByCategory(categoryId){
    if(!categoryId) throw new Error("CATEGORY_REQUIRED");

    return repo.getSelfServiceByCategory(categoryId);
}