import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import styles from "../../styles/Recommendations.module.css";
import FullRecommendations from "../recommendations/FullRecommendations";

export default function Recommendations() {
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadRecommendations = async (uid) => {
    try {
      setLoading(true);
      const ref = doc(db, "users", uid, "recommendations", "latest");
      const snap = await getDoc(ref);

      setRecs(snap.exists() ? snap.data() : null);
    } catch (err) {
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAI = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_CLOUD_FUNC_URL}/generateRecommendations`;
      await axios.post(url, { uid: user.uid });

      setTimeout(() => loadRecommendations(user.uid), 1500);
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      alert("Failed to generate recommendations. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadRecommendations(currentUser.uid);
      } else {
        setUser(null);
        setRecs(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Generating your personalized roadmap...</p>
      </div>
    );
  }

  if (!recs) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <h1 className={styles.emptyTitle}>Ready to Launch Your Career?</h1>
          <p className={styles.emptySubtitle}>
            Get AI-powered recommendations tailored to your skills and goals
          </p>
          <button
            onClick={refreshAI}
            disabled={!user}
            className={styles.ctaButton}
          >
            Generate My Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <FullRecommendations
      recs={recs}
      refreshAI={refreshAI}
      user={user}
    />
  );
}
