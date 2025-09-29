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
You are a master kolam artist and analyst with 30+ years of experience in South Indian traditional art forms. Study this kolam pattern image with extreme care and precision.

CRITICAL ANALYSIS METHODOLOGY:
1. FIRST - Determine if this is actually a kolam (traditional dot-grid pattern) or another type of design
2. DOTS - Count ONLY visible dots/points that serve as grid intersections. Look for small circles, dots, or intersection markers
3. LINES - Trace the continuous lines that connect or loop around dots. Count actual line segments, not imaginary ones
4. SYMMETRY - Test by mentally folding/rotating the image. Don't assume symmetry exists
5. PATTERNS - Identify actual repeated motifs, not similar-looking elements
6. CULTURAL CONTEXT - Only reference authentic kolam traditions you can confidently identify

STEP-BY-STEP ANALYSIS PROCESS:
Step 1: Image Quality Check - Is the image clear enough for accurate analysis?
Step 2: Kolam Verification - Does this follow traditional kolam construction (dots + connecting lines)?
Step 3: Systematic Counting - Count visible elements methodically, section by section
Step 4: Pattern Recognition - Identify specific traditional motifs (lotus, geometric shapes, etc.)
Step 5: Cultural Classification - Match to known kolam types and regional styles

Return a valid JSON response with this exact structure:

{
  "dotAnalysis": {
    "detected": <count visible dots/intersection points in the grid - typically 5-25 for most kolams>,
    "validated": <count of dots that are properly connected - usually 80-95% of detected>,
    "precision": <decimal between 0.75-0.98 based on line accuracy and dot alignment>
  },
  "symmetryAnalysis": {
    "type": "<identify: 'Radial' (central point), 'Bilateral' (mirror line), 'Rotational' (rotates around center), or 'Asymmetrical'>",
    "axisCount": <number of symmetry lines: 0 for asymmetrical, 1-2 for bilateral, 4-8 for radial>,
    "rotationAngle": <degrees: 90 for 4-fold, 60 for 6-fold, 45 for 8-fold, 0 for bilateral/asymmetrical>,
    "score": <decimal 0.6-0.95 based on how well symmetry is maintained>
  },
  "complexityAnalysis": {
    "level": "<'Beginner' (simple loops, <10 dots), 'Intermediate' (moderate patterns, 10-16 dots), 'Advanced' (intricate designs, >16 dots)>",
    "score": <integer 1-10: 1-3 simple, 4-6 moderate, 7-8 complex, 9-10 masterpiece>,
    "patternCount": <count distinct motifs/shapes: circles, petals, geometric forms>,
    "entropy": <decimal 1.0-3.5: 1.0-1.5 simple, 1.5-2.5 moderate, 2.5+ complex>
  },
  "mathematicalPrinciples": [
    "<Select 3-5 from: 'Dot Matrix Foundation', 'Continuous Line Drawing', 'Geometric Symmetry', 'Fractal Patterns', 'Golden Ratio Proportions', 'Tessellation Principles', 'Topological Loops', 'Angular Relationships'>"
  ],
  "culturalDescription": [
    "<Describe the kolam's traditional purpose - daily ritual, festival, welcome, protection>",
    "<Identify regional style - Tamil Nadu, Karnataka, Andhra Pradesh characteristics>",
    "<Explain symbolic meaning - prosperity, harmony, cosmic order, spiritual significance>",
    "<Historical context - ancient tradition, temple art, household practice>",
    "<Materials traditionally used - rice flour, chalk powder, colored sand>",
    "<Time of creation - dawn ritual, festival preparation, special occasions>"
  ],
  "patternDetails": {
    "traditionalName": "<If recognizable: 'Padi Kolam', 'Pulli Kolam', 'Sikku Kolam', 'Kambi Kolam', or 'Contemporary Design'>",
    "region": "<Most likely: 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala', or 'Pan-South Indian'>",
    "difficulty": "<Realistic time: '15-30 minutes' (simple), '45-90 minutes' (moderate), '2-4 hours' (complex)>",
    "authenticity": "<'High' (traditional patterns), 'Medium' (modern interpretation), 'Low' (contemporary fusion)>"
  }
}

CRITICAL VALIDATION RULES:
- If image is unclear/blurry, set precision below 0.8 and mention in analysis
- If NOT a traditional kolam, set authenticity to "Low" and explain in cultural description
- If you cannot count dots accurately, estimate conservatively (err on lower side)
- If no clear symmetry exists, use "Asymmetrical" and axisCount: 0
- If pattern is too complex to analyze, indicate limitations in your response
- ALWAYS provide valid JSON - use null for unknown values, not placeholder text
- Include confidence level in your analysis when uncertain

RESPONSE REQUIREMENTS:
- All numbers must be realistic and based on actual observation
- Cultural descriptions must be factual, not generic statements
- If unsure about traditional name, use "Contemporary Design" or "Unidentified Pattern"
- Mention any analysis limitations or uncertainties
- Ensure JSON is perfectly formatted with proper quotes and commas
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
