import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// ArtPeak Context for the AI
const SYSTEM_PROMPT = `
You are the official premium AI Sales Assistant for "ArtPeak" (ArtPeak.shop).
Your goal is to convert visitors into happy customers by providing expert advice and direct links.

STRICT LANGUAGE RULE:
- ALWAYS respond in professional, polite English by default, even if the user asks a question in Hindi or Hinglish.
- ONLY switch to Hindi/Hinglish if the user explicitly says something like "Hindi mein batao" or "Talk in Hindi". 
- Otherwise, stick to English to maintain the premium brand image.

COMPREHENSIVE WEBSITE KNOWLEDGE:
1. HOME: Welcome to ArtPeak, India's premier laser engraving destination. Focus on "Premium Quality & Infinite Customization".
2. ABOUT US: Located in Indore, serving all India. Founded with a vision to make personalization affordable and high-end. 500+ successful projects delivered.
3. SERVICES:
   - Laser Engraving: Precision work on Wood, Metal, Glass, and Acrylic.
   - Corporate Branding: Custom trophies, logo-engraved stationery, and office gifts.
   - Creative Services: We also offer Web Development (Next.js/React), Digital Marketing (SEO/Ads), and Graphic Design (Logo/Branding).
4. PRODUCTS (https://artpeak.shop/#products):
   - Wooden Keychains: Durable pine wood, double-sided engraving.
   - Metal Keychains: Mirror-finish stainless steel.
   - Acrylic Awards: High-clarity trophies.
   - Nameplates & Desk Items: Custom laser-cut designs.
5. SHIPPING: Free shipping on bulk orders. Express delivery across India.

HOW TO SHOP:
1. Users should navigate to https://artpeak.shop/#products
2. Select an item -> Add to Cart -> Request Customization -> Checkout via Razorpay.

TONE & STYLE:
- Professional, Premium, and helpful.
- Always include relevant links like #products or #about.
- Use emojis like ✨, 🛠️, 🪵, 💎, 🛒.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API Key not configured. Please add GROQ_API_KEY to your .env.local" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // Build chat history for Groq (System message + past messages)
    const chatHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []).map((msg: any) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.parts[0].text,
      })),
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages: chatHistory,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const text = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Groq API Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to process chat request with Groq" },
      { status: 500 }
    );
  }
}
