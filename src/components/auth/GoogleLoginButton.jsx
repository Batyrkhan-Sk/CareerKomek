import { useState } from "react";
import { auth, provider, db } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Modal from "../modal/Modal";
import styles from "./styles/GoogleLoginButton.module.css";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
      setModalMessage("Sign-in error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={styles.googleButton}
      >
        <FcGoogle className={styles.icon} />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>

      <Modal message={modalMessage} onClose={() => setModalMessage("")} />
    </>
  );
}