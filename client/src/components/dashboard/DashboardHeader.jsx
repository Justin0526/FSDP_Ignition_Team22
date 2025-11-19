"use client";

import { useEffect, useState } from "react";
import Stopwatch from "@/components/dashboard/Stopwatch";
import Link from "next/link";

export default function DashboardHeader({ activeCustomerId }) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        // Get staff from localStorage, parse, then get id
        const staffData = localStorage.getItem("staff");
        if (!staffData) throw new Error("No staff data in storage");
        const staffObj = JSON.parse(staffData);
        const staffId = staffObj.staff_id;

        if (!staffId) throw new Error("No staff ID found");

        const res = await fetch(`/api/staff?id=${staffId}`, { cache: "no-store" });
        const json = await res.json();

        if (!json.ok) throw new Error(json.error || "Failed to fetch staff data");
        setStaff(json.data);
      } catch (err) {
        console.error("Error loading staff:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStaff();
  }, []);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-8 py-3">
        {/* Left: OCBC Logo */}
        <div className="flex items-center">
          <img
            src="/Logo.png"
            alt="OCBC Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Right: Queue info, timer, and profile */}
        <div className="flex items-center space-x-5">
          {/* Queue badge → clickable */}
          <Link
            href="/dashboard/enquiry-queue"  // 👈 make this absolute
            className="px-3 py-1 border border-gray-400 rounded text-black font-medium hover:bg-gray-100 transition"
            title="View enquiry queue"
          >
            0 Customers Waiting
          </Link>

          {/* Timer */}
          <div className="flex items-center px-3 py-1 border border-gray-400 rounded text-black font-medium">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <Stopwatch key={activeCustomerId} />
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <img
              src="/Staff.jpg"
              alt="Staff"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-semibold text-black">
              {loading ? "Loading..." : staff?.full_name || "Unknown Staff"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
