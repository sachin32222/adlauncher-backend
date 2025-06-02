
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { industry, offer } = req.body;

  const prompt = `
You are an expert ad copywriter. Write a Google ad and Meta ad for the following business:

Industry: ${industry}
Offer: ${offer}

Return it in JSON format with fields: "headline" and "description".
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const message = data.choices[0].message.content;

    const json = JSON.parse(message);
    res.status(200).json(json);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
