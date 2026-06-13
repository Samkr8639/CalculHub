const { GoogleGenAI } = require('@google/genai');

module.exports = async function (req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { calculatorType, data } = req.body;

    if (!calculatorType || !data) {
      return res.status(400).json({ error: 'Missing required fields: calculatorType or data' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error. AI is currently unavailable.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemPrompt = '';
    let userMessage = '';

    if (calculatorType === 'calorie') {
      systemPrompt = `You are a certified, professional fitness and nutrition coach focused on Indian and global diets. 
      The user is asking for a personalized diet strategy based on their exact calculated macros.
      Provide an actionable, structured response. Include:
      1. A short, encouraging summary of their goal.
      2. 3-4 bullet points of actionable diet tips (e.g., protein sources, meal timing).
      3. A sample 1-day meal plan (Breakfast, Lunch, Dinner) that roughly matches their macros. You can give a mix of Indian and western options.
      Keep the tone professional, encouraging, and clear. Do NOT output markdown code blocks formatting (like \`\`\`html), just return raw HTML tags for formatting if needed, or simple text. Wait, return the response using basic HTML tags: <h3>, <ul>, <li>, <p>, <strong> for structure, so the frontend can render it nicely. DO NOT use markdown. Just HTML.`;

      userMessage = `Goal: ${data.goal}
      Daily Calorie Target: ${data.calories} kcal
      Macros: Protein: ${data.protein}g, Carbs: ${data.carbs}g, Fats: ${data.fat}g.
      Please generate my personalized diet strategy.`;
    } else {
      return res.status(400).json({ error: 'Unsupported calculator type for AI insights.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const aiText = response.text;

    return res.status(200).json({ insight: aiText });

  } catch (error) {
    console.error('AI Insight Error:', error);
    return res.status(500).json({ error: 'Failed to generate insight. Please try again later.' });
  }
};
