import RecommendationsHeader from "./RecommendationsHeader";
import RecommendationsBody from "./RecommendationsBody";
import RecommendationsFooter from "./RecommendationsFooter";
import styles from "../../styles/Recommendations.module.css";

export default function FullRecommendations({ recs, refreshAI, user }) {
  return (
    <div className={styles.pageContainer}>
      <RecommendationsHeader refreshAI={refreshAI} user={user} />

      <div className={styles.contentWrapper}>
        <RecommendationsBody recs={recs} styles={styles} />
      </div>

      {recs.generatedAt && (
        <RecommendationsFooter generatedAt={recs.generatedAt} />
      )}
    </div>
  );
}
