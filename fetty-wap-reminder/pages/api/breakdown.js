import OpenAI from "openai";
import { MongoClient } from "mongodb";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mongoUrl = "mongodb+srv://aaroncedric2005:$amano1@responses.yicpa.mongodb.net/?retryWrites=true&w=majority&appName=responses";
const dbName = "responses";
const collectionName = "goals";

const client = new MongoClient(mongoUrl);

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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that breaks down big goals into **5 highly specific, actionable, and measurable** steps. Each step should describe an exact action the user can perform."
        },
        {
          role: "user",
          content: `Break down the goal "${goal}" into **5 highly specific, step-by-step actions**. 
          - Each step should be **clear, measurable, and detailed**.
          - Include **exact numbers, locations, and timeframes** where possible.
          - Example format: "Do 10 push-ups every morning for a week" instead of "Improve fitness."
          - **Return only the 5 steps as a numbered list with no extra text.**`
        }
      ],
    });

    console.log("OpenAI Response:", JSON.stringify(response, null, 2));

    const stepsText = response.choices?.[0]?.message?.content?.trim();

    if (!stepsText) {
      console.error("No content in response.");
      return res.status(500).json({ error: "AI response was empty." });
    }


    //connect to mongodb
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    //store the openai response in the mongodb database
    const goalDoc = {
      goal: goal,
      steps: stepsText.split("\n").filter(Boolean),
    };

    const result = await collection.insertOne(goalDoc);
    console.log("Goal stored in MongoDB:", result.insertedId);

    res.status(200).json({ steps: goalDoc.steps });

    // Convert Markdown-style formatting (e.g., **bold**) into HTML <b> tags
    const formattedSteps = stepsText
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Replace **text** with <b>text</b>
      .split("\n")
      .map((step) => step.replace(/^\d+\.\s*/, "").trim()) // Remove leading numbers like "1. "
      .filter((step) => step.length > 0); // Remove empty lines

    res.status(200).json({ steps: formattedSteps });

  } catch (error) {
    console.error("Error calling OpenAI API or storing goal in MongoDB:", error);
    res.status(500).json({ error: "Failed to process goal." });
  } finally{
    //close the mongoDB client
    await client.close();
  }
}
