// ============================================
// enquiries API Route
// --------------------------------------------
// This file defines the HTTP endpoints for /api/enquiries.
// Next.js automatically maps this file to that URL.
//
// Each exported function (GET, POST, etc.) represents
// a supported HTTP method for this route.
// The functions call the controller layer for actual logic.
// ============================================

export const runtime = "nodejs";

import {NextResponse} from "next/server";
import * as ctrl from "@/core/controllers/enquiries.controller";

export async function GET(){
    try{
        const rows = await ctrl.getAllCategories();
        return NextResponse.json({ok: true, data:rows}, {status:200});
    }catch(error){
        console.error(error);
        return NextResponse.json({ok:false, error: "Server error"}, {status: 500});
    }
}