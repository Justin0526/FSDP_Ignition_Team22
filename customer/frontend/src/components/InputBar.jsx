"use client";

export default function InputBar({
    step, value, onChange, onSend, disabled,
}){
    function handleSubmit(event){
        event.preventDefault();
        if(!disabled && onSend){
            onSend();
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
            {/* Attachment button */}
            <button 
                type="button"
                aria-label="Attach file"
                className="flex h-8 w-8 items-center justify-center text-lg text-black"
                onClick={() => {
                    // placeholder, no functionality yet
                }}
            >
                📎
            </button>

            {/* Text input */}
            <input 
                type={step === "phone" ? "tel" : "text"}
                className="flex-1 rounded-full border bg-gray-50 px-3 py-2 text-xs text-black"
                placeholder="Type your message here..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />

            {/* Talk button (no logic for now) */}
            <button 
                type="button"
                aria-label="Talk to chatbot"
                className="flex h-8 w-8 items-center justify-center text-lg text-black"
                onClick={() => {
                    // placeholder, no functionality yet
                }}
            >
                🎤
            </button>

            {/* Send button */}
            <button 
                type="submit"
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg text-white disabled:opacity-60"
                disabled={disabled}
            >
                ➤
            </button>
        </form>
    );
}