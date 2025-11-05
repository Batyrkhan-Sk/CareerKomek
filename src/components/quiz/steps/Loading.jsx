import { LoadingSpinner } from "../QuizComponents";
import styles from "../../../styles/Quiz.module.css";

export default function Loading({ message }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Please wait...</h2>
      <LoadingSpinner message={message} />
    </div>
  );
}
