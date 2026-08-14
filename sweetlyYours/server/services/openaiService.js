const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AVAILABLE_CATEGORIES = [
  "NorthIndianDesserts",
  "EastIndianDesserts",
  "WestIndianDesserts",
  "SouthIndianDesserts",
  "Cakes",
  "Cupcakes",
  "Brownies",
  "Donuts",
  "Truffles",
  "IceCreams",
  "French Desserts",
  "Italian Desserts",
  "MiddleEast Desserts",
  "Japanese Desserts",
  "FunAndColourful",
  "ChilledTreats",
  "Diwali Specials",
  "ChristmasSpecials",
  "Eid Specials",
  "WeddingSpecials",
  "Baby Shower",
  "Birthday",
];

exports.getSuggestedCategories = async (message) => {
  try {
const prompt = `
You are an AI dessert recommendation assistant for an online dessert store.

Available categories:
${AVAILABLE_CATEGORIES.join(", ")}

Your job:
- Analyze the user's mood, occasion, craving, celebration, preference, or situation.
- Recommend the MOST relevant categories from the list above.
- Return ONLY a valid JSON array.
- Maximum 3 categories.
- Never explain your reasoning.
- Never return text outside the JSON array.
- Never invent categories.
- Every category MUST come from the provided category list.

Examples:

User: It's my birthday
Output:
["Birthday","Cakes"]

User: I am on my periods
Output:
["Brownies","Truffles","ChilledTreats"]

User: My mood is off
Output:
["Brownies","IceCreams","Truffles"]

User: I want something refreshing
Output:
["IceCreams","ChilledTreats"]

User: I love traditional Indian sweets
Output:
["NorthIndianDesserts","WestIndianDesserts","SouthIndianDesserts"]

User: I want something fancy for a wedding
Output:
["WeddingSpecials","Cakes"]

User: My child loves colorful desserts
Output:
["FunAndColourful","Cupcakes"]

User: I want something Italian
Output:
["Italian Desserts"]

User message:
"${message}"

Output:
`;

    const response =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

    const content =
      response.choices[0].message.content;

    console.log("AI RAW RESPONSE:", content);

    return content;
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return [];
  }
};