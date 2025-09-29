import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";
import fs from "fs";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Disable body parser for multipart forms
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Parse multipart form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => mimetype && mimetype.startsWith("image/"),
    });

    const [fields, files] = await form.parse(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Read file buffer
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const imageBase64 = imageBuffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Analyze this kolam pattern image and provide detailed insights in a structured JSON format.

Please return your response as a valid JSON object with the following structure:
{
  "dotAnalysis": {
    "detected": <number of dots detected>,
    "validated": <number of dots validated>,
    "precision": <precision score between 0-1>
  },
  "symmetryAnalysis": {
    "type": "<type of symmetry: radial/bilateral/rotational/etc>",
    "axisCount": <number of symmetry axes>,
    "rotationAngle": <rotation angle in degrees>,
    "score": <symmetry score between 0-1>
  },
  "complexityAnalysis": {
    "level": "<Beginner/Intermediate/Advanced>",
    "score": <complexity score 1-10>,
    "patternCount": <number of distinct patterns>,
    "entropy": <entropy value>
  },
  "mathematicalPrinciples": [
    "<principle 1>",
    "<principle 2>",
    "<principle 3>",
    "<principle 4>"
  ],
  "culturalDescription": [
    "<cultural insight point 1>",
    "<cultural insight point 2>",
    "<cultural insight point 3>",
    "<historical context>",
    "<regional significance>",
    "<traditional meaning>"
  ],
  "patternDetails": {
    "traditionalName": "<traditional name if recognizable>",
    "region": "<South Indian region>",
    "difficulty": "<time to complete>",
    "authenticity": "<High/Medium/Low>"
  }
}

Ensure all numerical values are realistic and based on actual analysis of the image. The cultural description should be an array of meaningful bullet points about the kolam's significance, history, and cultural context.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.mimetype || "image/jpeg",
          data: imageBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up temporary file
    fs.unlinkSync(imageFile.filepath);

    res.json({
      success: true,
      analysis: text,
      filename: imageFile.originalFilename || "uploaded-image",
      fileSize: imageFile.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error analyzing kolam image:", error);
    res.status(500).json({
      error: "Failed to analyze kolam image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
