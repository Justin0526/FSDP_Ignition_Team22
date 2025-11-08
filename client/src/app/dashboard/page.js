"use client";

import { useEffect, useState } from "react";

export default function EnquiriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/enquiries");
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

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-400 p-8">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 text-black">
        <h1 className="text-3xl font-bold mb-2 text-black">Enquiries</h1>
        <p className="text-black mb-6">
          Showing {data.length} record{data.length === 1 ? "" : "s"}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-black">
            <thead>
              <tr className="bg-gray-200 border-b">
                {[
                  "enquiry_id",
                  "customer_id",
                  "category_id",
                  "description",
                  "status",
                  "source",
                  "queue_number",
                  "attachment_url",
                  "created_at",
                  "updated_at",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-3 font-semibold text-black uppercase text-xs"
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
                  <td className="p-3">{row.customer_id}</td>
                  <td className="p-3">{row.category_id}</td>
                  <td className="p-3">{row.description}</td>
                  <td className="p-3 capitalize">{row.status}</td>
                  <td className="p-3">{row.source}</td>
                  <td className="p-3">{row.queue_number ?? "-"}</td>
                  <td className="p-3">{row.attachment_url ?? "-"}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString()}
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
    </main>
  );
}
