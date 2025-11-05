import styles from "../../../styles/Quiz.module.css";
import { aggregateAnswers } from "../../../services/quizService";

export default function QuizComplete({ profile, answers, onSave }) {
  const final = aggregateAnswers(profile, answers);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quiz Completed</h2>

      <div className={styles.resultsCard}>
        <h3 className={styles.resultsTitle}>Your Profile:</h3>
        <p className={styles.resultItem}><span className={styles.resultLabel}>Skills:</span> {final.skills.join(", ")}</p>
        <p className={styles.resultItem}><span className={styles.resultLabel}>Interests:</span> {final.interests.join(", ")}</p>
        <p className={styles.resultItem}><span className={styles.resultLabel}>Focus:</span> {final.academicFocus}</p>
        <p className={styles.resultItem}><span className={styles.resultLabel}>Goal:</span> {final.careerGoal}</p>
      </div>

      <button onClick={onSave} className={styles.button}>Save & Get AI Recommendations</button>
    </div>
  );
}
