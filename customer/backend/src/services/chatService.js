import openai from "../config/openai.js";
import AppError from "../utils/AppError.js";
import { getAndValidateActiveSession } from "./sessionService.js";

const CHAT_SYSTEM_PROMPT = `
You are OCBC's Virtual Assistant.

Your job:
- Chat naturally with customers about their banking enquiries.
- Reply in 1–3 short, clear sentences.
- Be polite, calm, and reassuring, especially for fraud or scam concerns.
- Ask clarifying questions if the user's request is unclear.
- If the user asks which category their enquiry belongs to, or seems unsure about which option to choose, you may suggest ONE category from the list below using its human-friendly label.
- Only suggest one category at a time.
- Do NOT output JSON.
- Do NOT mention internal codes like "cards_and_payments" unless the user explicitly asks for codes. Normally, just use the labels.
- Keep responses simple, helpful, and conversational.

Here is the category list you can use when suggesting a category:

Categories:
Cards & Payments
Accounts & Savings
Loans & Mortgages
Digital Banking
Security & Fraud
Branch & ATM Services
Product Info & Rates
Feedback & Others

If none fits well, treat it internally as "unknown / other", but still respond in normal, helpful language without forcing a category.
`;

export async function chatWithAssistant(sessionId, userMessage){
    if(!sessionId || !userMessage){
        throw new AppError("sessionId and messsage are required", 400);
    }

    await getAndValidateActiveSession(sessionId);

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: CHAT_SYSTEM_PROMPT},
            {role: "user", content: userMessage},
        ],
        temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "";

    if (!reply){
        throw new AppError("Assistant did not respond", 500);
    }

    return { reply };
}