import { maskNumber } from "./mask";
import { t } from "./utils";

// Category fetcher
async function loadCategories(){
    const res = await fetch("/api/enquiries", {cache : "no-store"});
    if (!res.ok) throw new Error("Failed to load categories");
    const json = await res.json();
    return json.data;
}

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
  askName: {
    bot: "Hello, please state your name.",
    input: "text",
    validate: (v) => /^[A-Za-z][A-Za-z .'-]{1,60}$/.test(v.trim()),
    onError: "Sorry, your name is invalid. Please enter your full name as per bank records.",
    onStore: (v, ctx) => { ctx.name = v.trim(); },
    next: "askAccount",
  },

  askAccount: {
    bot: (ctx) => t("Nice to meet you, {{name}}. What is your card number?", ctx),
    input: "text",
    validate: (v) => /^\d{12,19}$/.test(String(v).replace(/\s+/g, "")),
    onError: "Sorry, your name or account card number is wrong.",
    onStore: (v, ctx) => {
      const raw = String(v).replace(/\s+/g, "");
      ctx.accountRaw = raw;              // keep locally until confirm
      ctx.accountMasked = maskNumber(raw);
    },
    next: "digitoken",
  },

  digitoken: {
    bot: "Please approve access of your details using the digitoken.",
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
      await new Promise((r) => setTimeout(r, 1200)); // simulate check
      ctx.digitokenApproved = true;
      if (push) push("bot", "Digitoken approved successfully.");
      return { approved: true };
    },
    onError: "Digitoken approval failed or timed out. Please approve on your device.",
    next: "chooseCategory",
  },

  chooseCategory: {
    bot: (ctx) => t("Nice to meet you, {{name}}. Please select the category of enquiry below", ctx),
    input: "none",
    asyncBeforeNext: async (ctx, push) => {
        const rows = await loadCategories(); // make sure this is defined/imported
        const parents = rows
        .filter(r => r.active && !r.parent_category)
        .map(r => ({ label: r.name, value: r.category_id, desc: r.description }));

        if (!parents.length) {
            push?.("bot", "No categories available right now. Please try again later.");
            return; // stay on this step
        }

        // 👇 actually render the buttons
        push?.("bot_options", parents);
    },
        next: null, // wait for user click
        onChoose: (opt, ctx) => {
            // opt is the full object { label, value, desc }
            ctx.categoryId = opt.value;
            ctx.categoryName = opt.label;
    },
        nextAfterChoose: "chooseSubCategory" // 👈 where to go after a click
    },

    chooseSubCategory: {
        bot: (ctx) => t("Can you please help me select the sub-category of enquiry below?", ctx),
        input: "none",
        asyncBeforeNext: async(ctx, push)=> {
            const rows = await loadCategories();
            const children = rows
            .filter(r => r.active && r.parent_category == ctx.categoryId)
            .map(r => ({label: r.name, value: r.category_id, desc: r.description }));

            if (!children.length){
                push?.("bot", "No subcategories available right now. Please try again later.");
                return;
            }

            push?.("bot_options", children);
        },
        next: null, // wait for user click
        onChoose: (opt, ctx) => {
            ctx.subcategoryId = opt.value;
            ctx.categoryName = opt.label;
        },
        nextAfterChoose: null
    }


};
