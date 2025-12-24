import React, { useState, useEffect } from "react";
import styles from "./Layout.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingLogo}>
          <div className={styles.loadingLogoInner}>
            <img
              src="/images/bikanerelite_logo.jpeg"
              alt="Bikaner Elite"
              className={styles.loadingLogo}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layoutParent}>
      <Navbar />
      <main className={styles.layoutChildren}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
