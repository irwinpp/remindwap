import OpenAI from "openai";
import axios from "axios";

const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
//const deepseekApiUrl = "https://api.deepseek.com/v1/chat/completions"; // No longer needed

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseek = new OpenAI({  // Create a separate OpenAI object for DeepSeek
  apiKey: deepseekApiKey,
  baseURL: "https://api.deepseek.com", // Or "https://api.deepseek.com/v1"
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "No goal provided" });
    }

    // OpenAI API call
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant that helps break down big goals into step-by-step tasks." },
        { role: "user", content: `Break down this goal into 5 actionable steps: "${goal}"` }
      ],
    });

    // DeepSeek API call - Use the configured DeepSeek OpenAI object
    const deepseekResponse = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an AI assistant that helps break down big goals into step-by-step tasks." },
        { role: "user", content: `Break down this goal into 5 actionable steps: "${goal}"` }
      ],
    });

    const openaiSteps = openaiResponse.choices[0]?.message?.content.split("\n").filter(Boolean);
    const deepseekSteps = deepseekResponse.choices[0]?.message?.content.split("\n").filter(Boolean); //Access choices

    res.status(200).json({
      openaiSteps,
      deepseekSteps
    });
  } catch (error) {
    console.error("Error calling AI APIs:", error);
    res.status(500).json({ error: "Failed to process goal." });
  }
}
