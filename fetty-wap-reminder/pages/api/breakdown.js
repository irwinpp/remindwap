import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use .env for security
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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant that helps break down big goals into step-by-step tasks." },
        { role: "user", content: `Break down this goal into 5 actionable steps: "${goal}"` }
      ],
    });

    // Extract AI-generated steps (split by new line)
    const steps = response.choices[0].message.content.split("\n").filter(Boolean);

    res.status(200).json({ steps });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to process goal." });
  }
}
