"use client";
import { useEffect, useState } from "react";

export default function QueueHeader() {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/staff", { cache: "no-store" });
        const json = await res.json();
        if (json.ok) setStaff(json.data);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="OCBC" className="h-8 w-auto object-contain" />
        </div>

        {/* Queue count badge */}
        <div className="px-3 py-1 border border-gray-400 rounded text-black">
          {/* You can compute this dynamically later; static for now */}
          1 Customer Waiting
        </div>

        {/* Staff profile */}
        <div className="flex items-center gap-2">
          <img src="/Staff.jpg" className="h-8 w-8 rounded-full object-cover" alt="Staff" />
          <span className="font-semibold text-black">{staff?.full_name ?? "Jake Paul"}</span>
        </div>
      </div>
    </header>
  );
}
