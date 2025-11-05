import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const auth = getAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    const resumeData = {
      fullName,
      education,
      experience,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "resumes", user.uid), resumeData);
    alert("Resume data saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Resume Builder</h2>

      <form onSubmit={handleSave}>
        <label>Full Name</label><br />
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "60%", marginBottom: 10 }}
        /><br />

        <label>Education</label><br />
        <textarea
          rows="3"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          style={{ width: "60%", marginBottom: 10 }}
        /><br />

        <label>Experience</label><br />
        <textarea
          rows="3"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{ width: "60%", marginBottom: 10 }}
        /><br />

        <button type="submit">Save Resume</button>
      </form>
    </div>
  );
}
