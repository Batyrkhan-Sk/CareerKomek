const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.generateQuiz = onRequest(
  { cors: true, secrets: [geminiApiKey] },
  async (req, res) => {
    logger.info("generateQuiz called");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "Missing profile" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      logger.error("Missing GEMINI_API_KEY secret");
      return res.status(500).json({ error: "Server config error" });
    }

    try {
      const prompt = buildPrompt(profile);
      const questions = await callGeminiAPI(GEMINI_API_KEY, prompt);

      if (!questions || questions.length === 0) {
        logger.error("No questions generated");
        return res.status(500).json({ error: "Failed to generate quiz questions" });
      }

      logger.info(`Returning ${questions.length} questions`);
      return res.status(200).json(questions);
    } catch (error) {
      logger.error("Error in generateQuiz:", {
        message: error.message,
        stack: error.stack,
        details: error.response?.data || error
      });
      return res.status(500).json({ error: error.message });
    }
  }
);

function buildPrompt(profile) {
  return `You are a career assessment expert. Generate exactly 10 career assessment questions based on the user's profile.

User Profile:
- Skills: ${profile.skills || "general"}
- Interests: ${profile.interests || "general"}
- Career Goal: ${profile.careerGoal || "exploring options"}
- Experience Level: ${profile.experienceLevel || "beginner"}

Requirements:
1. Each question must have exactly 3-4 options
2. Questions should assess different aspects: skills, interests, work_style, and career readiness
3. Options should have both "text" and "value" fields
4. Return ONLY valid JSON, no explanation or markdown

Output Format (return this exact structure):
[
  {
    "question": "Clear, specific question text here?",
    "options": [
      { "text": "Option A description", "value": "short_value_a" },
      { "text": "Option B description", "value": "short_value_b" },
      { "text": "Option C description", "value": "short_value_c" }
    ],
    "category": "skills"
  }
]

Generate 10 questions now. Return only the JSON array. Do not stop mid-JSON. Finish all brackets and text completely.
`;
}

async function callGeminiAPI(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  });

  let text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  logger.info("Raw Gemini response (first 200 chars): " + text.substring(0, 200));

  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const startIndex = text.indexOf("[");
  const endIndex = text.lastIndexOf("]");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("No JSON array found in Gemini response");
  }

  const jsonString = text.slice(startIndex, endIndex + 1);

  logger.info("Extracted JSON (first 200 chars): " + jsonString.substring(0, 200));

  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Parsed value is not a valid array");
    }

    return parsed;
  } catch (err) {
    logger.error("JSON parse failed:", {
      error: err.message,
      jsonSnippet: jsonString.substring(0, 500),
    });

    throw new Error("JSON parse error");
  }
}
