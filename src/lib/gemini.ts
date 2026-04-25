"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a highly capable, friendly AI assistant. You provide clear, accurate, and well-structured responses. When writing code, you use proper syntax highlighting with markdown code blocks. You're conversational but concise, and you format your responses with markdown for readability. You use bullet points, headers, and code blocks when appropriate.`;

function getModel() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey === "your-api-key-here") {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });
}

export async function generateChatResponse(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  try {
    const model = getModel();

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    return response.text();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not configured")) {
        return "⚠️ **API Key Not Configured**\n\nPlease add your Google Generative AI API key to get started:\n\n1. Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)\n2. Create a `.env.local` file in the project root\n3. Add: `GOOGLE_GENERATIVE_AI_API_KEY=your-key-here`\n4. Restart the dev server\n\nThe free tier includes generous usage limits!";
      }
      console.error("Gemini API error:", error.message);
      return `⚠️ **Error**: ${error.message}\n\nPlease check your API key and try again.`;
    }
    return "⚠️ An unexpected error occurred. Please try again.";
  }
}

export async function generateTitle(message: string): Promise<string> {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Generate a very short title (max 5 words) for a conversation that starts with this message. Return only the title, no quotes or punctuation:\n\n${message}`
    );
    return result.response.text().trim().slice(0, 50);
  } catch {
    return message.slice(0, 30) + (message.length > 30 ? "…" : "");
  }
}