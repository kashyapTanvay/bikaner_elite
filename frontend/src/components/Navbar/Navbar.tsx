import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

type NavbarVariant = "public" | "training";

interface NavbarProps {
  variant?: NavbarVariant;
}

const Navbar = ({ variant = "public" }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* Scroll depth */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cursor-tracked liquid underline */
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    e.currentTarget.style.setProperty("--wave-x", `${x}%`);
  };

  const navItems =
    variant === "training"
      ? [
          { label: "Dashboard", path: "/training" },
          { label: "Courses", path: "/training/courses" },
          { label: "Progress", path: "/training/progress" },
        ]
      : [
          { label: "Our Products", dropdown: true },
          { label: "Stores", path: "/stores" },
          { label: "About", path: "/about" },
          { label: "Contact", path: "/contact" },
        ];

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        styles[variant]
      }`}
    >
      <div className={styles.container}>
        {/* LOGO */}
        <Link to="/" className={styles.logo}>
          <img
            src="/images/logo_bg.png"
            alt="Bikaner Elite"
            className={styles.logoImage}
          />
        </Link>

        {/* NAV LINKS */}
        <div className={styles.links}>
          {navItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.label}
                className={styles.dropdownWrapper}
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={styles.navLink}
                  onMouseMove={handleMouseMove}
                >
                  <span>{item.label}</span>
                  <span className={styles.wave} />
                </button>

                {/* LIQUID DROPDOWN */}
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <Link to="/sweets">Sweets</Link>
                      <Link to="/bakery">Bakery</Link>
                      <Link to="/cakes">Custom Cakes</Link>
                      <Link to="/restaurant">Restaurant</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                key={item.label}
                className={styles.navLink}
                onMouseMove={handleMouseMove}
                onClick={() => item.path && navigate(item.path)}
              >
                <span>{item.label}</span>
                <span className={styles.wave} />
              </button>
            )
          )}
        </div>

        {/* ACTIONS */}
        {variant === "public" ? (
          <div className={styles.actions}>
            <button className={styles.orderBtn}>Order Now</button>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Staff Login
            </button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button
              className={styles.trainingBtn}
              onClick={() => navigate("/training")}
            >
              Training Portal
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
