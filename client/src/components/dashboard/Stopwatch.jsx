"use client";
import { useEffect, useState } from "react";

export default function Stopwatch({ tickMs = 1000 }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - start), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  const totalSec = Math.floor(elapsedMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return <span className="tabular-nums">{mm}.{ss}</span>;
}
