import React from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
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
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w-800",
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

  const stores = [
    { name: "Main Branch", location: "Boring Road, Patna", hours: "7AM-11PM" },
    { name: "Kankarbagh", location: "Kankarbagh Colony", hours: "7AM-11PM" },
    { name: "Rajendra Nagar", location: "Near Golambar", hours: "7AM-11PM" },
    { name: "Bihar Museum", location: "Bailey Road", hours: "8AM-10PM" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1 className={`fade-in ${styles.heroTitle}`}>
              Experience the Taste of
              <span className={styles.heroHighlight}> Excellence</span>
            </h1>
            <p className={`lead slide-in-left ${styles.heroSubtitle}`}>
              Since 1985, Bikaner Elite has been Patna's premier destination for
              authentic sweets, artisanal bakery, and fine vegetarian cuisine.
            </p>
            <div className={`slide-in-right ${styles.heroButtons}`}>
              <Link to="/order" className="btn btn-accent btn-lg">
                Order Online
              </Link>
              <Link to="/menu" className="btn btn-outline btn-lg">
                View Menu
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imageWrapper}>
              {/* Placeholder for hero image */}
              <div className={styles.imagePlaceholder}>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Masonry Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="text-center">Our Specialties</h2>
            <p className="lead text-center">
              Discover our handcrafted creations made with passion and tradition
            </p>
          </div>

          <div className="masonry-grid">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className={`${styles.masonryItem} ${
                  product.tall ? "masonry-item-tall" : ""
                } ${product.wide ? "masonry-item-wide" : ""}`}
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
                      to={`/product/${product.id}`}
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

      {/* About Section */}
      <section className={`${styles.aboutSection} section bg-primary`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h2 className={styles.sectionTitle}>Our Legacy Since 1985</h2>
              <p className={styles.aboutText}>
                With decades of experience in the culinary arts, Bikaner Elite
                combines traditional recipes with modern techniques. Our
                commitment to quality ingredients and authentic flavors has made
                us a household name in Patna.
              </p>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>35+</span>
                  <span className={styles.statLabel}>Years Serving</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>4</span>
                  <span className={styles.statLabel}>Stores</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>200+</span>
                  <span className={styles.statLabel}>Menu Items</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>50K+</span>
                  <span className={styles.statLabel}>Happy Customers</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.imageFrame}>
                {/* Placeholder for about image */}
                <div className={styles.aboutImagePlaceholder}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="text-center">Visit Our Stores</h2>
            <p className="lead text-center">
              Find us across Patna for your sweet cravings
            </p>
          </div>

          <div className={styles.storesGrid}>
            {stores.map((store, index) => (
              <div key={index} className={`card ${styles.storeCard}`}>
                <div className={styles.storeHeader}>
                  <h3>{store.name}</h3>
                  <span className={styles.storeStatus}>
                    <span className={styles.statusDot}></span>
                    Open Now
                  </span>
                </div>
                <div className={styles.storeBody}>
                  <p className={styles.storeLocation}>{store.location}</p>
                  <p className={styles.storeHours}>Timings: {store.hours}</p>
                  <div className={styles.storeActions}>
                    <button className="btn btn-sm btn-outline">
                      Directions
                    </button>
                    <button className="btn btn-sm btn-primary">Call Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Experience Excellence?</h2>
            <p className={styles.ctaText}>
              Order online for delivery or visit us today for an unforgettable
              culinary experience.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/order" className="btn btn-accent btn-lg">
                Order Now
              </Link>
              <Link to="/reservation" className="btn btn-outline btn-lg">
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
