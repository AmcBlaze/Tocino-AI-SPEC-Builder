import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI SDK
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  // Check if API key is configured
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { prompt } = body;

    // Validate the input
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A valid 'prompt' string is required in the request body." },
        { status: 400 }
      );
    }

    // Define the system instruction to force structured JSON output in 6 sections
    const SYSTEM_PROMPT = `You are a senior software architect. Your ONLY task is to generate technical specifications in JSON format.

Given the product idea provided by the user, generate a complete technical specification as a JSON object.

IMPORTANT: Respond with the raw JSON object directly — no wrapper keys, no markdown fences, no extra text.
The root object must have exactly these 6 keys in this format:

{"success":true,"spec":{
  "vision": "<string, 2-4 sentences describing the product vision, core purpose, and value proposition>",
  "users": "<string, 2-4 sentences describing the target users, their context, and their main pain points>",
  "features": [
    "El usuario puede ... (or El sistema permite ...)",
    "... between 5 and 8 items total ..."
  ],
  "flows": [
    {
      "name": "<short flow name>",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "error_path": "<what happens if this flow fails>"
    }
  ],
  "architecture": "<string, 2-4 sentences describing the technical architecture, stack choices, and system design>",
  "requirements": "<string, 2-4 sentences covering the key functional and non-functional requirements>"
}};

Rules:
- features: array of strings, 5–8 items, each starting with 'El usuario puede' or 'El sistema permite'.
- flows: array of objects, 3–5 items. Each object must have exactly: name (string), steps (array of strings with the happy-path steps in order), error_path (string describing what happens if the flow fails).
- vision, users, architecture, requirements: plain strings of exactly 2–4 sentences — not one line, not a long paragraph.
- Output only the JSON object. No wrapper object, no extra keys, no explanation.

IMPORTANT: Return the JSON object directly. Do NOT wrap it in any parent key like spec, data, result or any other wrapper. The root of your response must be the JSON object itself.`;

    // Initialize the model with the system instruction and JSON response type
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Call the Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Attempt to parse the response as JSON
    let structuredSpec;
    try {
      structuredSpec = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      return NextResponse.json(
        { error: "The model failed to return a valid JSON structure.", rawResponse: responseText },
        { status: 500 }
      );
    }

    // Return the successful response
    return NextResponse.json({
      success: true,
      spec: structuredSpec
    });

  } catch (error: any) {
    console.error("Error in /api/generate-spec route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while generating the specification." },
      { status: 500 }
    );
  }
}
