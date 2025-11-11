"use client";
import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

export default function MicInput({ onResult }) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null); // ✅ Use useRef to persist across renders

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
        alert("Speech Recognition not supported in this browser");
        return;
        }
        
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-SG";

        recognitionRef.current.onstart = () => setListening(true);
        recognitionRef.current.onend = () => setListening(false);
        recognitionRef.current.onerror = () => setListening(false);

        recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        onResult(result);
        };

        recognitionRef.current.start();
    };

    return (
        <button
        onClick={startListening}
        className={`p-2 rounded-full ${listening ? "bg-red-500" : "bg-gray-200"} text-white`}
        title="Speak"
        >
        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gray-700" />}
        </button>
    );
}
