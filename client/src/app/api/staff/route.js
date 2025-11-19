import { NextResponse } from "next/server";
import * as ctrl from "@/core/controllers/staff.controller";

// GET /api/staff?id=xxx
export async function GET(request) {
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (data) => { responseData = data; return res; }
  };

  await ctrl.getStaffById(request, res);

  return NextResponse.json(responseData, { status: statusCode });
}
