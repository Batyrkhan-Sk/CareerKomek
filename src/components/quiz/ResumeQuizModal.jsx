import styles from "./styles/ResumeQuizModal.module.css";

export default function ResumeQuizModal({ onContinue, onRestart }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>You stopped your quiz abruptly</h2>
        <p>Do you want to continue where you left off?</p>
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton} onClick={onContinue}>
            Yes, continue
          </button>
          <button className={styles.secondaryButton} onClick={onRestart}>
            No, start over
          </button>
        </div>
      </div>
    </div>
  );
}
