import 'server-only';
import React from "react";
// ✅ Use the path where YOUR service-role client lives:
import { supabase as supabaseServer } from "@/lib/supabaseServer";
// or: import { supabase as supabaseServer } from "@/components/lib/supabaseServer";

function formatTS(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

async function loadQueue() {
  // Join enquiries → customers (full_name) → categories (name)
  // If your category table/column names differ, tell me and I’ll adjust.
  const select = `
    enquiry_id,
    description,
    status,
    queue_number,
    created_at,
    customer:customers(full_name),
    category:enquiry_categories(name)
  `;

  let q = supabaseServer.from("enquiries").select(select);

  // Graceful ordering: queue_number asc, then fallback by created_at if present
  try {
    q = q.order("queue_number", { ascending: true, nullsFirst: true });
    // created_at may not exist in your enquiries schema; ignore if it does
    q = q.order("created_at", { ascending: true });
  } catch {
    // ignore
  }

  const { data, error } = await q.limit(50);
  if (error) return { error: error.message, rows: [] };
  return { error: null, rows: data ?? [] };
}

export default async function EnquiryQueueTable() {
  const { error, rows } = await loadQueue();

  return (
    <section className="rounded-2xl bg-white border p-6">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-900">Enquiry Queue</h1>

      {error ? (
        <div className="text-red-600 text-sm mb-3">Error: {error}</div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          {/* Header */}
          <thead>
            <tr>
              {["No.", "Name", "Type", "Description", "Submission Time", "Status", "Chat"].map((h, i) => (
                <th
                  key={i}
                  className="bg-gray-100 text-gray-900 font-extrabold text-left px-4 py-3 border border-black"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-600 border border-black" colSpan={7}>
                  No enquiries in the queue.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.enquiry_id}>
                  <td className="px-4 py-3 border border-black font-bold">{idx + 1}.</td>
                  <td className="px-4 py-3 border border-black">{r.customer?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 border border-black">{r.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 border border-black">{r.description ?? "—"}</td>
                  <td className="px-4 py-3 border border-black whitespace-nowrap">
                    {formatTS(r.created_at)}
                  </td>
                  <td className="px-4 py-3 border border-black">{r.status ?? "—"}</td>
                  <td className="px-4 py-3 border border-black">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border text-gray-800 hover:bg-gray-100"
                      title="Open chat (stub)"
                    >
                      💬
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom right "Return" button like your wireframe */}
      <div className="mt-6 flex justify-end">
        <a
          href="/dashboard"
          className="inline-flex items-center rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3"
        >
          Return
        </a>
      </div>
    </section>
  );
}
