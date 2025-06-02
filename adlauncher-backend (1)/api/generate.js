import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { industry, offer } = req.body;

  if (!industry || !offer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `Create a short Meta Ads campaign headline and description for a business in the ${industry} industry with this offer: ${offer}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.data.choices[0].message.content.split("\n");
    const headline = text[0] || "Your Ad Headline";
    const description = text[1] || "Your Ad Description";

    res.status(200).json({ headline, description });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate ad copy" });
  }
}
