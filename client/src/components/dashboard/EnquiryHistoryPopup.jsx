// client/src/components/dashboard/EnquiryHistoryPopup.jsx
"use client";

import { useEffect, useState } from "react";

export default function EnquiryHistoryPopup({
  isOpen,
  onClose,
  customerId,
  activeEnquiryId,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !customerId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setRows([]);

        const res = await fetch(
          `/api/enquiry-history?customerId=${encodeURIComponent(customerId)}`
        );
        const json = await res.json();

        if (!json.ok) {
          throw new Error(json.error || "Failed to load enquiry history");
        }

        setRows(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  // 1️⃣ Remove the currently active enquiry from the list
  const nonActiveRows = rows.filter(
    (r) => r.enquiry_id !== activeEnquiryId && r.enquiry_id != null
  );

  // 2️⃣ Only keep COMPLETED statuses as "past"
  const completedStatuses = new Set([
    "resolved",
    "closed_unresolved",
    "cancelled",
  ]);

  const pastRows = nonActiveRows.filter((r) => {
    const statusKey = (r.status || "").toLowerCase();
    return completedStatuses.has(statusKey);
  });

  // 3️⃣ Decide what to actually display:
  //    - If we found past (completed) enquiries → show those
  //    - If not, but there ARE other enquiries → show them as "previous, not completed"
  //    - If nothing at all → show "No enquiries"
  const rowsToDisplay =
    pastRows.length > 0 ? pastRows : nonActiveRows;

  const showingOnlyCompleted = pastRows.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-5xl p-8 max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-3xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 underline text-black">
          Enquiry History
        </h2>

        {loading && (
          <div className="mb-3 text-sm text-gray-700">Loading…</div>
        )}
        {error && (
          <div className="mb-3 text-sm text-red-600">Error: {error}</div>
        )}

        {/* Small hint so you know what's happening */}
        {!loading && !error && rows.length > 0 && (
          <p className="mb-3 text-xs text-gray-600">
            Found {rows.length} enquiries for this customer.{" "}
            {showingOnlyCompleted
              ? `Showing ${pastRows.length} completed (past) enquiries.`
              : rowsToDisplay.length > 0
              ? `No completed enquiries found. Showing ${rowsToDisplay.length} previous enquiries instead.`
              : "No previous enquiries to display."}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-black">
            <thead>
              <tr>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Enquiry Type
                </th>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Description
                </th>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rowsToDisplay.length === 0 && !loading ? (
                <tr>
                  <td
                    className="border border-black p-4 text-center text-sm text-gray-600"
                    colSpan={3}
                  >
                    No past enquiries found for this customer.
                  </td>
                </tr>
              ) : (
                rowsToDisplay.map((r) => (
                  <tr key={r.enquiry_id}>
                    <td className="border border-black p-4 font-semibold align-top">
                      {r.category?.name ?? "—"}
                    </td>
                    <td className="border border-black p-4 align-top">
                      {r.description ?? "—"}
                    </td>
                    <td className="border border-black p-4 font-semibold align-top capitalize">
                      {r.status ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
