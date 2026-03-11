const { GoogleGenAI } = require("@google/genai");

const systemInstruction = `You are a friendly AI Sales Assistant for PureDairy, a premium Pakistani dairy brand.
Your goal is to help customers learn about our products and collect their order details.

Information about our products:
1. Cow Desi Ghee
   - Price: 2500 PKR per kg
   - Quality: 100% pure
   - Shipping: Free home delivery
2. Fresh Butter
   - Price: 2200 PKR per kg
   - Quality: Made from fresh milk

Your style:
- Keep your answers VERY short, concise, and conversational.
- Be encouraging and try to lead the customer toward placing an order.

Order Collection Flow:
If the user wants to order, you must collect the following 5 pieces of information:
1. Product name (Cow Desi Ghee or Fresh Butter)
2. Quantity (e.g., 1 kg, 500g)
3. Customer name
4. City
5. Phone number

IMPORTANT CHECK: 
Once you have ALL 5 pieces of information, reply EXACTLY with this format:
"ORDER_COMPLETE: [Product Name] | [Quantity] | [Customer Name] | [City] | [Phone Number]"
For example: "ORDER_COMPLETE: Cow Desi Ghee | 1 kg | Ali | Lahore | 03001234567"
Do not add any other words to the final message.`;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async function handler(req, res) {
  setCors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemma-3-4b-it",
      contents: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood! I will act as the PureDairy AI Sales Assistant." }] },
        ...(history || []),
        { role: "user", parts: [{ text: message }] },
      ]
    });

    const responseText = response.text || "Sorry, I couldn't formulate a response.";

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to process chat request.", detail: error.message });
  }
};
