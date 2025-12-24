import React, { useState } from "react";
import styles from "./OverviewTab.module.css";
import { Link } from "react-router-dom";

const OverviewTab = () => {
  const [stats, setStats] = useState({
    totalRevenue: "₹24,85,000",
    totalOrders: "1,845",
    totalStaff: "48",
    totalStores: "4",
    revenueChange: "+12.5%",
    ordersChange: "+8.3%",
    staffChange: "+2",
    storesChange: "0",
  });
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "#BE-2024-5842",
      customer: "Amit Sharma",
      amount: "₹2,850",
      status: "Delivered",
      time: "2 hours ago",
    },
    {
      id: "#BE-2024-5841",
      customer: "Priya Singh",
      amount: "₹1,250",
      status: "Processing",
      time: "3 hours ago",
    },
    {
      id: "#BE-2024-5840",
      customer: "Rajesh Kumar",
      amount: "₹4,500",
      status: "Pending",
      time: "5 hours ago",
    },
    {
      id: "#BE-2024-5839",
      customer: "Sneha Verma",
      amount: "₹3,200",
      status: "Delivered",
      time: "6 hours ago",
    },
    {
      id: "#BE-2024-5838",
      customer: "Corporate Order",
      amount: "₹12,500",
      status: "Completed",
      time: "1 day ago",
    },
  ]);
  const [topProducts, setTopProducts] = useState([
    {
      name: "Kaju Katli",
      category: "Sweets",
      sales: "₹3,45,000",
      growth: "+15%",
    },
    {
      name: "Special Cake",
      category: "Bakery",
      sales: "₹2,98,000",
      growth: "+22%",
    },
    {
      name: "Veg Thali",
      category: "Restaurant",
      sales: "₹2,75,000",
      growth: "+8%",
    },
    {
      name: "Gulab Jamun",
      category: "Sweets",
      sales: "₹2,50,000",
      growth: "+12%",
    },
    {
      name: "Bread Basket",
      category: "Bakery",
      sales: "₹1,95,000",
      growth: "+18%",
    },
  ]);
  const [staffPerformance, setStaffPerformance] = useState([
    {
      name: "Rajesh Kumar",
      role: "Head Chef",
      rating: 4.8,
      efficiency: "92%",
      status: "Active",
    },
    {
      name: "Priya Sharma",
      role: "Manager",
      rating: 4.9,
      efficiency: "95%",
      status: "Active",
    },
    {
      name: "Amit Singh",
      role: "Cashier",
      rating: 4.5,
      efficiency: "88%",
      status: "On Leave",
    },
    {
      name: "Sneha Verma",
      role: "Baker",
      rating: 4.7,
      efficiency: "90%",
      status: "Active",
    },
    {
      name: "Rohit Patel",
      role: "Server",
      rating: 4.3,
      efficiency: "85%",
      status: "Active",
    },
  ]);
  return (
    <div>
      {" "}
      <div className={styles.statsGrid}>
        {[
          {
            title: "Total Revenue",
            value: stats.totalRevenue,
            change: stats.revenueChange,
            icon: "💰",
            color: "primary",
          },
          {
            title: "Total Orders",
            value: stats.totalOrders,
            change: stats.ordersChange,
            icon: "📦",
            color: "success",
          },
          {
            title: "Active Staff",
            value: stats.totalStaff,
            change: stats.staffChange,
            icon: "👥",
            color: "warning",
          },
          {
            title: "Total Stores",
            value: stats.totalStores,
            change: stats.storesChange,
            icon: "🏪",
            color: "info",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${styles.statCard} ${styles[stat.color]}`}
          >
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <p className={styles.statTitle}>{stat.title}</p>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statChange}>
                <span className={styles.changeArrow}>
                  {stat.change.startsWith("+") ? "↗" : "↘"}
                </span>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Charts and Analytics */}
      <div className={styles.analyticsGrid}>
        {/* Revenue Chart */}
        <div className={`${styles.chartCard} ${styles.large}`}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Revenue Overview</h3>
            <div className={styles.chartControls}>
              <button className={`${styles.controlBtn} ${styles.active}`}>
                Daily
              </button>
              <button className={styles.controlBtn}>Weekly</button>
              <button className={styles.controlBtn}>Monthly</button>
            </div>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBar} style={{ height: "80%" }}></div>
            <div className={styles.chartBar} style={{ height: "60%" }}></div>
            <div className={styles.chartBar} style={{ height: "90%" }}></div>
            <div className={styles.chartBar} style={{ height: "70%" }}></div>
            <div className={styles.chartBar} style={{ height: "85%" }}></div>
            <div className={styles.chartBar} style={{ height: "95%" }}></div>
            <div className={styles.chartBar} style={{ height: "75%" }}></div>
          </div>
        </div>

        {/* Top Products */}
        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>Top Products</h3>
            <Link to="/admin/products" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.listContent}>
            {topProducts.map((product: any, index: any) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemRank}>{index + 1}</span>
                  <div>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemCategory}>{product.category}</p>
                  </div>
                </div>
                <div className={styles.itemStats}>
                  <span className={styles.itemValue}>{product.sales}</span>
                  <span
                    className={`${styles.itemChange} ${
                      product.growth.startsWith("+")
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {product.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Orders and Staff Performance */}
      <div className={styles.detailsGrid}>
        {/* Recent Orders */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Recent Orders</h3>
            <Link to="/admin/orders" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className={styles.orderId}>{order.id}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={styles.orderAmount}>{order.amount}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          order.status === "Delivered"
                            ? styles.success
                            : order.status === "Processing"
                            ? styles.warning
                            : order.status === "Pending"
                            ? styles.pending
                            : styles.completed
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={styles.timeText}>{order.time}</span>
                    </td>
                    <td>
                      <button className={styles.actionButton}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Performance */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Staff Performance</h3>
            <Link to="/admin/staff" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Efficiency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.staffCell}>
                        <div className={styles.staffAvatar}>
                          {staff.name.charAt(0)}
                        </div>
                        {staff.name}
                      </div>
                    </td>
                    <td>{staff.role}</td>
                    <td>
                      <div className={styles.ratingCell}>
                        <span className={styles.ratingValue}>
                          {staff.rating}
                        </span>
                        <div className={styles.ratingStars}>
                          {"★★★★★".split("").map((_, i) => (
                            <span
                              key={i}
                              className={`${styles.star} ${
                                i < Math.floor(staff.rating)
                                  ? styles.filled
                                  : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.efficiencyCell}>
                        <div className={styles.efficiencyBar}>
                          <div
                            className={styles.efficiencyFill}
                            style={{ width: staff.efficiency }}
                          />
                        </div>
                        <span className={styles.efficiencyText}>
                          {staff.efficiency}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          staff.status === "Active"
                            ? styles.active
                            : staff.status === "On Leave"
                            ? styles.leave
                            : styles.inactive
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionButton}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className={styles.actionsGrid}>
        <div className={styles.actionsCard}>
          <h3 className={styles.actionsTitle}>Quick Actions</h3>
          <div className={styles.actionsButtons}>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>➕</span>
              <span>Add Product</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>📋</span>
              <span>Create Order</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>👥</span>
              <span>Add Staff</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>📊</span>
              <span>Generate Report</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>🎓</span>
              <span>Assign Training</span>
            </button>
            <button className={styles.actionBtn}>
              <span className={styles.btnIcon}>🏪</span>
              <span>Manage Store</span>
            </button>
          </div>
        </div>

        <div className={styles.notificationCard}>
          <h3 className={styles.notificationTitle}>System Notifications</h3>
          <div className={styles.notificationList}>
            <div className={styles.notificationItem}>
              <div className={styles.notificationIcon}>⚠️</div>
              <div>
                <p className={styles.notificationText}>
                  Low inventory for Kaju Katli
                </p>
                <span className={styles.notificationTime}>2 hours ago</span>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationIcon}>📈</div>
              <div>
                <p className={styles.notificationText}>
                  Sales increased by 15% today
                </p>
                <span className={styles.notificationTime}>4 hours ago</span>
              </div>
            </div>
            <div className={styles.notificationItem}>
              <div className={styles.notificationIcon}>👤</div>
              <div>
                <p className={styles.notificationText}>
                  2 new staff members joined
                </p>
                <span className={styles.notificationTime}>1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
