"use client";

import ChatBubble from "./ChatBubble.jsx";

export default function CategoryButtons({categories, onSelect, showTitle = true}){
    if(!categories || categories.length === 0){
        return (
            <div className="mt-2 text-xs text-black">
                Loading categories...
            </div>
        );
    }

    return (
        <div className="mt-3">
            {showTitle && (
                    <ChatBubble 
                    sender="bot"
                    text="Please select the category of enquiry below:"
                />
            )}
            
            <div className="mt-2 flex flex-col gap-2">
                {categories.map((cat) => (
                    <button 
                        key={cat.category_id}
                        type="button"
                        onClick={() => onSelect(cat)}
                        className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                    >
                        {cat.display_name}
                    </button>
                ))}
            </div>
        </div>
    );
}

