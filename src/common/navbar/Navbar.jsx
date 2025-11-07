import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/home" className={styles.navLink}>Home</Link>
      <Link to="/quiz" className={styles.navLink}>Quiz</Link>
      <Link to="/resume" className={styles.navLink}>Resume</Link>
      <Link to="/recommendations" className={styles.navLink}>Recommendations</Link>
      <Link to="/map" className={styles.navLink}>Map</Link>
      <button
        onClick={() => auth.signOut()}
        className={styles.logoutBtn}
      >
        Logout
      </button>
    </nav>
  );
}