// src/app/api/self-service/route.ts (or .js)
import { NextResponse } from "next/server";
import * as ctrl from "@/core/controllers/self_service.controller";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");

        const result = await ctrl.getSelfServiceByCategoryController(categoryId);
        return NextResponse.json(result, { status: result.status });
    } catch (err) {
        console.error("[Get self service API] Unexpected error:", err);
        const message = err?.message || "Unexpected error";

        return NextResponse.json(
            {
            ok: false,
            error: {
                code: err?.message || "INTERNAL_ERROR",
                message,
            },
            },
            { status: 500 }
        );
    }
}
