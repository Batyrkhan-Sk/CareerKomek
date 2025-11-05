import styles from '../../styles/QuizComponents.module.css';

export function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function LoadingSpinner({ message }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
}

export function FormInput({ label, value, onChange, placeholder, required, type = "text" }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );
}

export function OptionButton({ text, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.optionButton} ${selected ? styles.selected : ''}`}
    >
      {text}
    </button>
  );
}