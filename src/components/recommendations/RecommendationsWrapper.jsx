import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import Modal from "../modal/Modal";
import styles from "./styles/Recommendations.module.css";
import FullRecommendations from "../recommendations/FullRecommendations";

export default function RecommendationsWrapper() {
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const loadRecommendations = async (uid) => {
    try {
      setLoading(true);
      const ref = doc(db, "users", uid, "recommendations", "latest");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setRecs(snap.data());
      } else {
        setRecs(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setModalMessage("Failed to load recommendations.");
      setLoading(false);
    }
  };

  const refreshAI = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_CLOUD_FUNC_URL}/generateRecommendations`;

      // ✅ FIX: Wait for and use the response from Cloud Function
      const response = await axios.post(url, { uid: user.uid });

      // ✅ FIX: Use the returned data immediately
      const recommendations = response.data;

      // ✅ FIX: Load from Firestore to get the generatedAt timestamp
      await loadRecommendations(user.uid);

      setLoading(false);
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      setModalMessage("Failed to generate recommendations. Please try again.");
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

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Your personalized roadmap is loading...</p>
        </div>
      ) : !recs ? (
        <div className={styles.emptyContainer}>
          <h1 className={styles.emptyTitle}>Ready to Launch Your Career?</h1>
          <p className={styles.emptySubtitle}>Get your personalized roadmap</p>
          <button onClick={refreshAI} disabled={!user} className={styles.ctaButton}>
            Generate My Roadmap
          </button>
        </div>
      ) : recs.careerPaths?.length === 0 ? (
        <div className={styles.emptyContainer}>
          <h1 className={styles.emptyTitle}>Profile Incomplete</h1>
          <p className={styles.emptySubtitle}>Add more skills or interests</p>
          <button onClick={refreshAI} className={styles.ctaButton}>
            Try Again
          </button>
        </div>
      ) : (
        <FullRecommendations recs={recs} refreshAI={refreshAI} user={user} />
      )}

      <Modal message={modalMessage} onClose={() => setModalMessage("")} />
    </>
  );
}