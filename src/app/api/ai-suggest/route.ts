// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

    let model;
    let result;

    try {
      // Attempt to use the primary model
      model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash-8b" });
      result = await model.generateContent(prompt);
    } catch (primaryModelError) {
      console.warn("Primary model failed. Switching to secondary model.", primaryModelError);

      try {
        // Fallback to the secondary model
        model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
        result = await model.generateContent(prompt);
      } catch (secondaryModelError) {
        console.warn("Secondary model failed. Switching to tertiary model.", secondaryModelError);

        try {
          // Fallback to the tertiary model
          model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
          result = await model.generateContent(prompt);
        } catch (tertiaryModelError) {
          console.error("All models failed.", tertiaryModelError);
          return NextResponse.json({ error: "All models failed to generate content." }, { status: 500 });
        }
      }
    }

    const generatedText = await result.response.text();
    return NextResponse.json({ generatedText }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Error generating content" }, { status: 500 });
  }
}
