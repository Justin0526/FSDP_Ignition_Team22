"use client"; 
// This tells Next.js that this component should run on the client side

import { useEffect, useState } from "react";
import Stopwatch from "@/components/dashboard/Stopwatch";

export default function DashboardHeader({activeCustomerId}){
    // Local state to hold staff info and loading state
    const [staff, setStaff] = useState(null); // stores staff data
    const [loading, setLoading] = useState(true); // reacks loading status

    // Fetch staff info from backend when page loads
    useEffect(() =>{
        async function loadStaff(){
            try{
                // Call backend API route to get staff data
                const res = await fetch("/api/staff");
                const json = await res.json();

                // If the API returns an error, throw it
                if (!json.ok) throw new Error(json.error || "Failed to fetch staff data");

                // Save staff object into state
                setStaff(json.data);
            }catch(err){
                // Log any errors to console for debugging 
                console.error("Error loading staff:", err);
            }finally{
                setLoading(false);
            }
        }

        loadStaff(); // run the function once when component mounts
    }, []); // emmpty dependency -> only runs once on mount
    return(
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="w-full flex items-center justify-between px-8 py-3">
                {/* Left: OCBC Logo */}
                <div className="flex item-center">
                    <img src="/Logo.png" alt="OCBC Logo" className="h-15 w-auto object-contain" />
                </div>

                {/* Right: Queue info, timer, and profile */}
                <div className="flex items-center space-x-5">
                    {/* Queue badge */}
                    <div className="px-3 py-1 border border-gray-400 rounded text-black font-medium">
                        5 Customers Waiting
                    </div>

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
                        {/* stopwatch resets when activeCustomerId changes */}
                        <Stopwatch key={activeCustomerId} />
                    </div>

                    {/* Profile section */}
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
    )
}