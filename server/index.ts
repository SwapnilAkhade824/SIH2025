import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function to try model with fallback
async function tryModelWithFallback(prompt: string, imageData?: any) {
  let model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  let modelUsed = "gemini-2.5-pro";
  
  try {
    const content = imageData ? [prompt, imageData] : prompt;
    const result = await model.generateContent(content);
    const response = await result.response;
    return { text: response.text(), modelUsed };
  } catch (error: any) {
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

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Kolam Enlighten API is running" });
});

// Generate kolam patterns endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

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

    const { text, modelUsed } = await tryModelWithFallback(enhancedPrompt);

    res.json({
      success: true,
      response: text,
      prompt: prompt,
      modelUsed: modelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating kolam pattern:", error);
    res.status(500).json({
      error: "Failed to generate kolam pattern",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Analyze kolam image endpoint
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Convert image buffer to base64
    const imageBase64 = req.file.buffer.toString("base64");

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
        mimeType: req.file.mimetype,
        data: imageBase64,
      },
    };

    const { text, modelUsed } = await tryModelWithFallback(prompt, imageData);

    res.json({
      success: true,
      analysis: text,
      filename: req.file?.originalname,
      fileSize: req.file?.size,
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
});

// Error handling middleware
app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", error);
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 10MB." });
      }
    }
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Kolam Enlighten API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Generate endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`🔍 Analyze endpoint: http://localhost:${PORT}/api/analyze`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
    console.warn("   Please create a .env file with your Gemini API key");
  } else {
    console.log("✅ Gemini API key configured");
  }
});
