// Slim iOS-like footer bar
export default function InputBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSubmit(); // only submit if enabled
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
        className="flex-1 border rounded-full px-3 py-2 bg-white text-black disabled:opacity-50"
        placeholder="Type here…"
        disabled={disabled}
      />

      <button
        type="button"
        className="p-2 rounded-full border bg-white"
        title="Voice"
        disabled={disabled}
      >
        🎤
      </button>

      <button
        type="submit"
        className={`rounded-full px-4 py-2 text-white ${
          disabled ? "bg-gray-300 cursor-not-allowed" : "bg-rose-500"
        }`}
        title="Send"
        disabled={disabled}
      >
        ➤
      </button>
    </form>
  );
}
