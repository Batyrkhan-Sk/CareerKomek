const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.generateRecommendations = onRequest(
   { cors: true, secrets: [geminiApiKey] },
  async (req, res) => {
    logger.info("generateRecommendations called");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    const GEMINI_API_KEY = geminiApiKey.value();
    if (!GEMINI_API_KEY) {
      logger.error("Missing GEMINI_API_KEY secret");
      return res.status(500).json({ error: "Server config error" });
    }

    try {
      const db = admin.firestore();
      const profileDoc = await db
        .collection("users")
        .doc(uid)
        .collection("profile")
        .doc("info")
        .get();

      if (!profileDoc.exists) {
        return res.status(404).json({ error: "Profile not found" });
      }

      const profile = profileDoc.data();
      const recommendations = await generateCareerRecommendations(GEMINI_API_KEY, profile);

      await db
        .collection("users")
        .doc(uid)
        .collection("recommendations")
        .doc("latest")
        .set({
          ...recommendations,
          generatedAt: FieldValue.serverTimestamp()
        });


      return res.status(200).json(recommendations);
    } catch (error) {
      logger.error("Error generating recommendations:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

async function generateCareerRecommendations(apiKey, profile) {
const prompt = `You are a career advisor. Based on the user's profile, provide personalized career recommendations.

User Profile:
- Skills: ${profile.skills?.join(", ") || "None specified"}
- Interests: ${profile.interests?.join(", ") || "None specified"}
- Career Goal: ${profile.careerGoal || "Not specified"}
- Experience Level: ${profile.experienceLevel || "beginner"}
- Academic Focus: ${profile.academicFocus || "Not specified"}

Provide comprehensive recommendations in the following strict JSON structure:

{
  "careerPaths": [
    {
      "title": "Career path title",
      "description": "Why this fits their profile",
      "salaryMinKZT": 0,
      "salaryMaxKZT": 0,
      "salaryCurrency": "KZT",
      "salaryInfo": "Short explanation of salary conditions in Kazakhstan",
      "demandLevel": "high/medium/low"
    }
  ],
  "skillGaps": [
    {
      "skill": "Skill name",
      "priority": "high/medium/low",
      "reason": "Why they need this"
    }
  ],
  "learningRoadmap": [
    {
      "phase": "Phase name",
      "topics": ["Topic 1", "Topic 2"],
      "resources": [
        {
          "name": "Resource name",
          "type": "course/book/tutorial/certification",
          "url": "https://example.com (if known)",
          "isFree": true
        }
      ]
    }
  ],
  "immediateActions": [
    "Actionable step 1",
    "Actionable step 2",
    "Actionable step 3"
  ]
}

Important rules:
- Salaries MUST be in Kazakhstani Tenge (KZT).
- Use this salary guideline:
  - Junior tech roles: 2000000–12000000 / year
  - Mid tech roles: 12000000–24000000 / year
  - Senior tech roles: 24000000+ / year
- Salary values must be pure integers (no text, no symbols).
- Use only well-known real resources:
  (Coursera, Udemy, freeCodeCamp, Harvard CS50, MDN Web Docs, Khan Academy)
- Do NOT include unverified YouTube playlists.
- For YouTube, only use official, well-known channels:
  (Traversy Media, Net Ninja, Fireship, Mosh, etc.)
- If unsure about URL correctness → omit the URL field.
- Include instruction to verify salary ranges on LinkedIn Jobs or hh.kz.
- Return only valid JSON. No explanations or backticks.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1) {
    text = text.substring(jsonStart, jsonEnd + 1);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    logger.error("Failed to parse recommendations:", text.substring(0, 500));
    return {
      careerPaths: [],
      skillGaps: [],
      learningRoadmap: [],
      immediateActions: []
    };
  }
}