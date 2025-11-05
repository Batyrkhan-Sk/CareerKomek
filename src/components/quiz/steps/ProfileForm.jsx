import { FormInput } from "../QuizComponents";
import styles from "../../../styles/Quiz.module.css";

export default function ProfileForm({ profile, setProfile, onSubmit }) {
  const isFormComplete =
    profile.skills.trim() &&
    profile.interests.trim() &&
    profile.academicFocus.trim() &&
    profile.careerGoal.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) {
      alert("Please fill all fields before continuing.");
      return;
    }
    onSubmit(profile);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Career Assessment Quiz</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Your Skills (comma separated)"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          placeholder="e.g., Python, Communication"
          required
        />

        <FormInput
          label="Your Interests (comma separated)"
          value={profile.interests}
          onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          placeholder="e.g., AI, Web Development"
          required
        />

        <FormInput
          label="Academic Focus"
          value={profile.academicFocus}
          onChange={(e) => setProfile({ ...profile, academicFocus: e.target.value })}
          placeholder="e.g., Computer Science"
          required
        />

        <FormInput
          label="Career Goal"
          value={profile.careerGoal}
          onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
          placeholder="e.g., Software Engineer"
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

        <button
          type="submit"
          className={styles.button}
          disabled={!isFormComplete}
        >
          Generate My Quiz
        </button>
      </form>
    </div>
  );
}
