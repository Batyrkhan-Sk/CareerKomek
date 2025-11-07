import styles from "./styles/Recommendations.module.css";
import { FaArrowRotateLeft } from "react-icons/fa6";

export default function RecommendationsHeader({ refreshAI, user }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Your <span className={styles.highlight}>Personalized</span>
          <br />
          Career Roadmap
        </h1>

        <button
          onClick={refreshAI}
          disabled={!user}
          className={styles.refreshBtn}
          title="Refresh Recommendations"
        >
          <FaArrowRotateLeft/>
        </button>
      </div>
    </section>
  );
}