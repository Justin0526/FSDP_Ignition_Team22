"use client";

import { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble.jsx";
import { getJson } from "@/lib/apiClient.js";

// Self-service panel shown after user selects Self service
export default function SelfServicePanel({
    categoryId, subcategoryId,
    onSelectFeedback, onSelectHuman, onSelectEnquire
}){
    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [primary, setPrimary] = useState(null);
    const [related, setRelated] = useState([]); 

    const [selectedItem, setSelectedItem] = useState(null);
    const [solveStatus, setSolveStatus] = useState(null);

    // Fetch recommendations from backend
    useEffect(() => {
        if(!categoryId || !subcategoryId){
            setError("Missing category or subcategory for self-service.");
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);

            try{
                const path = `/api/selfService/recommendations?categoryId=${encodeURIComponent(categoryId)}&subcategoryId=${encodeURIComponent(subcategoryId)}`;

                const data = await getJson(path);

                setPrimary(data.primary || null);
                setRelated(Array.isArray(data.related) ? data.related : []);
            } catch (err) {
                console.error("[SelfServicePanel] fetch error:", err);
                setError("We're unable to load self-service options right now. Please try again or ask the chatbot directly");
            } finally{
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [categoryId, subcategoryId]);

    // When user clicks a self-service option
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setSolveStatus(null);
    }

    // get the steps from the selected items
    const getStepsForItem = (item) => {
        if (!item || !item.steps) return [];
        
        if (Array.isArray(item.steps)){
            // Sort by order
            return [...item.steps].sort((a,b) => (a.order || 0) - (b.order || 0));
        }

        return[];
    }

    if (loading){
        return(
            <ChatBubble
                sender="bot"
                text="Loading self-service options for your enquiry..."
            />
        );
    }

    if (error){
        return <ChatBubble sender="bot" text={error} />;
    }

    if(!primary && (!related || related.length ===0)){
        return (
            <ChatBubble
                sender="bot"
                text="I couldn't find any self-service guides for this enquiry type. You can continue chatting with me for help"
            />
        );
    }

    return(
        <>
            {/* Best match */}
            <ChatBubble 
                sender="bot"
                text="Best match"
            />

            {/* Best match button */}
            {primary && (
                <div className="mt-2 flex flex-col gap-2 mb-2">
                    <button 
                        key={primary.self_service_id}
                        type="button"
                        onClick={()=> handleSelectItem(primary)}
                        className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                        >
                            {primary.title}
                    </button>
                </div>
            )}

            {/* Related service label + button */}
            {related && related.length > 0 && (
                <>
                     <ChatBubble
                        sender="bot"
                        text="Other related services"
                    />

                    <div className="mt-2 flex flex-col gap-2 mb-2">
                        {related.map((service) => (
                            <button
                                key={service.self_service_id}
                                type="button"
                                onClick={() => handleSelectItem(service)}
                                className="w-full rounded-2xl border border-red-500 py-2 text-xs font-medium text-red-600 hover:bg-red-200"
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                </> 
            )}

            {/* Show what the user select */}
                        {/* Show what the user selected + details */}
            {selectedItem && (
                <>
                    {/* Bot confirms which guide was selected */}
                    <ChatBubble
                        sender="bot"
                        text={`You selected: ${selectedItem.title}`}
                    />

                    <div className="mt-3 flex flex-col gap-3">
                        {/* Instructions + video */}
                        <div className="rounded-2xl bg-gray-200 px-3 py-2 text-xs text-black">
                            {getStepsForItem(selectedItem).length > 0 && (
                                <ol className="list-decimal space-y-1 pl-4">
                                    {getStepsForItem(selectedItem).map((step) => (
                                        <li key={step.order}>{step.text}</li>
                                    ))}
                                </ol>
                            )}

                            {/* Inline video player */}
                            <div className="mt-3 w-full rounded-2xl overflow-hidden">
                                <iframe
                                    className="w-full h-48 rounded-2xl"
                                    src={
                                        selectedItem.video_url ||
                                        "https://www.youtube.com/embed/lrQVtB8X3KQ"
                                    }
                                    title="How-to video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Solve issue card */}
                        <div className="rounded-2xl bg-gray-200 px-3 py-2 text-xs text-black flex items-center justify-between">
                            <span>Did this help solve your issue?</span>

                            <div className="flex gap-2">
                                {/* No button  */}
                                <button 
                                    type="button"
                                    onClick={() => {
                                        console.log("clicked no");
                                        setSolveStatus("no");
                                    }}
                                    className="rounded-full bg-red-600 px-4 py-1 text-xs font-medium text-white hover:bg-red-700"
                                >
                                    No
                                </button>

                                {/* Yes button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        console.log("clicked yes");
                                        setSolveStatus("yes");
                                    }}
                                    className="rounded-full bg-red-200 px-4 py-1 text-xs font-medium text-red-700 hover:bg-red-300"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>

                        {solveStatus === "yes" && (
                            <>
                                <ChatBubble
                                sender="bot"
                                text="Thank you! You can tap here to end the session and give feedback, or choose to speak with a human officer instead."
                                />

                                {/* Options */}
                                <div className="mt-2 flex flex-col gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => onSelectFeedback && onSelectFeedback()}
                                        className="w-full rounded-2xl border border-red-500 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                                    >
                                        End session
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onSelectHuman && onSelectHuman()}
                                        className="w-full rounded-2xl border border-red-500 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                                    >
                                        Consult a human service officer
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => onSelectEnquire && onSelectEnquire()}
                                        className="w-full rounded-2xl border border-red-500 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200"
                                    >
                                        Make a new enquiry
                                    </button>
                                </div> 
                            </>
                        )}

                        {solveStatus === "no" && (
                            <ChatBubble
                                sender="bot"
                                text="Okay, you can try other self-service options above or continue chatting with me for more help."
                            />
                        )}
                    </div>
                </>
            )}

       
        </>
    )
}