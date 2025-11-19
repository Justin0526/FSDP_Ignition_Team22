import * as svc from "@/core/services/staff.service";

// GET: for getting staff by id (called via route)
export async function getStaffById(req, res) {
    try {
        const id = req.nextUrl?.searchParams.get("id");
        if (!id) {
        return res.status(400).json({ ok: false, message: "ID is required" });
        }
        const staff = await svc.getStaffById(id);
        return res.status(200).json({ ok: true, data: staff });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
}

// POST: for login (called via route)
export async function login(req, res) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
        }
        const staff = await svc.loginStaff(email, password);
        return res.status(200).json({ success: true, staff });
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}
