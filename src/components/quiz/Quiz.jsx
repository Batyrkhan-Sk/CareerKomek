import { useState } from "react";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { generateQuiz, aggregateAnswers } from "../../services/quizService";
import ProfileForm from "./steps/ProfileForm";
import Loading from "./steps/Loading";
import QuizStep from "./steps/QuizStep";
import QuizComplete from "./steps/QuizComplete";

const QuizSteps = {
  FORM: "form",
  LOADING: "loading",
  QUIZ: "quiz",
  COMPLETE: "complete",
};

export default function Quiz() {
  const [step, setStep] = useState(QuizSteps.FORM);
  const [profile, setProfile] = useState({
    skills: "",
    interests: "",
    academicFocus: "",
    careerGoal: "",
    experienceLevel: "beginner",
  });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleFormSubmit = async (profileData) => {
    setStep(QuizSteps.LOADING);
    try {
      const quizQuestions = await generateQuiz(profileData);
      setProfile(profileData);
      setQuestions(quizQuestions);
      setStep(QuizSteps.QUIZ);
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz.");
      setStep(QuizSteps.FORM);
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
      const nextAnswer = answers[currentQ + 1];
      setSelectedOption(nextAnswer ? nextAnswer.answer : null);
    } else {
      setStep(QuizSteps.COMPLETE);
    }
  };


  const handleBack = () => {
  setCurrentQ((prev) => prev - 1);

  const prevAnswer = answers[answers.length - 1];
  setSelectedOption(prevAnswer ? prevAnswer.answer : null);

  setAnswers((prev) => prev.slice(0, -1));
};


  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Sign in first.");

    const finalProfile = aggregateAnswers(profile, answers);

    try {
      await setDoc(doc(db, "users", user.uid, "profile", "info"), finalProfile, { merge: true });
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }
  };

  switch (step) {
    case QuizSteps.FORM:
      return <ProfileForm profile={profile} setProfile={setProfile} onSubmit={handleFormSubmit} />;
    case QuizSteps.LOADING:
      return <Loading message="Generating your personalized quiz..." />;
    case QuizSteps.QUIZ:
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
    case QuizSteps.COMPLETE:
      return <QuizComplete profile={profile} answers={answers} onSave={handleSave} />;
    default:
      return null;
  }
}