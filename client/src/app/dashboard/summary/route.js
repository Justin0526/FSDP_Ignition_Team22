import { NextResponse } from "next/server";
// Use the path where YOUR service client lives:
import { supabase as supabaseServer } from "@/lib/supabaseServer";
// or: import { supabase as supabaseServer } from "@/components/lib/supabaseServer";

/**
 * GET /api/dashboard/summary?id=<enquiry_id>&debug=1
 * - If id provided: returns that enquiry joined with customer
 * - Else: returns any single enquiry joined with customer
 * - If debug=1: returns extra info to help diagnose
 */
export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const debug = url.searchParams.get("debug");

  try {
    // NOTE: This relies on the FK enquiries.customer_id → customers.customer_id.
    // Supabase will expose the relation as "customers(...)". We alias it to "customer".
    let selectFields =
      `enquiry_id, description, urgency, status, customer_id, session_id, category_id, ` +
      `customer:customers (customer_id, full_name, nric_last4, mobile_number, email_address, relationship_type, preferred_language, created_at, updated_at)`;

    let q = supabaseServer.from("enquiries").select(selectFields);

    if (id) {
      q = q.eq("enquiry_id", id).maybeSingle();
    } else {
      q = q.limit(1).maybeSingle();
    }

    const { data, error } = await q;

    if (error) {
      if (debug) console.error("[summary API] join error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // If there is no row, return null
    if (!data) return NextResponse.json({ ok: true, data: null });

    // Ensure consistent shape: { enquiry, customer }
    const payload = {
      enquiry: {
        enquiry_id: data.enquiry_id,
        description: data.description,
        urgency: data.urgency,
        status: data.status,
        customer_id: data.customer_id,
        session_id: data.session_id,
        category_id: data.category_id,
      },
      customer: data.customer ?? null,
    };

    return NextResponse.json({ ok: true, data: payload });
  } catch (err) {
    if (debug) console.error("[summary API] fatal:", err);
    // Always return JSON so the client never sees an HTML error page
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
