import { useEffect, useState } from "react";
import { LoadingSpinner } from "../QuizComponents";
import styles from "../styles/Loading.module.css";
import { CAREER_FACTS } from "../../../const/careerFacts";

export default function Loading({ message }) {
  const [factIndex, setFactIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % CAREER_FACTS.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <h2 className={styles.title}>{message || "Please wait..."}</h2>
      <LoadingSpinner />
      <p
        className={`${styles.glowText} ${fade ? styles.fadeIn : styles.fadeOut}`}
      >
        {CAREER_FACTS[factIndex]}
      </p>
    </div>
  );
}