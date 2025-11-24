"use client";
export default function ChatBubble({sender, text}){
    const isBot = sender === "bot";
    return(
        <div className={`mb-2 flex ${isBot ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xs rounded-2xl px-3 py-2 text-sm leading snug text-black ${isBot ? "bg-gray-300 whitespace-pre-line" : "bg-red-300"}`}>
                {text}
            </div>
        </div>
    );
}