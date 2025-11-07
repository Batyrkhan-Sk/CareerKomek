import { useState, useEffect } from "react";
import { QUIZ_STEPS } from "../const/quizSteps";

const LOCAL_STORAGE_KEY = "careerHelperQuiz";

export default function useQuizState(initialProfile) {
  const [step, setStep] = useState(QUIZ_STEPS.FORM);
  const [profile, setProfile] = useState(initialProfile);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      setProfile(state.profile || initialProfile);
      setQuestions(state.questions || []);
      setCurrentQ(state.currentQ || 0);
      setAnswers(state.answers || []);
      setStep(state.step || QUIZ_STEPS.FORM);
      setSelectedOption(state.answers?.[state.currentQ]?.answer || null);
    }
  }, [initialProfile]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ profile, questions, currentQ, answers, step })
    );
  }, [profile, questions, currentQ, answers, step]);

  const resetQuiz = () => {
    setStep(QUIZ_STEPS.FORM);
    setProfile(initialProfile);
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return {
    step,
    setStep,
    profile,
    setProfile,
    questions,
    setQuestions,
    currentQ,
    setCurrentQ,
    answers,
    setAnswers,
    selectedOption,
    setSelectedOption,
    resetQuiz,
  };
}
