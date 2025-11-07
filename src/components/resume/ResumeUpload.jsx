import { useState } from "react";
import { getAuth } from "firebase/auth";
import pdfWorker from "../../pdf/pdfWorker";
import * as pdfjsLib from "pdfjs-dist";
import styles from "./ResumeUpload.module.css";
import {
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiKey,
  FiAlertTriangle
} from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const auth = getAuth();

  const extractTextFromPDF = async (pdfData) => {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(" ");
      fullText += "\n" + strings;
    }
    return fullText;
  };

  const handleUpload = async () => {
    if (!file) return setError("Please upload a PDF file.");

    if (!auth.currentUser) return setError("Please log in first.");

    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const resumeText = await extractTextFromPDF(arrayBuffer);

      const response = await fetch(
        import.meta.env.VITE_CLOUD_FUNC_URL + "/analyzeResume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAnalysis(result);
      } else {
        setError(result.error || "Analysis failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to process resume. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          ENHANCE YOUR <span className={styles.titleHighlight}>RESUME</span>
        </h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.uploadSection}>
        <h2 className={styles.sectionTitle}>
          <div className={styles.icon}>
            <FiFileText />
          </div>
          Resume Analysis
        </h2>

        <div className={styles.uploadBox}>
          <input
            type="file"
            id="resumeFile"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.fileInput}
          />
          <label htmlFor="resumeFile" className={styles.fileLabel}>
            Choose PDF File
          </label>
          {file && <div className={styles.fileName}>Selected: {file.name}</div>}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={styles.analyzeButton}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {analysis && (
          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>Resume Analysis Results</h3>

            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>ATS Score</div>
              <div className={styles.scoreValue}>{analysis.atsScore}/100</div>
            </div>

            <div className={styles.analysisGrid}>
              <Section
                title="Strengths"
                list={analysis.strengths}
                type="strengths"
                icon={<FiCheckCircle />}
              />
              <Section
                title="Weaknesses"
                list={analysis.weaknesses}
                type="weaknesses"
                icon={<FiXCircle />}
              />
              <Section
                title="Suggestions"
                list={analysis.suggestions}
                type="suggestions"
                icon={<FaLightbulb />}
              />
              <Section
                title="Missing Keywords"
                list={analysis.missingKeywords}
                type="keywords"
                icon={<FiKey />}
              />
            </div>

            {analysis.formatIssues?.length > 0 && (
              <div className={styles.formatIssues}>
                <div className={styles.formatTitle}>
                  <FiAlertTriangle /> Formatting Issues
                </div>
                {analysis.formatIssues.map((issue, idx) => (
                  <div key={idx} className={styles.issueItem}>
                    <div className={styles.issueText}>{issue.issue}</div>
                    <div className={styles.issueImpact}>Impact: {issue.impact}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, list, type, icon }) {
  if (!list?.length) return null;

  return (
    <div className={`${styles.analysisCard} ${styles[type]}`}>
      <div className={`${styles.cardTitle} ${styles[type]}`}>
        <span>{icon}</span>
        {title}
      </div>
      <ul className={styles.list}>
        {list.map((item, idx) => (
          <li key={idx} className={styles.listItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
}