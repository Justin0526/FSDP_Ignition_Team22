import * as svc from "@/core/services/enquiries.service";
export async function index(){
    return svc.getAll();
}