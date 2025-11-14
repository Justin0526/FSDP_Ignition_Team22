// src/app/api/chatbot/verify-customer/route.js
import { NextResponse } from "next/server";
import * as ctrl from "@/core/controllers/customer.controller"

export async function POST(req) {
  try {
    // 1️Parse JSON safely
    const body = await req.json().catch(() => {
      throw new Error("INVALID_JSON");
    });

    // Run the controller
    const result = await ctrl.verifyCustomerController(body);

    // Return what controller gives (structured response)
    return NextResponse.json(result, { status: result.status });
  } catch (err) {
    // Handle any uncaught or fatal error
    console.error("[verify-customer API] Unexpected error:", err);

    // Common fallback messages
    const message =
      err.message === "INVALID_JSON"
        ? "Invalid or malformed JSON request body."
        : "An unexpected server error occurred.";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: err.message || "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
