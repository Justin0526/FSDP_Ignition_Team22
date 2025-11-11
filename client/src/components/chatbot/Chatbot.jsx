"use client";
import { useChatFlow } from "@/hooks/useChatFlow";
import { FLOW } from "@/lib/flow";
import MessageList from "./MessageList";
import InputBar from "./InputBar";

// iOS-like container + header to mimic your mock
export default function Chatbot() {
  const { messages, input, setInput, allowInput, submit } = useChatFlow(
    FLOW,
    "askName"
  );

  return (
    <div className="w-full max-w-[1000px] mx-auto rounded-[28px] border shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
        <button className="p-1">‹</button>
        <span className="text-rose-600 text-lg font-bold">🤖 OCBC AI</span>
        <span className="ml-auto text-gray-600 text-sm">English▾</span>
      </header>

      {/* Body */}
      <div className="p-3">
        <MessageList messages={messages} dateText="November 4" />
        <InputBar
          value={input}
          onChange={setInput}
          onSubmit={submit}
          disabled={!allowInput}
        />
      </div>
    </div>
  );
}
