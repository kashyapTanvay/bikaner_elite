import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import OverviewTab from "../../components/AdminTabs/OverView/OverviewTab";
import UserTab from "../../components/AdminTabs/UserTab/UserTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    // Clear admin auth and redirect
    navigate("/");
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Top Navigation */}
      <nav className={styles.topNav}>
        <div className={styles.navLeft}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>BE</div>
            <div>
              <h2 className={styles.brandName}>Admin Panel</h2>
              <p className={styles.brandSubtitle}>Bikaner Elite</p>
            </div>
          </div>
        </div>

        <div className={styles.navCenter}>
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search analytics, reports, staff..."
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navActions}>
            <button className={styles.navAction}>
              <span className={styles.actionIcon}>🔔</span>
              <span className={styles.actionBadge}>5</span>
            </button>
            <button className={styles.navAction}>
              <span className={styles.actionIcon}>⚙️</span>
            </button>
            <button className={styles.navAction} onClick={handleLogout}>
              <span className={styles.actionIcon}>🚪</span>
            </button>
          </div>

          <div className={styles.adminProfile}>
            <div className={styles.profileAvatar}>A</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Admin User</span>
              <span className={styles.profileRole}>Super Admin</span>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.dashboardContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarMenu}>
            <h3 className={styles.menuTitle}>Dashboard</h3>
            <ul className={styles.menuList}>
              {[
                { id: "overview", label: "Overview", icon: "📊", active: true },
                { id: "users", label: "Users", icon: "👤" },

                {
                  id: "analytics",
                  label: "Analytics",
                  icon: "📈",
                  badge: "New",
                },
                { id: "orders", label: "Orders", icon: "📦", badge: "12" },
                { id: "products", label: "Products", icon: "🍰" },
                { id: "staff", label: "Staff", icon: "👥" },
                { id: "inventory", label: "Inventory", icon: "📋" },
                { id: "training", label: "Training", icon: "🎓" },
                { id: "customers", label: "Customers", icon: "👤" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    className={`${styles.menuItem} ${
                      activeTab === item.id ? styles.active : ""
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.menuBadge}>{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className={styles.menuTitle}>Management</h3>
            <ul className={styles.menuList}>
              {[
                { id: "stores", label: "Store Management", icon: "🏪" },
                { id: "finance", label: "Finance", icon: "💰" },
                { id: "marketing", label: "Marketing", icon: "📢" },
                { id: "reports", label: "Reports", icon: "📄" },
                { id: "settings", label: "Settings", icon: "⚙️" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    className={styles.menuItem}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeTab === "overview" ? (
            <OverviewTab />
          ) : activeTab === "users" ? (
            <UserTab />
          ) : (
            <h1>Not OverView</h1>
          )}
          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
