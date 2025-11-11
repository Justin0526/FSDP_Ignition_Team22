// Slim iOS-like footer bar; shows waiting text during async steps.
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
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
      <button
        type="button"
        className="p-2 rounded-full border bg-white"
        title="Voice"
      >
        🎤
      </button>
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
