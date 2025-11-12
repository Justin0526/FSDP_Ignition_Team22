import { IconSpeaker } from "./Icon";
import VoiceButton from "./VoiceButton";
import BranchQRCode from "./BranchQRCode";


// No ml-auto here; alignment is handled by the flex wrapper in MessageList
export default function MessageBubble({ from, children, qrvalue }) {
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
  // Determiniong if the message has non-empty text
  const hasText = !!(children && children.trim());

  return (
    <div className={cls}>
      <span className="leading-snug">{children}</span>
      {/* Show VoiceButton only for bot messages that have non-empty text */}
      {isBot && hasText && <VoiceButton text={children} />}
      {/* QR code: ONLY when bot and qrvalue exists */}
      {isBot && qrvalue && (
        <div className="mt-2">
          <BranchQRCode value={qrvalue} />
        </div>
      )}
    </div>
  );
}
