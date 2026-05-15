import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { condition, dosha } = body;

    // 1. Get condition
    const conditionResult = await sql`
      SELECT * FROM conditions WHERE name = ${condition}
    `;

    if (conditionResult.length === 0) {
      return NextResponse.json({ error: "Condition not found" }, { status: 404 });
    }

    const conditionData = conditionResult[0];
    const tags = conditionData.recommended_tags;

    // 2. Fetch foods (RAG)
    const foods = await sql`
      SELECT DISTINCT name, tags
      FROM food_items
      WHERE tags ?| ${tags}
      AND dosha_effect->>${dosha.toLowerCase()} = 'pacifying'
      LIMIT 8
    `;

    // 3. Build prompt
    const foodNames = foods.map((f: any) => f.name).join(", ");

    const prompt = `
You are an Ayurvedic doctor.

User:
- Prakriti: ${dosha}
- Condition: ${condition}

Recommended foods:
${foodNames}

Give:
1. Short explanation
2. Foods to eat
3. Foods to avoid
4. Daily routine tips

Keep it simple and practical.
`;

    let output = "";

    // 4. Try OpenAI
    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an Ayurvedic expert." },
          { role: "user", content: prompt },
        ],
      });

      output = aiResponse.choices[0].message.content || "";

    } catch (err) {
      console.log("OpenAI failed, using fallback");

      // 5. Fallback response (VERY IMPORTANT)
      output = `
Based on your ${dosha} prakriti and ${condition}:

Recommended foods:
${foodNames}

Foods to avoid:
- Spicy food
- Fried food
- Oily food

Daily tips:
- Drink plenty of water
- Eat light and fresh meals
- Avoid late-night eating
- Maintain a regular sleep schedule
`;
    }

    // 6. Return final response
    return NextResponse.json({
      condition,
      dosha,
      foods,
      ai_response: output,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}