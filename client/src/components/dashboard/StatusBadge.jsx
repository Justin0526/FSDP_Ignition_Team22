// client/src/components/dashboard/StatusBadge.jsx
export default function StatusBadge({ status }) {
  if (!status) return null;

  const s = status.toLowerCase().trim();

  let bg = "bg-gray-200";
  let text = "text-gray-800";
  let label = status; // default

  if (s === "submitted") {
    bg = "bg-blue-100";
    text = "text-blue-800";
    label = "Submitted";
  } else if (s === "in queue") {
    bg = "bg-yellow-100";
    text = "text-yellow-800";
    label = "In Queue";
  } else if (s === "in progress") {
    bg = "bg-green-100";
    text = "text-green-800";
    label = "In Progress";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
