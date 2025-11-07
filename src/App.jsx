import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Auth from "./components/auth/Auth";
import Home from "./components/home/Home";
import Quiz from "./components/quiz/Quiz";
import RecommendationsWrapper from "./components/recommendations/RecommendationsWrapper";
import ResumeUpload from "./components/resume/ResumeUpload";
import InternshipMap from "./components/internships/InternshipMap";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./common/navbar/Navbar";
import GlobalLoader from "./common/loader/GlobalLoader";
import "./App.css";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <GlobalLoader message="Loading Career Bot..." />;
  }

  return (
    <div>
      {user && <Navbar />}

      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/home" replace /> : <Auth />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
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
              <RecommendationsWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
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

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  );
}