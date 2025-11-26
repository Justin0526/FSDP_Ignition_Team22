"use client"

import ChatBubble from "./ChatBubble.jsx";
export default function ConsultationModeOptions({onSelect}){
    return(
        <div className="mt-3">
            <ChatBubble
                sender="bot"
                text="Would you prefer an online or physical consultation?"
            />
            <div className="mt-2 flex flex-col gap-2">
                {/* Online */}
                <button 
                    key="online"
                    type="button"
                    onClick={() => onSelect("online")}
                    className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                    Online
                </button>

                {/* Physical */}
                <button 
                    key="physical"
                    type="button"
                    onClick={() => onSelect("physical")}
                    className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                    Physical
                </button>
            </div>
        </div>
    )
}