import * as svc from "@/core/services/staff.service";

export async function getStaffById(){
    return await svc.getStaffById();
}