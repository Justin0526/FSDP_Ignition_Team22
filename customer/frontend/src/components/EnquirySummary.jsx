"use client";

export default function EnquirySummary({
    categoryOptions, subcategoryOptions,
    selectedCategory, selectedSubcategory, details,
    onChangeCategory, onChangeSubcategory, onChangeDetails,
    onConfirm, isSubmitting
}){
    return(
        <div className="mt-3 rounded-2xl bg-gray-100 p-3 text-xs">
            {/* Category */}
            <div className="mb-3">
                <label className="mb-1 block font-semibold text-lg text-black">Category</label>
                <select 
                    className="w-full rounded-xl border border-gray-300 bg-white px-2 py-1 text-s text-black"
                    value={selectedCategory?.category_id || ""}
                    onChange={(e) => {
                        const id= e.target.value;
                        const cat = categoryOptions.find(c => c.category_id === id);
                        onChangeCategory(cat || null);
                    }}
                >
                    <option value="">Select category</option>
                    {categoryOptions.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.display_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Subcategory */}
            <div className="mb-2">
                <label className="mb-1 block font-semibold text-lg text-black">Subcategory</label>
                <select
                    className="w-full rounded-xl border border-gray-300 bg-white px-2 py-1 text-s text-black"
                    value={selectedSubcategory?.category_id || ""}
                    onChange={(e) => {
                        const id = e.target.value;
                        const sub = subcategoryOptions.find(s => s.category_id === id);
                        onChangeSubcategory(sub || null);
                    }}
                >
                    <option value="">Select subcategory</option>
                    {subcategoryOptions.map(sub => (
                        <option key={sub.category_id} value={sub.category_id}>
                            {sub.display_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Details - optional but useful */}
            <div className="mb-3">
                <label className="mb-1 block font-semibold text-lg text-black">Details</label>
                <textarea
                   rows={3}
                   className="w-full rounded-xl border border-gray-300 bg-white px-2 py-1 text-s text-black"
                   placeholder="You can describe your issue here."
                   value={details}
                   onChange={(e) => onChangeDetails(e.target.value)}
                />
            </div>

            <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting || !selectedCategory}
                className="mt-1 w-full rounded-2xl bg-red-400 py-2 text-center text-xs font-semibold text-white disabled:opacity-60"
            >
                {isSubmitting ? "Submitting...": "Confirm"}
            </button>
        </div>
    )
}