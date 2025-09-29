import { GoogleGenerativeAI } from "@google/generative-ai";
import formidable from "formidable";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to try model with fallback
async function tryModelWithFallback(prompt, imageData) {
  let model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  let modelUsed = "gemini-2.5-pro";
  
  try {
    const content = imageData ? [prompt, imageData] : prompt;
    const result = await model.generateContent(content);
    const response = await result.response;
    return { text: response.text(), modelUsed };
  } catch (error) {
    // Check if error is due to model overload or capacity issues
    if (error?.message?.includes('overload') || 
        error?.message?.includes('capacity') || 
        error?.message?.includes('quota') ||
        error?.status === 429 ||
        error?.status === 503) {
      
      console.log('Pro model overloaded, falling back to Flash model');
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      modelUsed = "gemini-2.5-flash";
      
      const content = imageData ? [prompt, imageData] : prompt;
      const result = await model.generateContent(content);
      const response = await result.response;
      return { text: response.text(), modelUsed };
    }
    
    // Re-throw if it's not a capacity issue
    throw error;
  }
}

// Parse form data
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => mimetype && mimetype.startsWith('image/'),
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

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

    // Parse the uploaded file
    const { files } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    
    console.log('Uploaded file structure:', JSON.stringify(imageFile, null, 2));
    
    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Read the file and convert to base64
    // Handle both old and new formidable property names
    const filePath = imageFile.filepath || imageFile.path;
    console.log('File path:', filePath);
    
    if (!filePath) {
      console.error('No valid file path found. Available properties:', Object.keys(imageFile));
      return res.status(400).json({ 
        error: "Invalid file upload - no file path found",
        debug: Object.keys(imageFile)
      });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const imageBase64 = fileBuffer.toString('base64');

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

    const imageData = {
      inlineData: {
        mimeType: imageFile.mimetype,
        data: imageBase64,
      },
    };

    const { text, modelUsed } = await tryModelWithFallback(prompt, imageData);

    res.json({
      success: true,
      analysis: text,
      filename: imageFile.originalFilename || imageFile.name || 'uploaded-image',
      fileSize: imageFile.size,
      modelUsed: modelUsed,
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
