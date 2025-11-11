import MicInput from "./MicInput";

export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled,
  waitingText = "Waiting for Digitoken approval…",
}) {
  if (disabled) {
    return (
      <div className="mt-3 text-gray-500 text-center text-sm">
        {waitingText}
      </div>
    );
  }

  // Handle speech recognition result: update input value
  function handleSpeechResult(transcript) {
    onChange(transcript);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Prevent submitting if the input is empty or whitespace
        if (!value.trim()) return;
        onSubmit();
      }}
      className="mt-3 flex items-center gap-2"
    >
      <button
        type="button"
        className="p-2 rounded-full border bg-white"
        title="Attach"
      >
        📎
      </button>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border rounded-full px-3 py-2 bg-white text-black"
        placeholder="Type here…"
      />
      {/* Mic button for speech-to-text */}
      <MicInput onResult={handleSpeechResult} />
      <button
        type="submit"
        className="rounded-full px-4 py-2 bg-rose-500 text-white"
        title="Send"
      >
        ➤
      </button>
    </form>
  );
}
