import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Calendar, Sparkles } from "lucide-react";
import styles from "./CTASection.module.css";

const CTASection = () => {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaHeader}>
            <Sparkles className={styles.sparkleIcon} size={24} />
            <h2 className={styles.ctaTitle}>Ready to Experience Excellence?</h2>
            <Sparkles className={styles.sparkleIcon} size={24} />
          </div>

          <p className={styles.ctaText}>
            Order online for delivery or visit us today for an unforgettable
            culinary experience. Experience the taste that has delighted Patna
            for decades.
          </p>

          <div className={styles.ctaStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>30min</span>
              <span className={styles.statLabel}>Avg Delivery</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.8★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>

          <div className={styles.ctaButtons}>
            <Link
              to="/order"
              className={`${styles.primaryButton} btn btn-accent btn-lg`}
            >
              <ShoppingBag className={styles.buttonIcon} size={20} />
              Order Now
            </Link>
            <Link
              to="/reservation"
              className={`${styles.secondaryButton} btn btn-outline btn-lg`}
            >
              <Calendar className={styles.buttonIcon} size={20} />
              Book a Table
            </Link>
          </div>

          <div className={styles.ctaFeatures}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <span>Free Delivery over ₹500</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <span>Easy Online Ordering</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✓</div>
              <span>Fresh Ingredients Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
