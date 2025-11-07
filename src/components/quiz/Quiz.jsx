import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import axios from "axios";
import Modal from "../modal/Modal";
import { generateQuiz } from "../../services/quizService";
import ProfileForm from "./steps/ProfileForm";
import Loading from "./steps/Loading";
import QuizStep from "./steps/QuizStep";
import QuizComplete from "./steps/QuizComplete";
import { QUIZ_STEPS } from "../../const/quizSteps";
import useQuizState from "../../hooks/useQuizState";
import { INITIAL_PROFILE } from "../../const/initialProfile";

export default function Quiz() {
  const {
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
  } = useQuizState(INITIAL_PROFILE);

  const [modalMessage, setModalMessage] = useState("");

  const handleFormSubmit = async (profileData) => {
    setStep(QUIZ_STEPS.LOADING);
    try {
      const quizQuestions = await generateQuiz(profileData);
      setProfile(profileData);
      setQuestions(quizQuestions);
      setCurrentQ(0);
      setAnswers([]);
      setSelectedOption(null);
      setStep(QUIZ_STEPS.QUIZ);
    } catch (err) {
      console.error(err);
      setModalMessage("Failed to generate quiz.");
      setStep(QUIZ_STEPS.FORM);
    }
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const existingAnswer = answers.find((a, i) => i === currentQ);
    if (!existingAnswer) {
      setAnswers((prev) => [
        ...prev,
        {
          question: questions[currentQ].question,
          answer: selectedOption,
          category: questions[currentQ].category,
        },
      ]);
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(answers[currentQ + 1]?.answer || null);
    } else {
      setStep(QUIZ_STEPS.COMPLETE);
    }
  };

  const handleBack = () => {
    if (currentQ === 0) return;
    setCurrentQ((prev) => prev - 1);
    setSelectedOption(answers[currentQ - 1]?.answer || null);
    setAnswers((prev) => prev.slice(0, -1));
  };

  const handleSave = async (finalProfile) => {
    const user = auth.currentUser;
    if (!user) {
      setModalMessage("Sign in first.");
      return false;
    }

    try {
      await setDoc(doc(db, "users", user.uid, "profile", "info"), finalProfile, { merge: true });
      console.log("Profile saved successfully for UID:", user.uid);

      const url = `${import.meta.env.VITE_CLOUD_FUNC_URL}/generateRecommendations`;
      console.log("Sending request to:", url, "with UID:", user.uid);
      const response = await axios.post(url, { uid: user.uid });

      console.log("Recommendations generated:", response.data);
      resetQuiz();
      return true;
    } catch (err) {
      console.error("Save or recommendation error:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
      }
      setModalMessage("Failed to save or generate recommendations.");
      return false;
    }
  };

  return (
    <>
      {(() => {
        switch (step) {
          case QUIZ_STEPS.FORM:
            return <ProfileForm profile={profile} setProfile={setProfile} onSubmit={handleFormSubmit} />;
          case QUIZ_STEPS.LOADING:
            return <Loading message="Generating your personalized quiz..." />;
          case QUIZ_STEPS.QUIZ:
            return (
              <QuizStep
                question={questions[currentQ]}
                current={currentQ}
                total={questions.length}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                onNext={handleNext}
                onBack={currentQ > 0 ? handleBack : null}
              />
            );
          case QUIZ_STEPS.COMPLETE:
            return <QuizComplete profile={profile} answers={answers} onSave={handleSave} />;
          default:
            return null;
        }
      })()}

      <Modal message={modalMessage} onClose={() => setModalMessage("")} />
    </>
  );
}