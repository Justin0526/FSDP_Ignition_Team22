"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FLOW as DEFAULT_FLOW } from "./flow";
import { createCtx } from "./context";

export function useFsm(FLOW = DEFAULT_FLOW, initial = "askPhoneNum") {
  // Temporary conversation context (only persisted after confirm/submit)
  const [ctx] = useState(() => createCtx());

  const [step, setStep] = useState(initial);
  const current = useMemo(() => FLOW?.[step] ?? null, [FLOW, step]);

  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const bootedRef = useRef(false);
  const runningRef = useRef(false);

  // Push a chat message
  const push = (from, payload) => {
    if (!payload) return;
    if (from === "bot_options") {
      setMessages((m) => [...m, { from: "bot", type: "options", options: payload }]);
    } else if (from === "bot_summary") {
      setMessages((m) => [...m, { from: "bot", type: "summary", payload }]);
    } else {
      setMessages((m) => [...m, { from, text: payload }]);
    }
  };

  const textOf = (s) => (typeof s?.bot === "function" ? s.bot(ctx) : s?.bot);

  // 1) Boot: push initial bot line once
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    const s = FLOW?.[initial];
    if (!s) return;

    push("bot", textOf(s));
  }, [FLOW, initial]);

  // 2) Auto-run for steps with input: "none"
  useEffect(() => {
    const s = current;
    if (!s || s.input !== "none") return;
    if (runningRef.current) return;
    runningRef.current = true;

    (async () => {
      try {
        // allow step to print mid-process messages via push
        if (typeof s.asyncBeforeNext === "function") {
          await s.asyncBeforeNext(ctx, push);
        }

        // if step defines a static next, move to it automatically
        if (s.next) {
          setStep(s.next);
          const next = FLOW[s.next];
          setTimeout(() => push("bot", textOf(next)), 0);
        }
        // else: stay here (waiting for option click or external trigger) 
      } catch (err) {
        if (s.onError) push("bot", s.onError);
      } finally {
        runningRef.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // 3) Submit typed input on "text" steps
  async function submit(customValue) {
    const s = current;
    if (!s) return;
    if (s.input !== "text") return;

    const v = String(customValue ?? input ?? "");
    const ok = typeof s.validate === "function" ? s.validate(v) : true;
    if (!ok) {
      push("bot", s.onError || "Invalid input.");
      return;
    }

    // echo user input
    push("user", v);

    // store to ctx
    if (typeof s.onStore === "function") s.onStore(v, ctx);

    if (typeof s.asyncBeforeNext === "function") {
      try {
        await s.asyncBeforeNext(ctx, push); // pass push so step can print
      } catch (err) {
        if (s.onError) push("bot", s.onError);
        return;
      }
    }

    // next state (branch or static)
    const nextKey = typeof s.branch === "function" ? s.branch(v) : s.next;

    if (nextKey) {
      setStep(nextKey);
      setInput("");
      const next = FLOW[nextKey];
      push("bot", textOf(next));
    } else {
      setInput("");
    }
  }

  // 4) Choose an option on "none" steps that define onChoose / nextAfterChoose
  async function choose(option) {
    const s = current;
    if (!s) return;
    if (s.input !== "none" || !s.onChoose) return;

    // show selection    
    const show = option?.label ?? option?.value ?? String(option);
    push("user", show);

    // save selection
    s.onChoose(option, ctx);

    // move forward
    const nextKey = s.nextAfterChoose || s.next;
    if (nextKey) {
      setStep(nextKey);
      const next = FLOW[nextKey];
      const nextText = typeof next.bot === "function" ? next.bot(ctx) : next.bot;
      push("bot", nextText);
    }
  }

  // Helper to advance to next step programmatically (used by summary)
  function advance(nextKey) {
    if (!nextKey) return;
    setStep(nextKey);
    const next = FLOW?.[nextKey];
    if (next) push("bot", textOf(next));
  }

  // 5) Handle summary actions (confirm / cancel / edit)
  async function handleSummaryAction(action) {
    const nextKey = FLOW.summaryCard.onSummary(action);
    if (nextKey) advance(nextKey);
  }

  const allowInput = current?.input === "text";

  return {
    messages,
    input,
    setInput,
    allowInput,
    submit,
    choose,
    ctx,
    step,
    handleSummaryAction,
  };
}
