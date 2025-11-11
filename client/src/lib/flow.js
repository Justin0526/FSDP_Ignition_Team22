import { maskNumber } from "./mask";

// This file defines the chatbot conversation flow as a Finite-State Machine (FSM)
// Each "step" has fixed properties:
// - bot: message text displayed by the chatbot
// - input: "text" if user should type, "none" if system handles automatically
// - validate: function that checks if the input is valid
// - onError: what the bot says when input is invalid
// - next: next step key to continue the flow
// - postProcess (optional): how to format or mask user data before displaying
// - asyncBeforeNext (optional): asynchronous logic (e.g., backend check)

export const FLOW = {
  // Step 1: Ask for customer's name
  askName: {
    bot: "Hello, please state your name.",
    input: "text",
    validate: (v) => /^[A-Za-z][A-Za-z .'-]{1,60}$/.test(v.trim()), // only alphabetic characters allowed
    onError: "Sorry, your name is invalid. Please enter your full name as per bank records.",
    next: "askAccount",
  },

  // Step 2: Ask for account/card number
  askAccount: {
    bot: "What is your account card number?",
    input: "text",
    validate: (v) => /^\d{12,19}$/.test(v.replace(/\s+/g, "")), // must be 12–19 digits
    onError: "Sorry, your name or account number/card number is wrong.",
    postProcess: (v) => maskNumber(v), // mask before displaying
    next: "digitoken",
  },

  // Step 3: Simulate digitoken verification (no manual input)
  digitoken: {
    bot: "Please approve access of your details using the digitoken.",
    input: "none", // no text input expected
    // Simulate async wait for approval (can replace with real API call)
    asyncBeforeNext: async () => {
      await new Promise((r) => setTimeout(r, 1200)); // fake 1.2s delay
      return { approved: true }; // always approved for demo
    },
    onError: "Digitoken approval failed or timed out. Please approve on your device.",
    next: "success",
  },

  // Step 4: Successful verification
  success: {
    bot: "Thanks, we’ve verified your details. How can I help you today?",
    input: "none",
    next: null, // no more steps
  },
};
