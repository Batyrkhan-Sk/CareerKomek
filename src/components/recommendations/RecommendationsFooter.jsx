import styles from "../../styles/Recommendations.module.css";

export default function RecommendationsFooter({ generatedAt }) {
  return (
    <footer className={styles.footer}>
      <p className={styles.timestamp}>
        Generated on{" "}
        {new Date(generatedAt.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </footer>
  );
}
