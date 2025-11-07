import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import styles from "../styles/QuizComplete.module.css";
import { aggregateAnswers } from "../../../services/quizService";

export default function QuizComplete({ profile, answers, onSave }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState(null);

  const final = aggregateAnswers(profile, answers);

  useEffect(() => {
    async function saveAndRedirect() {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        console.log("Saving quiz results for user:", currentUser.uid);

        const success = await onSave(final);

        if (!success) {
          throw new Error("Failed to save profile");
        }

        console.log("Profile and recommendations saved successfully");

        setSaving(false);
        navigate("/recommendations");

      } catch (err) {
        console.error("Error saving quiz results:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || "Failed to save results");
        setSaving(false);
      }
    }
    saveAndRedirect();
  }, []);

  return (
    <div className={styles.container}>
      {saving && !error ? (
        <>
          <h2 className={styles.title}>Analyzing Your Profile…</h2>
          <div className={styles.loader}></div>
        </>
      ) : error ? (
        <>
          <h2 className={styles.title}>Oops! Something went wrong</h2>
          <p className={styles.errorText}>{error}</p>
          <button
            className={styles.button}
            onClick={() => navigate("/profile")}
          >
            Return to Profile
          </button>
        </>
      ) : (
        <>
          <h2 className={styles.title}>Well done!</h2>
          <p className={styles.resultItem}>
            Your personalized career recommendations are ready.
            View them now in the recommendations section.
          </p>

          <button
            className={styles.button}
            onClick={() => navigate("/recommendations")}
          >
            View Recommendations
          </button>
        </>
      )}
    </div>
  );
}