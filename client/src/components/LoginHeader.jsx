"use client"; 
// Marks this component to run on the client side in Next.js

export default function StaffLoginHeader() {
    return (
        // Header container (sticks to the top with light border and shadow)
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="w-full flex items-center justify-between px-8 py-3">
        
            {/* Left section: OCBC logo */}
            <div className="flex items-center">
            <img
                src="/Logo.png" alt="OCBC Logo" className="h-15 w-auto object-contain"
            />
            </div>

            {/* Right section: Text label for staff login */}
            <div className="text-black font-semibold text-lg">
            Staff Login
            </div>
        </div>
        </header>
    );
}
