import styles from './GlobalLoader.module.css';

export default function GlobalLoader({ message = "Loading..." }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}