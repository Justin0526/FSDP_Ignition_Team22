"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import SummaryCard from "./SummaryCard";
import VoiceButton from "./VoiceButton";
import VideoCard from "./VideoCard";

function getCurrentDate() {
    return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
function DatePill({ text }) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-black text-xs bg-white/70 px-3 py-1 rounded-full border">{text}</span>
      </div>
    );
}

// Buttons block
function Options({ options = [], onChoose }) {
    return (
      <div className="flex flex-col gap-2 w-full max-w-[82%]">
        {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-0">
            <button
              key={i}
              onClick={() => onChoose(opt)} // pass whole option (id + label)
              className="
                w-full text-left border border-[#EF0E0E] rounded-xl px-3 py-2 
                bg-white text-black 
                hover:bg-rose-500 hover:text-white 
                transition-colors duration-200
              "
              title={opt.desc || opt.label}
            >
              {opt.label}
            </button>
          <VoiceButton text={opt.label} color="black" />
        </div>
        ))}
      </div>
    );
}

function SelfServiceCard({ option, prompt, question }) {
    if (!option) return null;

    return (
      <div className="flex justify-start">
        <div className="max-w-[82%] bg-white border rounded-xl p-3 shadow-sm">
          <p className="text-sm font-semibold mb-1">{option.title}</p>
          <p className="text-xs text-gray-600 mb-2">{prompt}</p>

          <VideoCard
            videoUrl={option.video_url}
            thumbnailUrl={option.thumbnailUrl}
          />

          {question && (
            <p className="text-xs text-gray-700 mt-3">{question}</p>
          )}

          {/* You can later add Yes/No buttons here */}
          {/* <div className="flex gap-2 mt-2">
            <button ...>No</button>
            <button ...>Yes</button>
          </div> */}
        </div>
      </div>
    );
}

// Main chat message list
export default function MessageList({ messages = [], onChoose, onSummaryAction }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div ref={ref} className="space-y-2 max-h-[60vh] overflow-y-auto px-1">
      <DatePill text={getCurrentDate()} />

      {messages.map((m, i) => {
        if (m.type === "options") {
          return (
            <div key={i} className="flex justify-start">
              <Options options={m.options} onChoose={onChoose} />
            </div>
          );
        }
        else if (m.type === "summary"){
          return (
            <div key={i} className="flex justify-start">
              <SummaryCard
                payload={m.payload}
                onAction={(action) => onSummaryAction?.(action)}
                loading={m.loading}
              />
            </div>
          );
        } else if (m.type === "self_service") {
          return (
            <SelfServiceCard
              key={i}
              option={m.option}
              prompt={m.prompt}
              question={m.question}
            />
          );
        }

        // default chat bubble
        return (
          <div
            key={i}
            className={`flex ${
              m.from === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <MessageBubble from={m.from} qrvalue={m.qrvalue}>{m.text}</MessageBubble>
          </div>
        );
      })}
    </div>
  );
}
