import * as repo from "@/core/repos/staff.repo";

export async function getStaffById(){
    // Fake the cookie (temporary)
    const fakeSession = "staff_001";
    
    // Exract staff ID
    const staffId = fakeSession.replace("staff_001", "835b0382-bcd4-4e43-8e17-73b78baa4416")

    // Fetch staff record
    const staff = await repo.getStaffById(staffId);
    if(!staff) throw new Error("Mocked staff not found");

    return staff;
}