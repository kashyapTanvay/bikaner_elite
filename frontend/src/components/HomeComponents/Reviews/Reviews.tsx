import styles from "./Reviews.module.css";

export default function Reviews() {
  return (
    <section className={styles.reviews}>
      <h2>Reviews</h2>
      <div className={styles.grid}>
        <div className={styles.card}>★★★★★ Amazing Taste!</div>
        <div className={styles.card}>★★★★★ Authentic Flavours!</div>
        <div className={styles.card}>★★★★★ Best Sweets Ever!</div>
      </div>
    </section>
  );
}
