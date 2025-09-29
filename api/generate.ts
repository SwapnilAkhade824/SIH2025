import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Enhanced prompt for kolam generation
    const enhancedPrompt = `
You are an expert in South Indian kolam art and traditional geometric patterns. 
Based on the following user request, provide detailed instructions for creating a kolam pattern:

User Request: "${prompt}"

Please provide a comprehensive response that includes:
1. A detailed description of the kolam pattern
2. Step-by-step drawing instructions
3. Mathematical principles involved (symmetry, geometry, etc.)
4. Cultural significance and traditional meaning
5. Difficulty level and estimated time to complete
6. Tips for beginners

Format your response in a clear, structured json that would help someone actually create this kolam pattern.
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      prompt: prompt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating kolam pattern:", error);
    res.status(500).json({
      error: "Failed to generate kolam pattern",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
