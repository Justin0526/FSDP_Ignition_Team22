export const runtime = "nodejs";

import {NextResponse} from "next/server";
import * as ctrl from "@/core/controllers/consultation.controller";

export async function POST(req){
    try{
        const body = await req.json().catch(() => {
            throw new Error("INVALID_JSON");
        })

        const result = await ctrl.createConsultationController(body);
        return NextResponse.json(result, {status: result.status});
    } catch(err){
        console.error("[Create consultation API] Unexpected error: ", err);
        const message = err.message === "INVALID_JSON"
        ? "Invalid or malformed JSON request body."
        : "An unexpected server error occurred.";

        return NextResponse.json(
            { ok: false, error: { code: err.message || "INTERNAL_ERROR", message } },
            { status: 500 }
        );
    }
}