import { IconSpeaker } from "./Icon";
import VoiceButton from "./VoiceButton";

// No ml-auto here; alignment is handled by the flex wrapper in MessageList
export default function MessageBubble({ from, children }) {
  const isBot = from === "bot";
  const base = "max-w-[82%] px-3 py-2 rounded-2xl inline-flex items-start gap-2";
  const cls = isBot
    ? `${base} bg-gray-100 text-gray-900`   // bot = left, grey
    : `${base} bg-rose-200 text-gray-900`;  // user = right, pink

  const icon = (
    <span className="mt-0.5 opacity-70">
      <IconSpeaker />
    </span>
  );

  return (
    <div className={cls}>
      {/* customer icon on left of pink bubble, bot icon on right of grey bubble (like your mock) */}
      {!isBot && <VoiceButton text={children} />}
      <span className="leading-snug">{children}</span>
      {isBot && <VoiceButton text={children} />}
    </div>
  );
}
