"use client"

import ChatBubble from "./ChatBubble.jsx";

export default function PostSubmissionOptions({onSelect}){
    return(
        <div className="mt-3">
            <ChatBubble
                sender="bot"
                text="Please choose one of the following options."
            />
            <div className="mt-2 flex flex-col gap-2">
                {/* Enquiry History */}
                <button 
                    key="enquiry_history"
                    type="button"
                    onClick={() => onSelect("enquiry_history")}
                    className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                    Enquiry History
                </button>

                {/* Self Service */}
                <button
                    key="self_service"
                    type="button"
                    onClick={() => onSelect("self_service")}
                    className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                    Self-Service
                </button>

                {/* Consultation */}
                <button
                    key="consultation"
                    type="button"
                    onClick={() => onSelect("consultation")}
                    className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                >
                    Consultation
                </button>
            </div>
        </div>
    )
}