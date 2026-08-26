import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

    const systemPrompt = `You are a helpful AI assistant for a mosque management system. 
Generate a rich text (HTML formatted) response based on the user's prompt. 
Only output valid HTML (e.g. <p>, <strong>, <ul>, <li>, <h3>) suitable for insertion into a rich text editor. Do not include markdown formatting or backticks (\`\`\`).`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: prompt }
    ]);
    
    let htmlContent = result.response.text();
    
    // Clean up potential markdown formatting that sometimes creeps in
    htmlContent = htmlContent.replace(/^```html/gi, "").replace(/^```/g, "").replace(/```$/g, "").trim();

    return NextResponse.json({ content: htmlContent });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
