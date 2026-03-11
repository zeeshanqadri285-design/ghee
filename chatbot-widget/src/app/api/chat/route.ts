import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

const systemInstruction = `You are a professional, friendly, and helpful AI Sales Assistant for a premium dairy products brand. 
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
- Do NOT output markdown, lists, or long paragraphs, because your responses will be spoken aloud to the user using Text-To-Speech. Keep everything in simple spoken sentences.

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
Do not add any other words to the final message. The user's device will intercept this message and show them an order confirmation and WhatsApp checkout link.
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500, headers: corsHeaders }
      );
    }

    // Initialize inside the request handler so env vars are always read fresh
    const ai = new GoogleGenAI({ apiKey });

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400, headers: corsHeaders });
    }

    const response = await ai.models.generateContent({
      model: "gemma-3-4b-it",
      contents: [
        // Inject system instructions as first user/model exchange (gemma doesn't support systemInstruction)
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood! I am your AI Sales Assistant for this premium dairy brand. I will keep my answers short, conversational, and focused on helping customers order." }] },
        ...(history || []),
        { role: "user", parts: [{ text: message }] },
      ],
    });

    const responseText = response.text || "Sorry, I couldn't formulate a response.";

    return NextResponse.json({ response: responseText }, { headers: corsHeaders });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500, headers: corsHeaders }
    );
  }
}
