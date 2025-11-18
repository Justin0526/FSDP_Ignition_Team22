// src/components/SummaryPanelServer.jsx
import "server-only";
import React from "react";
import Image from "next/image";
import { supabase as supabaseServer } from "@/lib/supabaseServer";
import ViewEnquiryHistoryButton from "./ViewEnquiryHistoryButton";

async function loadSummary(enquiryId) {
  // enquiries joined to customers
  const select =
    `enquiry_id, description, urgency, status, customer_id, category_id,
     customer:customers(
       customer_id,
       full_name,
       nric_last4,
       mobile_number,
       email_address,
       relationship_type,
       preferred_language,
       created_at,
       updated_at
     )`;

  let q = supabaseServer.from("enquiries").select(select);

  if (enquiryId) {
    q = q.eq("enquiry_id", enquiryId).maybeSingle();
  } else {
    // take the earliest enquiry (or any if created_at missing)
    q = q.order("created_at", { ascending: true }).limit(1).maybeSingle();
  }

  const { data, error } = await q;

  if (error) {
    return { error: error.message, enquiry: null, customer: null };
  }
  if (!data) {
    return { error: null, enquiry: null, customer: null };
  }

  return {
    error: null,
    enquiry: {
      enquiry_id: data.enquiry_id,
      description: data.description,
      urgency: data.urgency,
      status: data.status,
      customer_id: data.customer_id,
      category_id: data.category_id,
    },
    customer: data.customer ?? null,
  };
}

export default async function SummaryPanelServer({ enquiryId }) {
  const { error, enquiry, customer } = await loadSummary(enquiryId);

  const customerId = customer?.customer_id ?? null;

  return (
    <aside className="space-y-4 text-black">
      {/* SUMMARY */}
      <div className="rounded-2xl bg-white border border-black p-4">
        <h2 className="text-xl font-bold mb-3 underline">Summary</h2>
        <div className="rounded-xl border border-black bg-gray-50 p-3 text-sm min-h-[64px] flex items-center">
          {error
            ? `Error: ${error}`
            : enquiry?.description || "No enquiry found."}
        </div>
      </div>

      {/* CONTEXT IMAGE (from /public/context.png) */}
      <div className="rounded-2xl overflow-hidden border border-black">
        <Image
          src="/context.png"
          alt="Context"
          width={400}
          height={200}
          className="w-full h-32 object-cover"
        />
      </div>

      {/* CUSTOMER INFO */}
      <div className="rounded-2xl bg-white border border-black p-4">
        <h3 className="text-xl font-bold mb-4">Customer Info</h3>

        {!customer ? (
          <div className="text-sm text-gray-600">
            {error ? `Error: ${error}` : "No customer linked to this enquiry."}
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-base">
              {customer.full_name ?? "—"}
            </div>
            <div>{customer.mobile_number ?? "—"}</div>
            <div>{customer.email_address ?? "—"}</div>
            <div>{customer.relationship_type ?? "—"}</div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center rounded-full border border-black px-2 py-1 text-xs bg-gray-50">
                NRIC (last 4): {customer.nric_last4 ?? "—"}
              </span>
              <span className="inline-flex items-center rounded-full border border-black px-2 py-1 text-xs bg-gray-50">
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

        {/* BUTTONS */}
        <div className="mt-5 space-y-3">
          {/* This client component opens the DB-driven history popup */}
          <ViewEnquiryHistoryButton customerId={customerId} />

          <button className="w-full rounded-full border border-black px-4 py-2 font-medium hover:bg-gray-100">
            Edit Enquiry Status
          </button>
        </div>
      </div>
    </aside>
  );
}
