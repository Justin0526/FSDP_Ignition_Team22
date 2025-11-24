"use client";

function formatDateTime(date = new Date()){
    return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

export default function ChatDate(){
    return (
        <div className="mb-3 flex justify-center">
            <span className="text-[0.7rem] text-gray-400">
                {formatDateTime()}
            </span>
        </div>
    )
}