"use client";
import { useEffect, useState } from "react";

/**
 * <SummaryPanel enquiryId="uuid-optional" />
 * - If enquiryId provided: loads that enquiry
 * - Else: loads any single enquiry
 */
export default function SummaryPanel({ enquiryId }) {
  const [enquiry, setEnquiry] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = enquiryId
          ? `/api/dashboard/summary?id=${encodeURIComponent(enquiryId)}`
          : `/api/dashboard/summary`;
        const res = await fetch(url, { cache: "no-store" });

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Non-JSON response: ${text.slice(0, 120)}…`);
        }

        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Failed to load");

        const data = json.data;
        if (!data) {
          setEnquiry(null);
          setCustomer(null);
        } else {
          // Normalized shape from API: { enquiry, customer }
          setEnquiry(data.enquiry ?? null);
          setCustomer(data.customer ?? null);
        }
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [enquiryId]);

  return (
    <aside className="space-y-4">
      {/* Summary */}
      <div className="rounded-2xl bg-white border p-4">
        <h2 className="text-lg font-semibold mb-2 text-black">Summary</h2>
        <div className="rounded-xl border bg-gray-50 p-3 text-sm text-black min-h-[64px]">
          {loading
            ? "Loading…"
            : err
              ? `Error: ${err}`
              : enquiry?.description || "—"}
        </div>
        {!loading && !err && enquiry && (
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

        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : err ? (
          <div className="text-sm text-red-600">Error: {err}</div>
        ) : !customer ? (
          <div className="text-sm text-gray-600">No customer found.</div>
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
