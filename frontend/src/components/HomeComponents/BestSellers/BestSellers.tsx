import styles from "./BestSellers.module.css";

const products = Array(8).fill({
  name: "Food Name",
  price: "₹000",
  img: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
});

export default function BestSellers() {
  return (
    <section className={styles.section}>
      <h2>Our Bestsellers</h2>
      <div className={styles.grid}>
        {products.map((p, i) => (
          <div key={i} className={styles.card}>
            <img src={p.img} alt={p.name} />
            <h4>{p.name}</h4>
            <p>{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}
