// src/app/chat/page.jsx
'use client';
import React, { useState } from 'react';
import ChatComposer from '@/components/ChatComposer';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);

  const handleSend = async ({ text, attachments }) => {
    const msg = { id: crypto.randomUUID(), role: 'user', text, attachments, ts: Date.now() };
    setMessages(prev => [...prev, msg]);
    // TODO: send to backend AI API or Supabase table if needed
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[75%] p-3 rounded-xl ${m.role === 'user' ? 'ml-auto bg-rose-100' : 'bg-white border'}`}>
            <p className="whitespace-pre-wrap">{m.text}</p>
            {m.attachments?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.attachments.map((a, i) => (
                  <a key={i} href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border rounded-xl px-2 py-1 text-sm hover:bg-gray-50">
                    📎 <span>{a.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-white">
        <ChatComposer onSendMessage={handleSend} showDesktopKeyboard />
      </div>
    </div>
  );
}
