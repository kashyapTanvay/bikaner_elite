import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer */}
      <div className={styles.footerMain}>
        <div className={`container ${styles.footerContainer}`}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <img
                  src="/images/bikanerelite_logo.png"
                  alt="Bikaner Elite"
                  className={styles.loadingLogo}
                />
              </div>
            </div>
            <p className={styles.companyDescription}>
              Since 1985, Bikaner Elite has been serving Patna with the finest
              sweets, bakery items, and vegetarian cuisine. Our commitment to
              quality and tradition makes us the preferred choice for
              celebrations.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/" className={styles.footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sweets" className={styles.footerLink}>
                  Our Sweets
                </Link>
              </li>
              <li>
                <Link to="/bakery" className={styles.footerLink}>
                  Bakery Items
                </Link>
              </li>
              <li>
                <Link to="/cakes" className={styles.footerLink}>
                  Custom Cakes
                </Link>
              </li>
              <li>
                <Link to="/restaurant" className={styles.footerLink}>
                  Restaurant Menu
                </Link>
              </li>
              <li>
                <Link to="/stores" className={styles.footerLink}>
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 10.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 2V5M18 8V5M18 5H21M18 5H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 6L10 11L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>info@bikanerelite.com</span>
              </li>
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M22 16.92V19.92C22 20.4701 21.7893 20.9978 21.4142 21.3728C21.0391 21.7479 20.5114 21.9586 19.9613 21.9586C16.2562 21.9586 12.6737 20.7437 9.8625 18.5625C7.22015 16.5213 5.28612 13.7719 4.30076 10.678C3.31539 7.58405 3.33076 4.2983 4.3445 1.21262C4.53286 0.687987 5.03639 0.33489 5.598 0.33489H8.598C9.06214 0.33489 9.4776 0.62506 9.62413 1.06957L10.9766 5.30396C11.1047 5.68587 10.9746 6.10766 10.6513 6.35071L8.375 8.04315C9.44466 10.3734 11.1529 12.2916 13.2683 13.5488C15.3837 14.8061 17.8007 15.3427 20.202 15.0929L22.0018 16.2979C22.3716 16.546 22.5654 16.9832 22.4995 17.4224C22.4335 17.8615 22.1199 18.2237 21.701 18.3528L22 16.92Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>+91 98765 43210</span>
              </li>
              <li className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Multiple locations across Patna</span>
              </li>
            </ul>
            <div className={styles.storeHours}>
              <h5>Opening Hours</h5>
              <p>7:00 AM - 11:00 PM</p>
              <p className={styles.small}>Open all days</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Stay Updated</h4>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
            <div className={styles.paymentMethods}>
              <h5>We Accept</h5>
              <div className={styles.paymentIcons}>
                <span className={styles.paymentIcon}>💳</span>
                <span className={styles.paymentIcon}>📱</span>
                <span className={styles.paymentIcon}>🏦</span>
                <span className={styles.paymentIcon}>💰</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomContainer}`}>
          <p className={styles.copyright}>
            © {currentYear} Bikaner Elite. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link to="/privacy" className={styles.bottomLink}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={styles.bottomLink}>
              Terms of Service
            </Link>
            <Link to="/sitemap" className={styles.bottomLink}>
              Sitemap
            </Link>
            <Link to="/staff" className={styles.bottomLink}>
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
