import { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";
import styles from "./styles/AuthForm.module.css";

export default function AuthForm({ mode = "login" }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const action =
        mode === "register"
          ? createUserWithEmailAndPassword
          : signInWithEmailAndPassword;

      const result = await action(auth, email, password);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const existing = await getDoc(ref);
      if (!existing.exists()) {
        await setDoc(ref, {
          name: user.displayName || "",
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }

      navigate("/home");
    } catch (err) {
      setModalMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            required
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading
            ? "Processing..."
            : mode === "register" ? "Create Account" : "Sign In"}
        </button>
      </form>

      <Modal message={modalMessage} onClose={() => setModalMessage("")} />
    </>
  );
}
