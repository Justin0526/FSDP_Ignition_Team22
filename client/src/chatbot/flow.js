// Category fetcher
async function loadCategories(){
    const res = await fetch("/api/enquiries", {cache : "no-store"});
    if (!res.ok) throw new Error("Failed to load categories");
    const json = await res.json();
    return json.data;
}


// Helpers for phone & last-4 formatting
const formatLast4 = (last4) => `•••• •••• •••• ${last4}`;

// Finite-State Machine definition (happy path)
// Each step supports:
// - bot: string | (ctx) => string
// - input: "text" | "none"
// - validate(value) => boolean
// - onError: string
// - onStore(value, ctx) => void
// - asyncBeforeNext(ctx) => Promise<any>
// - next: stepKey | null
// - branch(value) => stepKey   (optional, for conditional routing)
export const FLOW = {
  askPhoneNum: {
    bot: "Hello, please enter your phone number:",
    input: "text",

    // Looser: accept 8–15 digits after stripping spaces/dashes/etc.
    validate: (v) => {
        const digits = String(v || "").replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
    },

    onError: "Please enter a phone number with 8–15 digits (spaces/dashes are ok).",

    onStore: (v, ctx) => {
        const pretty = String(v).trim();              // keep how user typed it
        const digits = pretty.replace(/\D/g, "");     // normalized for DB
        ctx.phonePretty = pretty;
        ctx.phoneRaw = digits;
    },

    next: "askCard",
  },

  askCard: {
    bot: () => "Please enter the last 4 digits of your card number:",
    input: "text",
    validate: (v) => /^\d{4}$/.test(String(v).trim()),
    onError: "Please enter exactly the last 4 digits (numbers only).",
    onStore: (v, ctx) => {
      const last4 = String(v).trim();
      ctx.cardLast4 = last4;
      ctx.accountMasked = formatLast4(last4); 
    },
    next: "digitoken",
  },

  digitoken: {
    bot: "Please approve access of your details using the digitoken.",
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
        // 1) Simulate Digitoken approval (your real call goes here)
        await new Promise((r) => setTimeout(r, 900));
        ctx.digitokenApproved = true;
        push?.("bot", "Digitoken approved successfully.");

        // 2) Server-side verification (READ-ONLY)
        const res = await fetch("/api/verify_customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone: ctx.phoneRaw,
                last4: ctx.cardLast4,
                digitokenApproved: true,
            }),
        });
        const json = await res.json();

        if (!json.ok) {
            //  user-friendly line from controller
            push?.("bot", json.error?.message || "Verification failed. Please try again.");
            // Display hint below or as subtext
            if (json.error?.hint) push?.("bot", json.error.hint);
            throw new Error(json.error?.code || "VERIFY_FAILED");
        }

        // 3) Success → keep some fields for later UX
        ctx.customerId   = json.data.customer.customer_id;
        ctx.customerName = json.data.customer.full_name;
        push?.("bot", `Welcome back, ${ctx.customerName}.`);
        return { approved: true };
    },
    onError: "Verification failed. Please try again.",
    next: "chooseCategory",
  },

  chooseCategory: {
    // You no longer have name; use phone or generic copy:
    bot: () => "Please select the category of enquiry below:",
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
      const rows = await loadCategories();
      const parents = rows
        .filter((r) => r.active && !r.parent_category)
        .map((r) => ({ label: r.name, value: r.category_id, desc: r.description }));

      if (!parents.length) {
        push?.("bot", "No categories available right now. Please try again later.");
        return;
      }
      push?.("bot_options", parents); // render buttons
    },
    next: null, // wait for click
    onChoose: (opt, ctx) => {
      ctx.categoryId = opt.value;
      ctx.categoryName = opt.label;
    },
    nextAfterChoose: "chooseSubCategory",
  },

  chooseSubCategory: {
    bot: () => "Can you please help me select the sub-category of enquiry below?",
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
      const rows = await loadCategories();
      const children = rows
        .filter((r) => r.active && r.parent_category === ctx.categoryId) // strict compare
        .map((r) => ({ label: r.name, value: r.category_id, desc: r.description }));

      if (!children.length) {
        push?.("bot", "No subcategories for this category. Proceeding to summary…");
        // Optionally: ctx.subcategoryId = null; ctx.subcategoryName = null;
        // and you could set next: "summaryCard" here if you want auto-advance
        return;
      }
      push?.("bot_options", children);
    },
    next: null, // wait for click
    onChoose: (opt, ctx) => {
      ctx.subcategoryId = opt.value;
      ctx.subcategoryName = opt.label;
    },
    nextAfterChoose: "summaryCard",
  },

  summaryCard: {
    bot: (ctx) => `Thank you ${ctx.customerName}. Here is a quick summary of your enquiry.`,
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
      // push a summary card message (MessageList should render type: "summary")
      // inside FLOW.summaryCard.asyncBeforeNext
        push?.("bot_summary", {
            customerName: ctx.customerName ?? "—",
            phone: ctx.phonePretty ?? ctx.phoneRaw ?? "—",
            accountMasked: ctx.accountMasked ?? "—",
            categoryName: ctx.categoryName ?? "—",
            subcategoryName: ctx.subcategoryName ?? "—",
        });
    },
    // Use onSummary and standard actions "confirm" | "edit" | "cancel"
    onSummary: (action) => {
      if (action === "confirm") return "submit";
      if (action === "edit") return "chooseCategory";
      if (action === "cancel") return "cancelled";
      return null;
    },
    next: null,
  },

  submit: {
    bot: "Submitting your request…",
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
        const chosenCategoryId = ctx.subcategoryId ?? ctx.categoryId; // use sub if present, else parent
        const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: ctx.customerId,
            categoryId: chosenCategoryId,
            description: ctx.description ?? "",
        }),
        });

        const json = await res.json();
        if (!res.ok || !json.ok) {
        push?.("bot", json?.error?.message || "Failed to submit enquiry form. Please try again.");
        if (json?.error?.hint) push?.("bot", json.error.hint);
        throw new Error(json?.error?.code || "SUBMIT_FAILED");
        }
    },
    next: "success",
    },

  success: {
    bot: () => "Thanks. Your enquiry was sent. We’ll follow up shortly.",
    input: "none",
    next: null,
  },

  cancelled: {
    bot: () => "Okay, I’ve cancelled this request.",
    input: "none",
    next: null,
  },
};
