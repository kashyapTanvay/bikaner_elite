import React from "react";
import { Link } from "react-router-dom";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      title: "Traditional Sweets",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800",
      category: "Sweets",
      description: "Authentic Indian sweets made with pure ghee",
      tall: false,
      wide: true,
    },
    {
      id: 2,
      title: "Artisan Breads",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800",
      category: "Bakery",
      description: "Freshly baked breads daily",
      tall: true,
      wide: false,
    },
    {
      id: 3,
      title: "Custom Cakes",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800",
      category: "Cakes",
      description: "Design your dream cake",
      tall: false,
      wide: false,
    },
    {
      id: 4,
      title: "Veg Restaurant",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800",
      category: "Restaurant",
      description: "Fine vegetarian dining",
      tall: true,
      wide: false,
    },
    {
      id: 5,
      title: "Festive Specials",
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800",
      category: "Seasonal",
      description: "Special treats for celebrations",
      tall: false,
      wide: false,
    },
    {
      id: 6,
      title: "Dessert Platters",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800",
      category: "Desserts",
      description: "Perfect for parties",
      tall: false,
      wide: true,
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="text-center">Our Specialties</h2>
          <p className="lead text-center">
            Discover our handcrafted creations made with passion and tradition
          </p>
        </div>

        <div className={styles.masonryGrid}>
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className={`${styles.masonryItem} ${
                product.tall ? styles.tall : ""
              } ${product.wide ? styles.wide : ""}`}
            >
              <div
                className={styles.productCard}
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${product.image})`,
                }}
              >
                <div className={styles.productContent}>
                  <span className={styles.productCategory}>
                    {product.category}
                  </span>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                  <Link
                    to={`/category/${product.category.toLowerCase()}`}
                    className={styles.productLink}
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
