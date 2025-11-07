const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.analyzeResume = onRequest(
  { cors: true, secrets: [geminiApiKey] },
  async (req, res) => {
    logger.info("analyzeResume called");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Missing resumeText" });
    }

    const GEMINI_API_KEY = geminiApiKey.value();
    if (!GEMINI_API_KEY) {
      logger.error("Missing GEMINI_API_KEY");
      return res.status(500).json({ error: "Server configuration error" });
    }

    try {
      const prompt = buildPrompt(resumeText);
      const analysis = await callGeminiAPI(GEMINI_API_KEY, prompt);

      logger.info("Resume analysis complete");
      return res.status(200).json(analysis);
    } catch (error) {
      logger.error("Error analyzing resume:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

function buildPrompt(text) {
  return `
You are an ATS (Applicant Tracking System). Analyze the following resume text:

---
${text}
---

Strict JSON output only:

{
  "atsScore": 0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "missingKeywords": ["e.g. teamwork, SQL, leadership"],
  "formatIssues": [
    { "issue": "No bullet points", "impact": "medium" }
  ]
}

Rules:
- atsScore from 0-100
- Focus on clarity, keywords, structure, metrics
- Identify weak verbs and generic statements
- Spot grammar or formatting issues
- No markdown, no code blocks, no explanations
`;
}

async function callGeminiAPI(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  });

  let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    logger.error("JSON parse failed:", text.substring(0, 300));
    throw new Error("Failed to parse ATS analysis");
  }
}
