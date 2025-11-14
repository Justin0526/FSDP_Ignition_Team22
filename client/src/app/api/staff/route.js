import { NextResponse } from "next/server";
// If your file is still under components/, change the import accordingly:
import { supabase as supabaseServer } from "@/lib/supabaseServer";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    let query = supabaseServer.from("staff").select(
      // adjust fields to your schema
      "staff_id, full_name, email, role, avatar_url, branch, created_at"
    );

    if (id) {
      query = query.eq("staff_id", id).maybeSingle();
      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    if (email) {
      query = query.eq("email", email).maybeSingle();
      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    // Fallback: first row (handy during dev)
    const { data, error } = await query.order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("[staff API]", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
