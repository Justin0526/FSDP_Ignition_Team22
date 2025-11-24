// Handles GPT chat for verified sessions.
import supabase from "../config/supabase.js";
import openai from "../config/openai.js";
import AppError from "../utils/AppError.js";
import { getAndValidateActiveSession } from "./sessionService.js";

const CHAT_SYSTEM_PROMPT = `
You are OCBC's Virtual Assistant.
Your job is to chat naturally with the user.

Guidelines:
- Be warm, helpful, and concise.
- Use 1–3 sentences.
- If user raises fear (lost card, scam), reassure politely.
- Ask clarifying questions when needed.
- Do NOT mention categories or classification.
- Do NOT output JSON.

Your output must be plain text only. 
`
export async function generateChatReply(userMessage){
    if(!userMessage){
        throw new AppError("message is required", 400);
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: CHAT_SYSTEM_PROMPT},
            {role: "user", content: userMessage},
        ],
        temperature : 0.4,
    })

    return completion.choices[0].message.content.trim();
}