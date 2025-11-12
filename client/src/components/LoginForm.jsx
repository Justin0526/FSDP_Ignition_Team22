"use client";

export default function LoginForm() {
    return (
        <div className="w-80 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Welcome to OCBC Banking
        </h2>

        <form className="space-y-4">
            {/* Staff ID field */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff ID
            </label>
            <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            </div>

            {/* Pin field */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin
            </label>
            <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            </div>

            {/* Login button */}
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition">
            Login
            </button>
        </form>
        </div>
    );
}
