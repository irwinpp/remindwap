import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quoteData = response.data[0]; // API returns an array
    res.status(200).json({ quote: `"${quoteData.q}" - ${quoteData.a}` });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch motivational quote" });
  }
}
