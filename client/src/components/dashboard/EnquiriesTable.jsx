"use client";

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge"; // adjust path if needed


export default function EnquiriesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/enquiries", { cache: "no-store" });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Failed to load enquiries");
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-black p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 text-black">
      <h1 className="text-3xl font-bold mb-2">Enquiries</h1>
      <p className="mb-6">
        Showing {data.length} record{data.length === 1 ? "" : "s"}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-black">
          <thead>
            <tr className="bg-gray-200 border-b">
              {[
                "Enquiry ID",
                "Customer Name",
                "Category",
                "Description",
                "Status",
                "Source",
                "Queue No.",
                "Attachment",
                "Created At",
                "Updated At",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left p-3 font-semibold uppercase text-xs border-b border-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.enquiry_id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{row.enquiry_id}</td>
                <td className="p-3">
                  {row.customers?.full_name ?? `ID: ${row.customer_id}`}
                </td>
                <td className="p-3">
                  {row.enquiry_categories?.name ?? `ID: ${row.category_id}`}
                </td>
                <td className="p-3">{row.description}</td>
                <td className="p-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="p-3">{row.source}</td>
                <td className="p-3">{row.queue_number ?? "-"}</td>
                <td className="p-3">{row.attachment_url ?? "-"}</td>
                <td className="p-3 whitespace-nowrap">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleString()
                    : "-"}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {row.updated_at
                    ? new Date(row.updated_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
