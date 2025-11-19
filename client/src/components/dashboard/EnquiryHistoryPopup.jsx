// src/components/EnquiryHistoryPopup.jsx
"use client";

import { useEffect, useState } from "react";

export default function EnquiryHistoryPopup({ isOpen, onClose, customerId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !customerId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/enquiry-history?customerId=${encodeURIComponent(customerId)}`
        );
        const json = await res.json();

        if (!json.ok) throw new Error(json.error || "Failed to load history");
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

        <h2 className="text-2xl font-bold mb-4 text-gray-900 underline">
          Enquiry History
        </h2>

        {loading && (
          <div className="text-sm text-gray-700 mb-3">Loading…</div>
        )}
        {error && (
          <div className="text-sm text-red-600 mb-3">Error: {error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-black">
            <thead>
              <tr>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Enquiries
                </th>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Brief Overview
                </th>
                <th className="border border-black p-4 text-left text-lg font-bold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="border border-black p-4 text-center text-sm"
                  >
                    No past enquiries found for this customer.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.enquiry_id}>
                    {/* I’m using category name as “Enquiries” and description as “Brief Overview” */}
                    <td className="border border-black p-4 font-semibold align-top">
                      {r.category?.name ?? "—"}
                    </td>
                    <td className="border border-black p-4 align-top">
                      {r.description ?? "—"}
                    </td>
                    <td className="border border-black p-4 font-semibold align-top">
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
