import * as repo from "@/core/repos/consultation.repo";

export async function createConsultation(enquiryId, mode){
    if (!enquiryId) throw new Error("ENQUIRY_REQUIRED");
    if (!mode) throw new Error("MODE_REQUIRED");

    return repo.createConsultation({enquiry_id: enquiryId, mode: mode});
}