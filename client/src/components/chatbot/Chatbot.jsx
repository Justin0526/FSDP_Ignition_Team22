"use client";
import { useFsm } from "../../chatbot/useFsm";  // hook path/name
import { FLOW } from "../../chatbot/flow";      //flow path
import MessageList from "./MessageList";
import InputBar from "./InputBar";

export default function Chatbot() {
  const { messages, input, setInput, allowInput, submit, choose, handleSummaryAction } = useFsm(FLOW, "askPhoneNum");

  return (
    <div className="w-full max-w-[1000px] mx-auto rounded-[28px] border shadow-sm bg-white overflow-hidden">
      <header className="flex items-center gap-2 px-3 py-2 border-b bg-white">
        <button className="p-1">‹</button>
        <span className="text-rose-600 text-lg font-bold">🤖 OCBC AI</span>
        <span className="ml-auto text-gray-600 text-sm">English▾</span>
      </header>

      <div className="p-3">
        <MessageList messages={messages} onChoose={choose} onSummaryAction={handleSummaryAction} />
        <InputBar
          value={input}
          onChange={setInput}
          onSubmit={submit}
          disabled={!allowInput}
          waitingText="Waiting for Digitoken approval…"
        />
      </div>
    </div>
  );
}
