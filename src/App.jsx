import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Auth from "./components/Auth";
import Quiz from "./components/quiz/Quiz";
import Recommendations from "./components/Recommendations";
import ResumeBuilder from "./components/ResumeBuilder";
import InternshipMap from "./components/InternshipMap";
import "./App.css";

function ProtectedRoute({ children }) {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <nav className="navbar">
        {user ? (
          <>
            <Link to="/quiz">Quiz</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/resume">Resume</Link>
            <Link to="/map">Map</Link>

            <button onClick={() => auth.signOut()}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <InternshipMap />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
