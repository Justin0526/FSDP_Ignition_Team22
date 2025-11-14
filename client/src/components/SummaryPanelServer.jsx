// src/components/SummaryPanelServer.jsx
import 'server-only';
import React from "react";
// Use YOUR service client path (the one that exports `supabase`)
import { supabase as supabaseServer } from "@/lib/supabaseServer";
// or: import { supabase as supabaseServer } from "@/components/lib/supabaseServer";

async function loadSummary(enquiryId) {
  // Join enquiries ↔ customers in one query
  const select =
    `enquiry_id, description, urgency, status, customer_id, session_id, category_id,
     customer:customers(
       customer_id, full_name, nric_last4, mobile_number, email_address,
       relationship_type, preferred_language, created_at, updated_at
     )`;

  let q = supabaseServer.from("enquiries").select(select);

  if (enquiryId) {
    q = q.eq("enquiry_id", enquiryId).maybeSingle();
  } else {
    q = q.limit(1).maybeSingle();
  }

  const { data, error } = await q;
  if (error) {
    return { error: error.message, enquiry: null, customer: null };
  }
  if (!data) return { error: null, enquiry: null, customer: null };

  return {
    error: null,
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
}

export default async function SummaryPanelServer({ enquiryId }) {
  const { error, enquiry, customer } = await loadSummary(enquiryId);

  return (
    <aside className="space-y-4">
      {/* Summary */}
      <div className="rounded-2xl bg-white border p-4">
        <h2 className="text-lg font-semibold mb-2 text-black">Summary</h2>
        <div className="rounded-xl border bg-gray-50 p-3 text-sm text-black min-h-[64px]">
          {error
            ? `Error: ${error}`
            : enquiry?.description || "—"}
        </div>

        {!!enquiry && (
          <div className="mt-2 flex flex-wrap gap-2">
            {enquiry.urgency && (
              <span className="text-xs rounded-full border px-2 py-0.5 bg-white">
                Urgency: {enquiry.urgency}
              </span>
            )}
            {enquiry.status && (
              <span className="text-xs rounded-full border px-2 py-0.5 bg-white">
                Status: {enquiry.status}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Context image */}
      <div className="rounded-2xl overflow-hidden border">
        <img
          src="/default/placeholder.jpg"
          alt="Context"
          className="w-full h-32 object-cover"
        />
      </div>

      {/* Customer Info */}
      <div className="rounded-2xl bg-white border p-4 text-black">
        <h3 className="text-lg font-semibold mb-3">Customer Info</h3>

        {!customer ? (
          <div className="text-sm text-gray-600">
            {error ? `Error: ${error}` : "No customer found."}
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="font-medium">{customer.full_name ?? "—"}</div>
            <div>NRIC (last 4): {customer.nric_last4 ?? "—"}</div>
            <div>Mobile: {customer.mobile_number ?? "—"}</div>
            <div>Email: {customer.email_address ?? "—"}</div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-gray-50">
                Segment: {customer.relationship_type ?? "—"}
              </span>
              <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-gray-50">
                Pref. Lang: {customer.preferred_language ?? "—"}
              </span>
            </div>

            <div className="text-xs text-gray-500 pt-1">
              Customer since:{" "}
              {customer.created_at
                ? new Date(customer.created_at).toLocaleString()
                : "—"}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <button className="w-full rounded-full border px-3 py-2 bg-white hover:bg-gray-50">
            View enquiry history
          </button>
          <button className="w-full rounded-full border px-3 py-2 bg-white hover:bg-gray-50">
            Edit Enquiry Status
          </button>
        </div>
      </div>
    </aside>
  );
}
