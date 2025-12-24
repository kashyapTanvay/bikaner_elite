import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/AuthContext";

type NavbarVariant = "public" | "training";

interface NavbarProps {
  variant?: NavbarVariant;
}

const Navbar = ({ variant = "public" }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverPosition, setHoverPosition] = useState({ x: 0, width: 0 });
  const { user, logout } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mouse position tracking for wave effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const relativeX = ((e.clientX - navRect.left) / navRect.width) * 100;

        // Update wave position
        navRef.current.style.setProperty("--mouse-percent", `${relativeX}%`);

        // Update CSS custom properties for smooth animation
        navRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        navRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* Scroll depth */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(`.${styles.userButton}`)
      ) {
        setShowUserDropdown(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(`.${styles.searchTrigger}`)
      ) {
        setShowSearch(false);
      }
      if (
        !(event.target as HTMLElement).closest(`.${styles.dropdownWrapper}`) &&
        openDropdown
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  /* Calculate hover position for wave effect */
  const handleMouseEnter = (e: React.MouseEvent, itemName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: rect.left + rect.width / 2, width: rect.width });

    if (navRef.current) {
      navRef.current.style.setProperty(
        "--hover-x",
        `${rect.left + rect.width / 2}px`
      );
      navRef.current.style.setProperty("--hover-width", `${rect.width}px`);
      navRef.current.style.setProperty("--wave-active", "1");
    }
  };

  const handleMouseLeave = () => {
    if (navRef.current) {
      navRef.current.style.setProperty("--wave-active", "0");
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const navItems = [
    { label: "Shop", dropdown: true },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const cartItemCount = 0; // This would come from your cart context

  return (
    <>
      {/* Enhanced Free-Flow Cursor Background */}
      <div
        className={styles.cursorFlow}
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${
            mousePosition.y * 0.02
          }px)`,
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <nav
        ref={navRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
          styles[variant]
        }`}
      >
        <div className={styles.wavePrimary} />

        <div className={styles.waveGlow} />

        {/* Floating Particles */}
        <div className={styles.floatingParticles}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.container}>
          {/* LEFT SECTION: Navigation Links */}
          <div className={styles.leftSection}>
            <div className={styles.links}>
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    className={styles.dropdownWrapper}
                    onMouseEnter={(e) => {
                      handleMouseEnter(e, item.label);
                      setOpenDropdown(item.label);
                    }}
                    onMouseLeave={() => {
                      handleMouseLeave();
                      if (!showUserDropdown) setOpenDropdown(null);
                    }}
                  >
                    <button
                      className={styles.navLink}
                      onClick={() =>
                        !item.path &&
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        )
                      }
                    >
                      <span className={styles.linkText}>{item.label}</span>
                      <span className={styles.linkGlow} />
                      <span className={styles.linkWave} />
                      <motion.span
                        className={styles.chevron}
                        animate={{
                          rotate: openDropdown === item.label ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </motion.span>
                    </button>

                    {/* ENHANCED DROPDOWN */}
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          className={styles.dropdown}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            mass: 0.8,
                          }}
                          style={{ zIndex: 9999 }}
                        >
                          <div className={styles.dropdownGlow} />
                          <div className={styles.dropdownContent}>
                            <Link to="/sweets" className={styles.dropdownItem}>
                              <span className={styles.itemIcon}>🍬</span>
                              <span>Sweets</span>
                              <span className={styles.itemHoverEffect} />
                            </Link>
                            <Link to="/bakery" className={styles.dropdownItem}>
                              <span className={styles.itemIcon}>🥐</span>
                              <span>Bakery</span>
                              <span className={styles.itemHoverEffect} />
                            </Link>
                            <Link to="/cakes" className={styles.dropdownItem}>
                              <span className={styles.itemIcon}>🎂</span>
                              <span>Custom Cakes</span>
                              <span className={styles.itemHoverEffect} />
                            </Link>
                            <Link
                              to="/restaurant"
                              className={styles.dropdownItem}
                            >
                              <span className={styles.itemIcon}>🍽️</span>
                              <span>Restaurant</span>
                              <span className={styles.itemHoverEffect} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    key={item.label}
                    className={styles.navLink}
                    onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <span className={styles.linkText}>{item.label}</span>
                    <span className={styles.linkGlow} />
                    <span className={styles.linkWave} />
                  </button>
                )
              )}
            </div>
          </div>

          {/* CENTER SECTION: Logo */}
          <div className={styles.centerSection}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoContainer}>
                {/* <div className={styles.logoOrb} /> */}
                <img
                  src="/images/logo_bg.png"
                  alt="Bikaner Elite"
                  className={styles.logoImage}
                />
                {/* <div className={styles.logoPulse} /> */}
                {/* <div className={styles.logoShine} /> */}
              </div>
            </Link>
          </div>

          {/* RIGHT SECTION: Icons */}
          <div className={styles.rightSection}>
            {/* Search */}
            <div className={styles.iconWrapper} ref={searchRef}>
              <button
                className={`${styles.iconButton} ${styles.searchTrigger}`}
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
              >
                <Search className={styles.icon} />
                <span className={styles.iconGlow} />
                <span className={styles.iconRing} />
              </button>

              {/* Search Bar */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    className={styles.searchContainer}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ zIndex: 9999 }}
                  >
                    <div className={styles.searchGlow} />
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                      <Search className={styles.searchIcon} size={18} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className={styles.searchInput}
                        autoFocus
                      />
                      <button type="submit" className={styles.searchSubmit}>
                        Search
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <div className={styles.iconWrapper}>
              <Link
                to="/cart"
                className={styles.iconButton}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className={styles.icon} color="black" />
                {/* <span className={styles.iconGlow} />
                <span className={styles.iconRing} /> */}
                {/* {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>
                    <span className={styles.badgePulse} />
                    {cartItemCount}
                  </span>
                )} */}
              </Link>
            </div>

            {/* User */}
            <div className={styles.userSection} ref={userDropdownRef}>
              {user ? (
                <>
                  <button
                    className={`${styles.iconButton} ${styles.userButton}`}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    aria-label="User Menu"
                  >
                    <User className={styles.icon} />
                    <span className={styles.iconGlow} />
                    <span className={styles.iconRing} />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        className={styles.userDropdown}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{ zIndex: 9999 }}
                      >
                        <div className={styles.userDropdownGlow} />
                        <div className={styles.dropdownHeader}>
                          <div className={styles.userInfoAvatar}>
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                            <span className={styles.avatarRing} />
                          </div>
                          <div className={styles.userInfo}>
                            <div className={styles.userInfoName}>
                              {user?.name}
                            </div>
                            <div className={styles.userInfoEmail}>
                              {user?.email}
                            </div>
                            <div className={styles.userInfoRole}>
                              {user?.role?.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className={styles.dropdownDivider} />

                        <Link
                          to="/profile"
                          className={styles.dropdownItem}
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <span className={styles.dropdownIcon}>👤</span>
                          <span>My Profile</span>
                          <span className={styles.dropdownHoverEffect} />
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className={styles.dropdownItem}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <span className={styles.dropdownIcon}>⚡</span>
                            <span>Admin Panel</span>
                            <span className={styles.dropdownHoverEffect} />
                          </Link>
                        )}

                        <Link
                          to="/orders"
                          className={styles.dropdownItem}
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <span className={styles.dropdownIcon}>📦</span>
                          <span>My Orders</span>
                          <span className={styles.dropdownHoverEffect} />
                        </Link>

                        <div className={styles.dropdownDivider} />

                        <button
                          className={styles.logoutButton}
                          onClick={handleLogout}
                        >
                          <span className={styles.dropdownIcon}>🚪</span>
                          <span>Logout</span>
                          <span className={styles.dropdownHoverEffect} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className={styles.iconButton}
                  aria-label="Login"
                >
                  <User
                    // className={styles.icon}
                    style={{ marginBottom: "4px" }}
                  />
                  {/* <span className={styles.iconGlow} /> */}
                  {/* <span className={styles.iconRing} /> */}
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className={styles.menuToggle}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={showMobileMenu ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.menuIconContainer}
            >
              {showMobileMenu ? (
                <X className={styles.menuIcon} />
              ) : (
                <Menu className={styles.menuIcon} />
              )}
            </motion.div>
            <span className={styles.menuGlow} />
            <span className={styles.menuRing} />
          </button>
        </div>

        {/* MOBILE MENU - Fixed */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 9998 }}
            >
              <div className={styles.mobileMenuWave} />
              <div className={styles.mobileMenuContent}>
                <div className={styles.mobileUserSection}>
                  {user ? (
                    <>
                      <div className={styles.mobileUserAvatar}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className={styles.mobileUserName}>
                          {user?.name}
                        </div>
                        <div className={styles.mobileUserEmail}>
                          {user?.email}
                        </div>
                        <div className={styles.mobileUserRole}>
                          {user?.role?.toUpperCase()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className={styles.mobileLoginButton}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User size={20} />
                      <span>Login / Register</span>
                    </Link>
                  )}
                </div>

                <div className={styles.mobileLinks}>
                  <Link
                    to="/"
                    className={styles.mobileLink}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span>Home</span>
                    <span className={styles.mobileLinkWave} />
                  </Link>

                  <div className={styles.mobileDropdown}>
                    <button
                      className={styles.mobileDropdownButton}
                      onClick={() =>
                        setOpenDropdown(openDropdown === "Shop" ? null : "Shop")
                      }
                    >
                      <span>Shop</span>
                      <motion.span
                        animate={{ rotate: openDropdown === "Shop" ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.mobileChevron}
                      >
                        ▼
                      </motion.span>
                      <span className={styles.mobileLinkWave} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === "Shop" && (
                        <motion.div
                          className={styles.mobileDropdownContent}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Link
                            to="/sweets"
                            className={styles.mobileDropdownItem}
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Sweets
                          </Link>
                          <Link
                            to="/bakery"
                            className={styles.mobileDropdownItem}
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Bakery
                          </Link>
                          <Link
                            to="/cakes"
                            className={styles.mobileDropdownItem}
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Custom Cakes
                          </Link>
                          <Link
                            to="/restaurant"
                            className={styles.mobileDropdownItem}
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Restaurant
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/about"
                    className={styles.mobileLink}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span>About</span>
                    <span className={styles.mobileLinkWave} />
                  </Link>

                  <Link
                    to="/contact"
                    className={styles.mobileLink}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span>Contact</span>
                    <span className={styles.mobileLinkWave} />
                  </Link>

                  <Link
                    to="/cart"
                    className={styles.mobileLink}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ShoppingCart size={18} />
                    <span>
                      Cart {cartItemCount > 0 && `(${cartItemCount})`}
                    </span>
                    <span className={styles.mobileLinkWave} />
                  </Link>

                  {user && (
                    <>
                      <div className={styles.mobileDivider} />
                      <Link
                        to="/profile"
                        className={styles.mobileLink}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span>My Profile</span>
                        <span className={styles.mobileLinkWave} />
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className={styles.mobileLink}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <span>Admin Panel</span>
                          <span className={styles.mobileLinkWave} />
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        className={styles.mobileLink}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span>My Orders</span>
                        <span className={styles.mobileLinkWave} />
                      </Link>
                      <button
                        className={styles.mobileLogoutButton}
                        onClick={handleLogout}
                      >
                        <span>Logout</span>
                        <span className={styles.mobileLinkWave} />
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Search */}
                <div className={styles.mobileSearch}>
                  <form
                    onSubmit={handleSearch}
                    className={styles.mobileSearchForm}
                  >
                    <div className={styles.mobileSearchGlow} />
                    <Search className={styles.mobileSearchIcon} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className={styles.mobileSearchInput}
                    />
                    <button type="submit" className={styles.mobileSearchSubmit}>
                      Go
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
