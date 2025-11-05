import axios from "axios";
import { extractKeywords } from "../utils/textHelpers";

export async function generateQuiz(profile) {
  const url = `${import.meta.env.VITE_CLOUD_FUNC_URL}/generateQuiz`;

  const response = await axios.post(url, { profile }, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data;
}

export function aggregateAnswers(initialProfile, quizAnswers) {
  const skills = new Set(
    initialProfile.skills.split(",").map(s => s.trim()).filter(Boolean)
  );
  const interests = new Set(
    initialProfile.interests.split(",").map(i => i.trim()).filter(Boolean)
  );

  quizAnswers.forEach(answer => {
    if (answer.category === "skills" && answer.answer.text) {
      const keywords = extractKeywords(answer.answer.text);
      keywords.forEach(kw => skills.add(kw));
    }
    if (answer.category === "interests" && answer.answer.text) {
      const keywords = extractKeywords(answer.answer.text);
      keywords.forEach(kw => interests.add(kw));
    }
  });

  return {
    skills: Array.from(skills),
    interests: Array.from(interests),
    academicFocus: initialProfile.academicFocus,
    careerGoal: initialProfile.careerGoal,
    experienceLevel: initialProfile.experienceLevel,
    updatedAt: new Date().toISOString()
  };
}