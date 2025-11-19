// client/src/app/api/enquiries/route.js
import { NextResponse } from "next/server";
import { supabase as supabaseServer } from "@/lib/supabaseServer"; 
// ⬆ if your supabaseServer is under components/lib, use:
// import { supabase as supabaseServer } from "@/components/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("enquiries")
      .select(
        `
        enquiry_id,
        description,
        status,
        source,
        queue_number,
        attachment_url,
        created_at,
        updated_at,
        customer_id,
        category_id,
        customers(full_name),
        enquiry_categories(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/enquiries error:", error);
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
    console.error("GET /api/enquiries fatal error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error loading enquiries" },
      { status: 500 }
    );
  }
}
