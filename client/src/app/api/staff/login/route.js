import { NextResponse } from "next/server";
import * as ctrl from "@/core/controllers/staff.controller";

// POST /api/staff/login
export async function POST(request) {
    let statusCode = 200;
    let responseData = null;

    const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
    };

    await ctrl.login(request, res);

    return NextResponse.json(responseData, { status: statusCode });
}
