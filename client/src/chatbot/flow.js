import { getYoutubeThumbnail } from "@/lib/youtube";
import { getAllBranches, getBranchById } from '../services/branchAPI';


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
        ctx.enquiryId = json.data.enquiry_id;

        },
        next: "success",
    },

    success: {
        bot: () => "Thanks. Your enquiry was sent. We’ll follow up shortly.",
        input: "none",
        next: "consultation",
    },

    cancelled: {
        bot: () => "Okay, I’ve cancelled this request.",
        input: "none",
        next: null,
    },

  // branch selection demo
  testSelectBranch: {
  bot: "You have selected the physical consult option. Please select the branch you would like to visit in the next 7 days:",
  input: "none",
  asyncBeforeNext: async (ctx, push) => {
    console.log('=== BRANCH SELECTION DEBUG ===');
    console.log('1. About to call getAllBranches()');
    
    // Fetch branches from database
    const branches = await getAllBranches();
    
    console.log('2. Branches received:', branches);
    console.log('3. Number of branches:', branches?.length);
    
    // branches format from API: [{ id, label, desc }, ...]
    // Convert to your flow format: [{ label, value, desc }, ...]
    const branchOptions = branches.map(b => ({
      label: b.label,           // e.g., "Bishan"
      value: b.id,              // UUID from database
      desc: b.desc              // Full address
    }));
    
    console.log('4. Branch options after mapping:', branchOptions);
    console.log('5. About to call push with options');
    
    push?.("bot_options", branchOptions);
    
    console.log('6. Push called successfully');
  },
  next: null,
  onChoose: (opt, ctx) => {
    console.log('Branch chosen:', opt);
    ctx.branchId = opt.value;     // UUID
    ctx.branchName = opt.label;   // Branch name
    ctx.branchDesc = opt.desc;    // Full address
  },
  nextAfterChoose: "confirmBranch",
},


confirmBranch: {
  bot: null, // Set dynamically in asyncBeforeNext
  input: "none",
  asyncBeforeNext: async (ctx, push) => {
    const qrValue = `Branch: ${ctx.branchName}`;
    
    // Push the confirmation message first
    push?.(
      "bot", 
      `You have selected the ${ctx.branchName} OCBC branch.\nHere is your QR code for your visit that can be scanned at the ${ctx.branchName} OCBC Branch in the next 7 days for a consult.`
    );
    
    // Then push QR Code
    push?.("bot", { text: "", qrvalue: qrValue });
  },
  next: null
},



    consultation: {
        bot: () =>
            "Would you prefer an online or physical consult at a branch of your preference/ convenience?",
        input: "none",
        asyncBeforeNext: async (_ctx, push) => {
            push?.("bot_options", [
            { label: "ONLINE", value: "online" },
            { label: "PHYSICAL", value: "physical" },
            ]);
        },
        next: null,
        onChoose:(opt, ctx) => {
            ctx.consultationMode= opt.value;
        },
        nextAfterChoose: "saveConsultationMode",
    },

    // 3) Persist the choice; then branch to the right path
    saveConsultationMode: {
        bot: "Noted. Saving your preference…",
        input: "none",
        asyncBeforeNext: async (ctx, push) => {
            const res = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enquiryId: ctx.enquiryId,
                    mode: ctx.consultationMode,
                }),
            });

            const json = await res.json();
            if (!res.ok || !json.ok) {
            push?.(
                "bot",
                json?.error?.message ??
                "Failed to select mode of enquiry. Please try again."
            );
            if (json?.error?.hint) push?.("bot", json.error.hint);
            throw new Error(json?.error?.code || "MODE_FAILED");
            }
        },
        next: "routeConsultationMode"
    },

    routeConsultationMode:{
        bot: null,
        input: "none",
        next: (ctx) => ctx.consultationMode == "physical" ? "chooseBranch" : "online",
    },

    online: {
        bot: null,
        input: "none",
        asyncBeforeNext: async (ctx, push) => {
            push?.("bot", "You have selected the online consult. There are 3 customers ahead.");
            push?.("bot", "Estimated waiting time: 9-15 minutes")
            push?.("bot", "In the meantime, we recommend using the self-service option below!");
            push?.("bot", `You've selected "${ctx.subcategoryName}".\nHere are some common solutions that might help.`)
        },
        next: "selfServiceHelp", 
    },

    selfServiceHelp: {
        input: "none",
        asyncBeforeNext: async (ctx, push) => {
            if (!ctx.categoryId) {
            push("bot", "I couldn't detect the enquiry category.");
            return;
            }

            const res = await fetch(
            `/api/self_service?categoryId=${encodeURIComponent(ctx.subcategoryId)}`
            );

            const json = await res.json();

            if (!json.ok) {
            push("bot", json.error?.message || "Self-service is currently unavailable.");
            return;
            }

            const options = (json.data || []);

            if (!options.length) {
            push("bot", "There are currently no self-service options for this category.");
            return;
            }

            // Show as clickable labels (your existing options mechanism)
            push("bot", "Please choose one of the self-service options:");
            push("bot_options", options.map((opt) => ({
            label: opt.title,  // what the user sees on the button
            value: opt,        // full object so we can use it later
            })));
        },

        // when the customer clicks an option button
        onChoose: (option, ctx) => {
            const chosen = option?.value || option;
            ctx.selfServiceOption = chosen; // store selected option in context
        },

        nextAfterChoose: "selfServiceVideo",
    },

    selfServiceVideo: {
        input: "none",
        asyncBeforeNext: async (ctx, push) => {
            const opt = ctx.selfServiceOption;

            if (!opt) {
            push("bot", "Please select a self-service option above.");
            return;
            }

            const thumbnailUrl = getYoutubeThumbnail(opt.video_url);

            push( "bot", `You chose "${opt.title}". Here's a short video that might help.`);

            // One specific self-service card for the chosen option
            push("bot_self_service", {
            option: {
                ...opt,
                thumbnailUrl,
            },
            prompt: `Watch short video tutorial (${opt.video_duration_seconds || 37}s)`,
            question: "Did this help solve your issue?",
            });

            // no static next: your UI will handle Yes/No and then you can decide where to go
            // (e.g. ctx.selfServiceHelped = true/false then advance from there)
        },
    },

    chooseBranch : {
        bot: "Choose branch...",
        input: "text",
        next: null,
    }
    
};
