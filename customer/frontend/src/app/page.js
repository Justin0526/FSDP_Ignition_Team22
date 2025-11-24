"use client";

import { useEffect, useState } from "react";
import { getJson, postJson, setApiSessionId } from "../lib/apiClient.js";

import ChatHeader from "../components/ChatHeader.jsx";
import DateTime from "../components/DateTime.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import CategoryButtons from "@/components/CategoryButtons.jsx";
import InputBar from "@/components/InputBar.jsx";

import * as validator from "../utils/validators.js";

// Loading string to change state
const STEP_LOADING = "loading";
const STEP_PHONE = "phone";
const STEP_NRIC = "nric";
const STEP_OTP = "otp";
const STEP_CATEGORIES = "categories";

export default function HomePage(){
    const [sessionId, setSessionId] = useState(null);
    const [step, setStep ] = useState(STEP_LOADING);

    // Chat messages to display in order
    const [messages, setMessages] = useState([]);

    // Single text value for the bottom input bar
    const [inputValue, setInputValue] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState([]);
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

    // Handle category selection
    function handleSelectCategory(category){
      addMessage("user", category.display_name);
      addMessage(
          "bot",
          `You selected "${category.display_name}. Please select the subcategories`
      )
    }

    // Share send handler for the Input Bar
    // Behaviour depends on the step
    async function handleSend(){
        const trimmed = inputValue.trim();
        if(!trimmed || !sessionId) return;

        setIsSubmitting(true);
        setError("");

        try{
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

                addMessage("bot", "Approved successful.");
                addMessage("bot", "Welcome back! Please select the category below.");

                setStep(STEP_CATEGORIES);

                const catData = await getJson("/api/categories");
                setCategories(catData.categories || []);
            }

            else if (step === STEP_CATEGORIES){
                // 1. Show user message
                addMessage("user", trimmed);

                // 2. Call backend GPT endpoint
                const data = await postJson("/api/chat", {
                    message: trimmed,
                })

                // 3. Show bot reply
                addMessage("bot", data.reply);

                // 4. Suggest category
                if (data.confidence > 0.75){
                    addMessage(
                        "bot",
                        `This looks related to: ${data.category_label}.`
                    )
                }
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
