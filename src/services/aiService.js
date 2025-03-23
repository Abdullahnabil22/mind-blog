// AI Service for text processing
import toast from "react-hot-toast";

// You'll need to add an API key for a real implementation
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Process text with AI
export async function processTextWithAI(text, action) {
  try {
    if (!API_KEY) {
      console.warn("No API key provided. Using mock response");
      return getMockResponse(text, action);
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(action),
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "AI processing failed");
    }

    return data.choices[0].message.content;
  } catch (error) {
    toast.error(`AI processing failed: ${error.message}`);
    console.error("AI processing error:", error);
    return null;
  }
}

// Get system prompt based on action
function getSystemPrompt(action) {
  switch (action) {
    case "summarize":
      return "You are a helpful assistant that summarizes text concisely while preserving the key points.";
    case "translate-ar":
      return "You are a helpful assistant that translates text from English to Arabic.";
    case "translate-fr":
      return "You are a helpful assistant that translates text from English to French.";
    case "translate-es":
      return "You are a helpful assistant that translates text from English to Spanish.";
    case "improve":
      return "You are a helpful assistant that improves the clarity and quality of writing while maintaining the original meaning.";
    default:
      return "You are a helpful assistant that processes text as requested.";
  }
}

function getMockResponse(text, action) {
  switch (action) {
    case "summarize":
      return `[Summary] ${text.slice(0, 100)}...`;
    case "translate-ar":
      return `[Arabic Translation] ${text.slice(0, 50)}...`;
    case "translate-fr":
      return `[French Translation] ${text.slice(0, 50)}...`;
    case "translate-es":
      return `[Spanish Translation] ${text.slice(0, 50)}...`;
    case "improve":
      return `[Improved] ${text}`;
    default:
      return `[Processed] ${text}`;
  }
}
