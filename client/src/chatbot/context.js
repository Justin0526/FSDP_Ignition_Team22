// Holds temporary conversation variables (not saved to DB until confirm)
// Holds temporary conversation variables (not saved to DB until confirm)
// src/chatbot/context.js
// Holds temporary conversation variables (NOT saved until user confirms)

export function createCtx() {
  return {
    // Contact
    phoneRaw: null,        // digits-only (e.g., 6591234567 or 91234567)
    phonePretty: null,     // as typed by user (e.g., "+65 9123 4567")

    // Card
    cardLast4: null,       // "1234"
    accountMasked: null,   // "•••• 1234" (safe to display)

    // Digitoken
    digitokenApproved: false,

    // Category / Subcategory (from DB)
    categoryId: null,
    categoryName: null,
    subcategoryId: null,
    subcategoryName: null,

    // Optional extras shown on the summary card
    details: null,         // free-text details (if you collect later)
    attachmentName: null,  // display name of uploaded file (if any)

    // Legacy (keep if you still use name elsewhere)
    name: null,
    customerId: null,
    description: null,

    // Enquiry info
    enquiryId: null,
    consultationMode: null,
    selfServiceOption: null,
  };
}

