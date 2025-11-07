import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { MdQuiz } from "react-icons/md";
import { FaLightbulb, FaFileAlt, FaMapMarkedAlt } from "react-icons/fa";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const cards = [
    {
      title: "Career Quiz",
      description: "Discover your ideal career path with our AI-powered quiz",
      icon: MdQuiz,
      path: "/quiz",
      number: "1"
    },
    {
      title: "Recommendations",
      description: "Get personalized career recommendations based on your profile",
      icon: FaLightbulb,
      path: "/recommendations",
      number: "2"
    },
    {
      title: "Resume Builder",
      description: "Create a professional resume with our smart builder",
      icon: FaFileAlt,
      path: "/resume",
      number: "3"
    },
    {
      title: "Internship Map",
      description: "Find internship opportunities near you",
      icon: FaMapMarkedAlt,
      path: "/map",
      number: "4"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          YOUR <span className={styles.highlight}>PERSONALIZED</span>
          <br />
          CAREER ROADMAP
        </h1>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.sectionHeader}>
        <div className={styles.redBar}></div>
        <h2>EXPLORE YOUR OPTIONS</h2>
      </div>

      <div className={styles.cardsContainer}>
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={styles.card}
              onClick={() => user ? navigate(card.path) : navigate("/")}
            >
              <div className={styles.cardNumber}>{card.number}</div>
              <div className={styles.cardIcon}>
                <IconComponent />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}