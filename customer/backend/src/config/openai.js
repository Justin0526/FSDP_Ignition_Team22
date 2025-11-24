// Creates a single OpenAI client instance used across the backend.
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;