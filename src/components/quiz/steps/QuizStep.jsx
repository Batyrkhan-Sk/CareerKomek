import { ProgressBar, OptionButton } from "../QuizComponents";
import styles from "../styles/QuizStep.module.css";

export default function QuizStep({ question, current, total, selectedOption, setSelectedOption, onNext, onBack }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Personalized Quiz</h2>
      <ProgressBar current={current} total={total} />

      <h3 className={styles.questionTitle}>{question.question}</h3>
      <div className={styles.optionsContainer}>
        {question.options.map((option, i) => (
          <OptionButton
            key={i}
            text={option.text}
            onClick={() => setSelectedOption(option.text)}
            selected={selectedOption === option.text}
          />
        ))}
      </div>

      <div className={styles.buttonGroup}>
        {onBack ? (
          <button onClick={onBack} className={styles.buttonSecondary}>Back</button>
        ) : (
          <button className={`${styles.buttonSecondary} ${styles.hiddenButton}`}>Back</button>
        )}

        <button onClick={onNext} disabled={!selectedOption} className={styles.button}>
          {current < total - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
}