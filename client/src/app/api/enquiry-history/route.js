// client/src/app/api/enquiry-history/route.js
import { NextResponse } from "next/server";
import { supabase as supabaseServer } from "@/lib/supabaseServer"; 
// ^ adjust path if your supabaseServer is in a different folder

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerIdParam = searchParams.get("customerId");

    let q = supabaseServer
      .from("enquiries")
      .select(
        `
        enquiry_id,
        description,
        status,
        created_at,
        customer_id,
        category:enquiry_categories(name)
      `
      )
      .order("created_at", { ascending: false });

    if (customerIdParam) {
      // Try numeric and string match for safety
      const cidNum = Number(customerIdParam);
      if (!Number.isNaN(cidNum)) {
        q = q.eq("customer_id", cidNum);
      } else {
        q = q.eq("customer_id", customerIdParam);
      }
    }

    const { data, error } = await q;

    if (error) {
      console.error("GET /api/enquiry-history error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data ?? [],
    });
  } catch (err) {
    console.error("GET /api/enquiry-history fatal error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error loading enquiry history" },
      { status: 500 }
    );
  }
}
