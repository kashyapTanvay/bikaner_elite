import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./StaffDashboard.module.css";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("training");
  const [userData, setUserData] = useState({
    name: "Rajesh Kumar",
    role: "Senior Chef",
    employeeId: "BE-2023-045",
    department: "Kitchen",
    profileImage: null,
  });
  const [trainingProgress, setTrainingProgress] = useState([
    {
      id: 1,
      title: "Food Safety & Hygiene",
      progress: 85,
      status: "In Progress",
    },
    {
      id: 2,
      title: "Customer Service Excellence",
      progress: 60,
      status: "In Progress",
    },
    {
      id: 3,
      title: "Advanced Baking Techniques",
      progress: 100,
      status: "Completed",
    },
    {
      id: 4,
      title: "Menu Knowledge Mastery",
      progress: 30,
      status: "Not Started",
    },
  ]);
  const [upcomingShifts, setUpcomingShifts] = useState([
    {
      id: 1,
      date: "Today",
      time: "2:00 PM - 10:00 PM",
      type: "Regular",
      location: "Main Branch",
    },
    {
      id: 2,
      date: "Tomorrow",
      time: "10:00 AM - 6:00 PM",
      type: "Regular",
      location: "Kankarbagh",
    },
    {
      id: 3,
      date: "Nov 25",
      time: "12:00 PM - 8:00 PM",
      type: "Special Event",
      location: "Main Branch",
    },
  ]);
  const [quickActions, setQuickActions] = useState([
    { id: 1, title: "Clock In/Out", icon: "⏰", color: "#4CAF50" },
    { id: 2, title: "View Schedule", icon: "📅", color: "#2196F3" },
    { id: 3, title: "Request Leave", icon: "🏖️", color: "#FF9800" },
    { id: 4, title: "Submit Report", icon: "📝", color: "#9C27B0" },
    { id: 5, title: "View Payroll", icon: "💰", color: "#009688" },
    { id: 6, title: "Emergency Contact", icon: "🆘", color: "#F44336" },
  ]);

  useEffect(() => {
    // Simulate API call to fetch staff data
    const fetchStaffData = async () => {
      // In real app, this would be an API call
      setTimeout(() => {
        // Update state with fetched data
      }, 1000);
    };

    fetchStaffData();
  }, []);

  const handleLogout = () => {
    // In real app, this would clear auth tokens
    navigate("/");
  };

  const handleQuickAction = (actionId: number) => {
    switch (actionId) {
      case 1:
        alert("Clock In/Out functionality will be implemented");
        break;
      case 2:
        navigate("/staff/schedule");
        break;
      case 3:
        navigate("/staff/leave");
        break;
      case 4:
        navigate("/staff/reports");
        break;
      case 5:
        navigate("/staff/payroll");
        break;
      case 6:
        alert("Emergency contact: Manager - 9876543210");
        break;
    }
  };

  return (
    <div className={styles.staffDashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandLogo}>
            <div className={styles.logoIcon}>BE</div>
            <div>
              <h3 className={styles.logoText}>Staff Portal</h3>
              <p className={styles.logoSubtext}>Bikaner Elite</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.profileAvatar}>
            {userData.profileImage ? (
              <img src={userData.profileImage} alt={userData.name} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {userData.name.charAt(0)}
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h4 className={styles.userName}>{userData.name}</h4>
            <p className={styles.userRole}>{userData.role}</p>
            <p className={styles.userId}>ID: {userData.employeeId}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "training", label: "Training", icon: "🎓" },
              { id: "schedule", label: "Schedule", icon: "📅" },
              { id: "tasks", label: "Tasks", icon: "✅" },
              { id: "performance", label: "Performance", icon: "📈" },
              { id: "documents", label: "Documents", icon: "📁" },
              { id: "messages", label: "Messages", icon: "💬" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.navItem} ${
                    activeModule === item.id ? styles.active : ""
                  }`}
                  onClick={() => {
                    setActiveModule(item.id);
                    navigate(`/staff/${item.id}`);
                  }}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.id === "messages" && (
                    <span className={styles.badge}>3</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className={styles.sidebarFooter}>
          <button className={styles.supportButton}>
            <span className={styles.supportIcon}>🆘</span>
            <span>Support</span>
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <span className={styles.logoutIcon}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Staff Dashboard</h1>
            <p className={styles.welcomeMessage}>
              Welcome back, {userData.name}! Ready for today's shift?
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.dateTime}>
              <span className={styles.time}>2:45 PM</span>
              <span className={styles.date}>November 23, 2024</span>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.notificationButton}>
                <span className={styles.notificationIcon}>🔔</span>
                <span className={styles.notificationBadge}>2</span>
              </button>
              <button className={styles.profileButton}>
                <div className={styles.profileInitial}>
                  {userData.name.charAt(0)}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={`${styles.statCard} ${styles.primary}`}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>85%</h3>
              <p className={styles.statLabel}>Training Completion</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.success}`}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>4.8</h3>
              <p className={styles.statLabel}>Performance Rating</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.warning}`}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>24</h3>
              <p className={styles.statLabel}>Shifts This Month</p>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.info}`}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>3</h3>
              <p className={styles.statLabel}>Pending Tasks</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.contentArea}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Training Progress */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Training Progress</h3>
                <Link to="/staff/training" className={styles.viewAllLink}>
                  View All →
                </Link>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.progressList}>
                  {trainingProgress.map((course) => (
                    <div key={course.id} className={styles.progressItem}>
                      <div className={styles.progressInfo}>
                        <h4 className={styles.courseTitle}>{course.title}</h4>
                        <span
                          className={`${styles.statusBadge} ${
                            course.status === "Completed"
                              ? styles.completed
                              : course.status === "In Progress"
                              ? styles.inProgress
                              : styles.notStarted
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${course.progress}%` }}
                        />
                        <span className={styles.progressText}>
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Shifts */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Upcoming Shifts</h3>
                <Link to="/staff/schedule" className={styles.viewAllLink}>
                  View Schedule →
                </Link>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.shiftList}>
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className={styles.shiftItem}>
                      <div className={styles.shiftDate}>
                        <span className={styles.dateText}>{shift.date}</span>
                        <span className={styles.shiftType}>{shift.type}</span>
                      </div>
                      <div className={styles.shiftDetails}>
                        <p className={styles.shiftTime}>{shift.time}</p>
                        <p className={styles.shiftLocation}>{shift.location}</p>
                      </div>
                      <button className={styles.shiftAction}>Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Quick Actions</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.quickActionsGrid}>
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className={styles.quickActionButton}
                      onClick={() => handleQuickAction(action.id)}
                      style={
                        {
                          "--action-color": action.color,
                        } as React.CSSProperties
                      }
                    >
                      <span className={styles.actionIcon}>{action.icon}</span>
                      <span className={styles.actionLabel}>{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Announcements</h3>
                <span className={styles.badge}>New</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.announcementList}>
                  <div className={styles.announcementItem}>
                    <div className={styles.announcementHeader}>
                      <span className={styles.announcementType}>
                        📢 Important
                      </span>
                      <span className={styles.announcementDate}>Today</span>
                    </div>
                    <p className={styles.announcementText}>
                      Staff meeting tomorrow at 10 AM in the main hall.
                      Attendance is mandatory.
                    </p>
                  </div>
                  <div className={styles.announcementItem}>
                    <div className={styles.announcementHeader}>
                      <span className={styles.announcementType}>🎉 Event</span>
                      <span className={styles.announcementDate}>Nov 25</span>
                    </div>
                    <p className={styles.announcementText}>
                      Diwali celebration event. Special bonus for all staff
                      members.
                    </p>
                  </div>
                  <div className={styles.announcementItem}>
                    <div className={styles.announcementHeader}>
                      <span className={styles.announcementType}>
                        📊 Performance
                      </span>
                      <span className={styles.announcementDate}>Nov 20</span>
                    </div>
                    <p className={styles.announcementText}>
                      Monthly performance reviews will be conducted next week.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Spotlight */}
            <div className={`${styles.card} ${styles.featuredCard}`}>
              <div className={styles.featuredContent}>
                <div className={styles.featuredIcon}>🎓</div>
                <div>
                  <h3 className={styles.featuredTitle}>Mandatory Training</h3>
                  <p className={styles.featuredText}>
                    Complete Food Safety training before Dec 15
                  </p>
                  <button className={styles.featuredButton}>
                    Start Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outlet for Nested Routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default StaffDashboard;
