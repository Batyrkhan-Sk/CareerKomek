import { useState } from "react";
import { FormInput } from "../QuizComponents";
import Modal from "../../modal/Modal";
import styles from "../styles/ProfileForm.module.css";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function ProfileForm({ profile, setProfile, onSubmit }) {
  const [modalMessage, setModalMessage] = useState("");

  const isFormComplete =
    profile.skills.trim() &&
    profile.interests.trim() &&
    profile.academicFocus.trim() &&
    profile.careerGoal.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setModalMessage("You must be logged in to save your profile.");
      return;
    }

    const formattedProfile = {
      ...profile,
      skills: profile.skills.split(",").map((s) => s.trim()),
      interests: profile.interests.split(",").map((i) => i.trim()),
      experienceLevel: profile.experienceLevel || "beginner",
    };

    try {
      await setDoc(
        doc(db, "users", user.uid, "profile", "info"),
        formattedProfile,
        { merge: true }
      );

      onSubmit(formattedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
      setModalMessage("Failed to save profile. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Career Assessment Quiz</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Your Skills (comma separated)"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          placeholder="React, Tensorflow, Python"
          required
        />

        <FormInput
          label="Your Interests (comma separated)"
          value={profile.interests}
          onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          placeholder="AI, Web Development"
          required
        />

        <FormInput
          label="Academic Focus"
          value={profile.academicFocus}
          onChange={(e) => setProfile({ ...profile, academicFocus: e.target.value })}
          placeholder="Machine Learning, Data Science"
          required
        />

        <FormInput
          label="Career Goal"
          value={profile.careerGoal}
          onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
          placeholder="Machine Learning Engineer"
          required
        />

        <div className={styles.formGroup}>
          <label className={styles.label}>Experience Level</label>
          <select
            value={profile.experienceLevel}
            onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
            className={styles.select}
          >
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>

        <button type="submit" className={styles.button} disabled={!isFormComplete}>
          Generate Quiz
        </button>
      </form>

      <Modal message={modalMessage} onClose={() => setModalMessage("")} />
    </div>
  );
}
