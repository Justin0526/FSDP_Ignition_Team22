// ReviewCard.jsx
export default function ReviewCard({ data, onConfirm, onEdit, onCancel }) {
  const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-gray-900">{value ?? "—"}</span>
    </div>
  );

  return (
    <div className="max-w-[82%] bg-gray-100 text-black rounded-2xl p-4 shadow border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Review your details</span>
        <button
          className="text-xs px-2 py-1 rounded bg-white border hover:bg-gray-50"
          onClick={onEdit}
          title="Edit"
        >
          ✎ Edit
        </button>
      </div>

      {/* All values come directly from context */}
      <div className="space-y-2 text-sm">
        <Row label="Name" value={data.name} />
        <Row label="Card Number" value={data.accountMasked} />   {/* ⟵ changed */}
        <Row label="Category" value={data.categoryName} />
        <Row label="Subcategory" value={data.subcategoryName} />
        <Row label="Details provided" value={data.details} />
        <Row label="Attachment" value={data.attachmentName} />
      </div>

      <div className="mt-4 space-y-2">
        <button
          className="w-full rounded-lg py-2 bg-rose-300 text-black hover:bg-rose-400"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          className="w-full rounded-lg py-2 bg-red-700 text-white hover:bg-red-800"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
