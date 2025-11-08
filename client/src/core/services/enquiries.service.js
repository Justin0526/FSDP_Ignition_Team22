import * as repo from "@/core/repos/enquiries.repo";
export async function getAll(){
    return repo.list();
}