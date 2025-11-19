import * as repo from "@/core/repos/staff.repo";
import bcrypt from "bcryptjs";

export async function getStaffById(staffId){
    // Fetch staff record
    const staff = await repo.getStaffById(staffId);
    if(!staff) throw new Error("Staff not found");

    return staff;
}

// Business logic for logging in staff
export async function loginStaff(email, password) {
    const staff = await repo.getActiveStaffByEmail(email);

    if (!staff) throw new Error("Invalid email or password");
    const isPasswordValid = await bcrypt.compare(password, staff.password_hash); // Adjust to your field

    if (!isPasswordValid) throw new Error("Invalid email or password");
    const { password_hash, ...staffData } = staff;

    return staffData;
}