"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

// Helper to get current date in format "Month DD"
function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

// Centered date pill component
function DatePill({ text }) {
  return (
    <div className="flex justify-center my-2">
      <span className="text-gray-500 text-xs bg-white/70 px-3 py-1 rounded-full border">
        {text}
      </span>
    </div>
  );
}

// Main chat message list
export default function MessageList({ messages }) {
  const ref = useRef(null);

  // Auto-scroll down when new messages appear
  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div ref={ref} className="space-y-2 max-h-[60vh] overflow-y-auto px-1">
      {/* Automatically show today's date */}
      <DatePill text={getCurrentDate()} />

      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
        >
          <MessageBubble from={m.from}>{m.text}</MessageBubble>
        </div>
      ))}
    </div>
  );
}
