"use client";
import { useEffect, useState, useRef } from "react";

// Manages the FSM + messages. Ensures we push EXACTLY ONE bot message per step.
export function useChatFlow(flowDef, start = "askName") {
  const [step, setStep] = useState(start);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const allowInput = flowDef[step]?.input !== "none";

  // push bot message for a step (once)
  function pushBot(stepKey) {
    const node = flowDef[stepKey];
    if (!node) return;
    setMessages((m) => [...m, { from: "bot", text: node.bot }]);
  }

  // INIT: push first bot prompt
  useEffect(() => {
    pushBot(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle steps that don’t accept input (async gate like Digitoken)
  useEffect(() => {
    const node = flowDef[step];
    if (!node || node.input !== "none") return;

    // IMPORTANT: do NOT push the bot text here (already done by goNext/pushBot)
    (async () => {
      if (node.asyncBeforeNext) {
        try {
          const res = await node.asyncBeforeNext();
          if (res?.approved) {
            goNext(node);
          } else {
            // error → show error + re-ask THIS step
            setMessages((m) => [
              ...m,
              { from: "bot", text: node.onError },
              { from: "bot", text: node.bot },
            ]);
          }
        } catch {
          setMessages((m) => [
            ...m,
            { from: "bot", text: node.onError },
            { from: "bot", text: node.bot },
          ]);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function goNext(node) {
    const nextKey = node.next;
    if (!nextKey) return;
    setStep(nextKey);
    setInput("");
    // push exactly one bot message for the next step
    pushBot(nextKey);
  }

  function submit() {
    const node = flowDef[step];
    const raw = input.trim();

    // show user's raw reply
    setMessages((m) => [...m, { from: "user", text: raw || "(empty)" }]);

    // validate
    if (!node.validate(raw)) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: node.onError },
        { from: "bot", text: node.bot },
      ]);
      setInput("");
      return;
    }

    // replace last user bubble with masked version (if any)
    const processed = node.postProcess ? node.postProcess(raw) : raw;
    setMessages((m) => {
      const cp = [...m];
      cp[cp.length - 1] = { from: "user", text: processed };
      return cp;
    });

    // advance
    goNext(node);
  }

  return { step, messages, input, setInput, allowInput, submit };
}
