import React from "react";
import styles from "./AboutSection.module.css";

const AboutSection = () => {
  return (
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
              <div className={styles.aboutImagePlaceholder}>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
