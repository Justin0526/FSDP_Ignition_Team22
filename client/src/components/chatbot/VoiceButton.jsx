"use client";
import { useState, useEffect } from "react";
import { Volume2, Loader2 } from "lucide-react";

export default function VoiceButton({ text }) {
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        // Cleanup: stop speech if component unmounts
        return () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        };
    }, []);

    const handleSpeak = () => {
        if (!window.speechSynthesis) {
        alert("Speech Synthesis not supported in this browser");
        return;
        }

        // Stop any ongoing speech before starting new one
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-SG";
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => setSpeaking(false);
        utter.onerror = () => setSpeaking(false);
        
        window.speechSynthesis.speak(utter);
    };

    return (
        <button
        onClick={handleSpeak}
        className="ml-2 p-1 rounded hover:bg-gray-200 transition"
        title="Read aloud"
        >
        {speaking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
        </button>
    );
}
