"use client";

// header with OCBC branding + language dropdown
export default function ChatHeader({ sessionId, language, onLanguageChange }){
    return(
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            {/* Left: logo + title */}
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
                    🤖
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-red-600">OCBC</span>
                    <span className="text-[0.65rem] text-black">
                        Virtual Assitant
                    </span>
                </div>
            </div>

            {/* Right: Language selector */}
            <div className="flex flex-col items-end gap-1">
                <select 
                    className="rounded-md border bg-white px-2 py-1 text-[0.7rem] text-black"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                >
                    <option value="EN">English</option>
                    <option value="ZH">华语</option>
                    <option value="MS">Bahasa</option>
                    <option value="TA">தமிழ்</option>
                </select>
            </div>
        </div>
    )
}