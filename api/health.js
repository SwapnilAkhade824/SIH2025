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

  const hasApiKey = !!process.env.GEMINI_API_KEY;

  res.json({
    status: "OK",
    message: "Kolam Enlighten API is running",
    apiKeyConfigured: hasApiKey,
    endpoints: {
      health: "/api/health",
      generate: "/api/generate", 
      analyze: "/api/analyze"
    },
    timestamp: new Date().toISOString(),
  });
}
