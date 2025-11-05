import { useEffect, useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            name: u.displayName,
            email: u.email,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    return unsub;
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/quiz");
    } catch (e) {
      console.error(e);
      alert("Sign-in error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => { await signOut(auth); };

  return (
    <div style={{ padding: 20 }}>
      {!user ? (
        <>
          <h2>Welcome to CareerBot AI</h2>
          <p>Your personal smart career advisor</p>
          <button onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </>
      ) : (
        <>
          <h3>Hello, {user.displayName}</h3>
          <p>{user.email}</p>
          <button onClick={logout}>Sign out</button>
          <button
            style={{ marginLeft: 10 }}
            onClick={() => navigate("/quiz")}
          >
            Continue Quiz
          </button>
        </>
      )}
    </div>
  );
}
