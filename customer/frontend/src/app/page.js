"use client";

import { useEffect, useState } from "react";
import { getJson, postJson, setApiSessionId } from "../lib/apiClient.js";

import ChatHeader from "../components/ChatHeader.jsx";
import DateTime from "../components/DateTime.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import CategoryButtons from "@/components/CategoryButtons.jsx";
import InputBar from "@/components/InputBar.jsx";
import EnquirySummary from "@/components/EnquirySummary.jsx";

import * as validator from "../utils/validators.js";

// Loading string to change state
const STEP_WAITING = "waiting"
const STEP_LOADING = "loading";
const STEP_PHONE = "phone";
const STEP_NRIC = "nric";
const STEP_OTP = "otp";
const STEP_CATEGORIES = "categories";
const STEP_SUBCATEGORIES = "subcategories";
const STEP_SUMMARY = "summary";

export default function HomePage(){
    const [sessionId, setSessionId] = useState(null);
    const [step, setStep ] = useState(STEP_LOADING);
    const [isVerified, setIsVerified] = useState(false);

    // Chat messages to display in order
    const [messages, setMessages] = useState([]);

    // Single text value for the bottom input bar
    const [inputValue, setInputValue] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const [summaryDetails, setSummaryDetails] = useState("");

    const[language, setLanguage] = useState("EN");

    // Start a new backend session when the component mounts
    useEffect(() => {
        async function initSession(){
            try{
                setError("");
                const data = await postJson("/api/session/start", {});
                setSessionId(data.session.session_id);
                setApiSessionId(data.session.session_id)

                // 1. bot ask for phone
                setMessages([
                    {
                        id: 1,
                        sender: "bot",
                        text: "Hello, please enter your phone number.",
                    },
                ]);
                setStep(STEP_PHONE);
            }catch(err){
                console.error(err);
                setError(err.message || "Failed to start session.");
            }
        }
        
        initSession();
    }, [])

    // Helper to append a message to the chat
    function addMessage(sender, text){
      setMessages((prev) => [
          ...prev,
          {id: prev.length + 1, sender, text},
      ]);
    }

    // Helper to get category via category name
    async function getCategoryByCategoryId(categoryId){
        const data = await getJson(`/api/categories/${categoryId}`)
        return data;
    }

    // Handle category selection
    async function handleSelectCategory(category){
      addMessage("user", category.display_name);
      setSelectedCategory(category);

      addMessage(
          "bot",
          `You selected "${category.display_name}. Please select the subcategories`
      )

      setStep(STEP_SUBCATEGORIES);

      const data = await getJson(`/api/categories/${category.category_id}/subcategories`);

      setSubcategories(data.subcategories || []);
    }

    // Handle subcategory selection
    function handleSelectSubcategory(sub){
        addMessage("user", sub.display_name);
        setSelectedSubcategory(sub);

        addMessage(
            "bot",
            `Thanks! Here is a quick summary of your enquiry`
        )

        setSummaryDetails("");

        setStep(STEP_SUMMARY);
    }

    async function handleConfirmEnquiry(){
        if(!selectedCategory){
            setError("Please select a category.");
            return;
        }

        try{
            setIsSubmitting(true);
            setError("");
            
            const data = await postJson("/api/enquiries", {
                categoryId: selectedCategory.category_id,
                subcategoryId: selectedSubcategory.category_id,
                details: summaryDetails,
            })

            addMessage(
                "bot",
                "Thank you. Your enquiry has been submitted successfully."
            );

            const category = await getCategoryByCategoryId(data.enquiry.category_id);
            const subcategory = await getCategoryByCategoryId(data.enquiry.subcategory_id);

            addMessage(
                "bot",
                `Here's what you submitted.\nCategory: ${category.category.display_name}\nSubcategory: ${subcategory.category.display_name}\nDetails:${data?.enquiry?.description || "none"}`
            )
        }catch(err){
            console.error(err);
            setError(err.message || "Failed to submit enquiry.");
        }finally{
            setIsSubmitting(false);
            setStep(STEP_WAITING);
        }
    }

    // Share send handler for the Input Bar
    // Behaviour depends on the step
    async function handleSend(){
        const trimmed = inputValue.trim();
        if(!trimmed || !sessionId) return;

        setIsSubmitting(true);
        setError("");

        try{
            if (!isVerified){
                if(step === STEP_PHONE){
                    // Validate phone
                    const err = validator.validatePhone(trimmed);
                    if(err){
                        setError(err);
                        return;
                    }

                    addMessage("user", trimmed);

                    await postJson("/api/session/phone", {
                        mobileNumber: trimmed,
                    });

                    addMessage("bot", "Please enter the last 4 digits of your NRIC: ");
                    setStep(STEP_NRIC);
                    }

                else if (step === STEP_NRIC){
                    const err = validator.validateNric(trimmed);
                    if(err){
                        setError(err);
                        return;
                    }

                    addMessage("user", trimmed);

                    const data = await postJson("/api/session/nric", {
                        nricLast4: trimmed,
                    });

                    console.log("Demo OTP:", data.otp);

                    addMessage(
                        "bot",
                        "Please approve access of your details using the OTP."
                    );
                    addMessage(
                        "bot",
                        "Enter the 6-digit OTP (Valid for only 5 minutes): "
                    )
                    setStep(STEP_OTP);
                }   

                else if (step === STEP_OTP){
                    const err = validator.validateOtp(trimmed);
                    if(err){
                        setError(err);
                        return;
                    }

                    addMessage("user", trimmed);

                    await postJson("/api/session/otp", {
                        otp: trimmed,
                    });

                    setIsVerified(true);

                    addMessage("bot", "Approved successful.");
                    addMessage("bot", "Welcome back! Please select the category below.");

                    setStep(STEP_CATEGORIES);

                    const catData = await getJson("/api/categories");
                    setCategories(catData.categories || []);
                }
            }else{
                addMessage("user", trimmed);

                const data = await postJson("/api/chat", {
                    message: trimmed,
                });

                addMessage("bot", data.reply);
            }

        }catch(err){
            console.error(err);
            setError(err.message || "Something went wrong.");
        }finally{
            setIsSubmitting(false);
            setInputValue("");
        }
    }
    return(
        <main className="flex min-h-screen items-center justify-center bg-gray-200">
            <div className="flex w-full max-w-sm h-[90vh] sm:h-[80vh] flex-col overflow-hidden rounded-3xl bg-white shadow-lg">
                <ChatHeader sessionId={sessionId} language={language} onLanguageChange={setLanguage}/>
                {/* Chat area */}
                <section className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3">
                    {/* Date and time*/}
                    <DateTime/>

                    {messages.map((message) => (
                        <ChatBubble 
                            key={message.id}
                            sender={message.sender}
                            text={message.text}
                        />
                    ))}

                    {step === STEP_LOADING && (
                        <p className="text-xs text-black-500">Starting session...</p>
                    )}

                    {error && (
                        <p className="mt-2 text-xs text-red-500">Error: {error}</p>
                    )}

                    {step === STEP_CATEGORIES && (
                        <CategoryButtons 
                            categories={categories}
                            onSelect={handleSelectCategory}
                        />
                    )}

                    {step === STEP_SUBCATEGORIES && (
                        <CategoryButtons
                            categories={subcategories}
                            onSelect={handleSelectSubcategory}
                            showTitle={false}
                        />
                    )}

                    {/* Submit */}
                    {step === STEP_SUMMARY && (
                        <EnquirySummary 
                            categoryOptions={categories} subcategoryOptions={subcategories}
                            selectedCategory={selectedCategory} selectedSubcategory={selectedSubcategory} details={summaryDetails}
                            onChangeCategory={setSelectedCategory} onChangeSubcategory={setSelectedSubcategory} onChangeDetails={setSummaryDetails}
                            onConfirm={handleConfirmEnquiry} isSubmitting={isSubmitting}
                        />
                            
                    )}
                </section>

                {/* Input bar */}
                <InputBar
                    step={step}
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    disabled={isSubmitting || step === STEP_LOADING}
                />
            </div>
        </main>
    );
}
