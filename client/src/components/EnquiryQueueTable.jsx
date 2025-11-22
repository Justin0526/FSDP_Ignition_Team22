import "server-only";
import React from "react";
import { supabase as supabaseServer } from "@/lib/supabaseServer";

function formatTS(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

async function loadQueue() {
  const select = `
    enquiry_id,
    description,
    status,
    created_at,
    customer:customers(full_name),
    category:enquiry_categories(name)
  `;

  let q = supabaseServer.from("enquiries").select(select).order("created_at");

  const { data, error } = await q;
  if (error) return { error: error.message, rows: [] };
  return { error: null, rows: data ?? [] };
}

export default async function EnquiryQueueTable() {
  const { error, rows } = await loadQueue();

  return (
    <section className="rounded-2xl bg-white border p-6">
      <h1 className="text-3xl font-extrabold mb-4 text-black">
        Enquiry Queue
      </h1>

      {error && (
        <div className="text-red-600 text-sm mb-3 font-semibold">
          Error: {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0 text-black">
          {/* Header */}
          <thead>
            <tr>
              {[
                "No.",
                "Name",
                "Type",
                "Description",
                "Submission Time",
                "Status",
                "Chat",
              ].map((h, i) => (
                <th
                  key={i}
                  className="bg-gray-100 text-black font-extrabold text-left px-4 py-3 border border-black"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="text-black">
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-black border border-black font-medium"
                  colSpan={7}
                >
                  No enquiries in the queue.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.enquiry_id} className="text-black">
                  <td className="px-4 py-3 border border-black font-bold text-black">
                    {idx + 1}.
                  </td>
                  <td className="px-4 py-3 border border-black text-black">
                    {r.customer?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 border border-black text-black">
                    {r.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 border border-black text-black">
                    {r.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 border border-black whitespace-nowrap text-black">
                    {formatTS(r.created_at)}
                  </td>
                  <td className="px-4 py-3 border border-black text-black">
                    {r.status ?? "—"}
                  </td>
                  <td className="px-4 py-3 border border-black text-black">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border text-black hover:bg-gray-100"
                      title="Chat (stub)"
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
