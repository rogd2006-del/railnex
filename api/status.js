module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

  res.status(200).json({
    status: "ACTIVE",
    system: "RAILNEX AI",
    problemStatement: "SIH26027",
    team: "CODELIKE_67",
    corridor: "NDLS - GZB - CNB (435 KM)",
    hasGeminiKey: Boolean(geminiApiKey),
    platform: "Vercel Serverless",
    timestamp: new Date().toISOString()
  });
};
