import { Search } from "lucide-react";
import styles from "./WhatWeOffer.module.css";
import { useState } from "react";

const WhatWeOffer = () => {
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 1,
      title: "Sweets",
      description: "Traditional Indian delicacies",
      image:
        "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop",
      accentColor: "var(--primary-600)",
    },
    {
      id: 2,
      title: "Confectionary",
      description: "Finest chocolates & candies",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop",
      accentColor: "var(--secondary-600)",
    },
    {
      id: 3,
      title: "Bakery",
      description: "Freshly baked goods",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop",
      accentColor: "var(--primary-500)",
    },
    {
      id: 4,
      title: "Dry Fruits",
      description: "Premium nuts & dried fruits",
      image:
        "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&auto=format&fit=crop",
      accentColor: "var(--accent-600)",
    },
    {
      id: 5,
      title: "Namkeen",
      description: "Savory Indian snacks",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop",
      accentColor: "var(--secondary-500)",
    },
    {
      id: 6,
      title: "Cakes",
      description: "Custom & celebration cakes",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop",
      accentColor: "var(--primary-400)",
    },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={`${styles.whatWeOffer} section`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>What We Offer</h2>
          <p className={`lead ${styles.subtitle}`}>
            Discover our premium selection of traditional Indian delicacies and
            modern confectioneries
          </p>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className={styles.searchInput}
            />
            {search && (
              <button
                className={styles.clearButton}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className={styles.categoriesWrapper}>
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryTile}
              style={
                {
                  "--bg-image": `url(${category.image})`,
                  "--accent-color": category.accentColor,
                } as React.CSSProperties
              }
            >
              <div className={styles.tileOverlay} />
              <div className={styles.tileContent}>
                <h3 className={styles.tileTitle}>{category.title}</h3>
                <p className={styles.tileDescription}>{category.description}</p>
                <button
                  className={`${styles.exploreButton} btn btn-primary`}
                  onClick={() => console.log(`Exploring ${category.title}`)}
                >
                  Explore Now
                </button>
              </div>
              <div className={styles.tileGlow} />
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className={styles.noResults}>
            <p>No categories found matching "{search}"</p>
            <button className="btn btn-secondary" onClick={() => setSearch("")}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeOffer;
