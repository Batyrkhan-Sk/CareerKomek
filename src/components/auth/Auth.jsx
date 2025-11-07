import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import GoogleLoginButton from "./GoogleLoginButton";
import styles from "./styles/Auth.module.css";

export default function Auth() {
  const [user, loading] = useAuthState(auth);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  if (loading) {
    return <div className={styles.loading}>Checking authentication...</div>;
  }

  if (user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {mode === "login" ? (
              <>WELCOME <span className={styles.highlight}>BACK</span></>
            ) : (
              <>CREATE <span className={styles.highlight}>ACCOUNT</span></>
            )}
          </h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Sign in to continue your career journey"
              : "Start your personalized career roadmap"}
          </p>
        </div>

        <div className={styles.formSection}>
          <AuthForm mode={mode} />

          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          <GoogleLoginButton />
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {mode === "login" ? "New to CareerKomek?" : "Already have an account?"}
            <span
              className={styles.link}
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create Account" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
