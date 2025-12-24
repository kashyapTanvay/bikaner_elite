// src/components/admin/UserTab/UserTab.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./UserTab.module.css";
import {
  fetchUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  bulkUpdateUsers,
  createStaffAccount,
  type User,
  type PaginationParams,
} from "../../../service/user-service";

// Debounce hook for search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserTab: React.FC = () => {
  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter State
  const [filters, setFilters] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    role: "",
    status: "",
  });

  // Selected Users for Bulk Actions
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Create Staff Modal State
  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    role: "staff",
  });
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffCreationResult, setStaffCreationResult] = useState<{
    success: boolean;
    message: string;
    temporaryPassword?: string;
    user?: User | null;
  } | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(filters.search || "", 300);

  // Ref for search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch Users with error handling
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers(filters);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial Load
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page }));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSort = (field: string) => {
    const newSortOrder =
      filters.sortBy === field && filters.sortOrder === "desc" ? "asc" : "desc";
    setFilters((prev) => ({ ...prev, sortBy: field, sortOrder: newSortOrder }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const handleFilterChange = (key: keyof PaginationParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      await updateUserStatus(userId, newStatus);
      await loadUsers();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    setActionLoading(userId);
    try {
      await deleteUser(userId);
      await loadUsers();
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (
    action: "activate" | "deactivate" | "delete",
    data?: { role?: string }
  ) => {
    if (selectedUsers.length === 0) return;

    const actions = {
      activate: { status: "active" },
      deactivate: { status: "inactive" },
      delete: null,
    };

    const confirmMessages = {
      activate: `Activate ${selectedUsers.length} user(s)?`,
      deactivate: `Deactivate ${selectedUsers.length} user(s)?`,
      delete: `Delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
    };

    if (!window.confirm(confirmMessages[action])) return;

    setActionLoading("bulk");
    try {
      if (action === "delete") {
        // Delete users one by one
        await Promise.all(selectedUsers.map((userId) => deleteUser(userId)));
      } else {
        // Bulk update status/role
        await bulkUpdateUsers(selectedUsers, {
          ...actions[action],
          ...data,
        });
      }

      await loadUsers();
      setSelectedUsers([]);
    } catch (err) {
      console.error(`Failed to ${action} users:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateStaff = async () => {
    if (!staffForm.name || !staffForm.email || !staffForm.contactNumber) {
      setStaffCreationResult({
        success: false,
        message: "Please fill all required fields",
        user: null,
      });
      return;
    }

    setCreatingStaff(true);
    setStaffCreationResult(null);

    try {
      const response = await createStaffAccount(staffForm);
      setStaffCreationResult({
        success: true,
        message: response.message,
        temporaryPassword: response.data.temporaryPassword,
        user: response.data.user,
      });
      setStaffForm({
        name: "",
        email: "",
        contactNumber: "",
        role: "staff",
      });
      await loadUsers(); // Refresh the user list
    } catch (err: any) {
      setStaffCreationResult({
        success: false,
        message: err.message,
      });
    } finally {
      setCreatingStaff(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      role: "",
      status: "",
    });
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return styles.active;
      case "inactive":
        return styles.inactive;
      case "suspended":
        return styles.suspended;
      default:
        return styles.pending;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return styles.admin;
      case "staff":
        return styles.staff;
      case "manager":
        return styles.manager;
      case "intern":
        return styles.intern;
      default:
        return styles.customer;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userTabContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>
            Manage all users in the system ({pagination.total} total users)
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowCreateStaff(true)}
            className={`${styles.button} ${styles.primary}`}
          >
            <span className={styles.buttonIcon}>➕</span>
            Create Staff Account
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>🔍</div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, email, or phone..."
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {filters.search && (
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, search: "" }));
                if (searchInputRef.current) searchInputRef.current.value = "";
              }}
              className={styles.clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Role</label>
            <select
              value={filters.role || ""}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="intern">Intern</option>
              <option value="user">Customer</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className={styles.filterSelect}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {(filters.role || filters.status || filters.search) && (
            <button onClick={clearFilters} className={styles.clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className={styles.bulkActionsBar}>
          <div className={styles.bulkActionsInfo}>
            <span className={styles.selectedCount}>
              {selectedUsers.length} user(s) selected
            </span>
          </div>
          <div className={styles.bulkActionsButtons}>
            <button
              onClick={() => handleBulkAction("activate")}
              disabled={actionLoading === "bulk"}
              className={`${styles.button} ${styles.success} ${styles.small}`}
            >
              {actionLoading === "bulk" ? "Processing..." : "Activate"}
            </button>
            <button
              onClick={() => handleBulkAction("deactivate")}
              disabled={actionLoading === "bulk"}
              className={`${styles.button} ${styles.warning} ${styles.small}`}
            >
              {actionLoading === "bulk" ? "Processing..." : "Deactivate"}
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              disabled={actionLoading === "bulk"}
              className={`${styles.button} ${styles.danger} ${styles.small}`}
            >
              {actionLoading === "bulk" ? "Processing..." : "Delete"}
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className={`${styles.button} ${styles.secondary} ${styles.small}`}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={loadUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className={styles.tableContainer}>
        {users.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                    disabled={loading}
                  />
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className={styles.sortable}
                >
                  Name{" "}
                  {filters.sortBy === "name" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className={styles.sortable}
                >
                  Email{" "}
                  {filters.sortBy === "email" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Phone</th>
                <th
                  onClick={() => handleSort("role")}
                  className={styles.sortable}
                >
                  Role{" "}
                  {filters.sortBy === "role" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className={styles.sortable}
                >
                  Status{" "}
                  {filters.sortBy === "status" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className={styles.sortable}
                >
                  Joined{" "}
                  {filters.sortBy === "createdAt" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={styles.tableRow}>
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelect(user._id)}
                      className={styles.checkbox}
                      disabled={loading}
                    />
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        {user.isTemporaryPassword && (
                          <div className={styles.tempPasswordBadge}>
                            Temp Password
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td className={styles.phoneCell}>
                    {user.contactNumber || "N/A"}
                  </td>
                  <td>
                    <div className={styles.roleCell}>
                      <span
                        className={`${styles.roleBadge} ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={actionLoading === user._id}
                        className={styles.quickSelect}
                        title="Change role"
                      >
                        <option value="user">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="intern">Intern</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className={styles.statusCell}>
                      <span
                        className={`${styles.statusBadge} ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                        disabled={actionLoading === user._id}
                        className={styles.quickSelect}
                        title="Change status"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={actionLoading === user._id}
                        className={`${styles.actionButton} ${styles.delete}`}
                        title="Delete user"
                      >
                        {actionLoading === user._id ? "⏳" : "🗑️"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👤</div>
            <h3>No users found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className={styles.button}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} users
          </div>

          <div className={styles.paginationControls}>
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className={styles.pageButton}
              aria-label="First page"
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={styles.pageButton}
              aria-label="Previous page"
            >
              «
            </button>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles.pageButton} ${
                      pagination.currentPage === pageNum ? styles.active : ""
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={
                      pagination.currentPage === pageNum ? "page" : undefined
                    }
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            {pagination.totalPages > 5 &&
              pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  <span className={styles.ellipsis}>...</span>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className={styles.pageButton}
                    aria-label={`Page ${pagination.totalPages}`}
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={styles.pageButton}
              aria-label="Next page"
            >
              »
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={styles.pageButton}
              aria-label="Last page"
            >
              »»
            </button>
          </div>

          <div className={styles.pageJump}>
            <label htmlFor="pageJump">Go to:</label>
            <input
              id="pageJump"
              type="number"
              min="1"
              max={pagination.totalPages}
              value={filters.page}
              onChange={(e) => {
                const page = Math.min(
                  Math.max(1, Number(e.target.value) || 1),
                  pagination.totalPages
                );
                handlePageChange(page);
              }}
              className={styles.pageInput}
              aria-label="Page number"
            />
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {showCreateStaff && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create Staff Account</h2>
              <button
                onClick={() => {
                  setShowCreateStaff(false);
                  setStaffCreationResult(null);
                  setStaffForm({
                    name: "",
                    email: "",
                    contactNumber: "",
                    role: "staff",
                  });
                }}
                className={styles.modalClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {staffCreationResult && (
                <div
                  className={`${styles.resultAlert} ${
                    staffCreationResult.success ? styles.success : styles.error
                  }`}
                >
                  <span className={styles.resultIcon}>
                    {staffCreationResult.success ? "✅" : "❌"}
                  </span>
                  <div>
                    <p>{staffCreationResult.message}</p>
                    {staffCreationResult.temporaryPassword && (
                      <div className={styles.passwordInfo}>
                        <p>
                          <strong>Email Id:</strong>{" "}
                          <code>{staffCreationResult.user?.email}</code>
                        </p>
                        <p>
                          <strong>Temporary Password:</strong>{" "}
                          <code>{staffCreationResult.temporaryPassword}</code>
                        </p>

                        <p className={styles.warningText}>
                          Please save this password and share it securely with
                          the staff member. They should change it on first
                          login.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="staffName" className={styles.formLabel}>
                  Full Name *
                </label>
                <input
                  id="staffName"
                  type="text"
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="Enter full name"
                  disabled={creatingStaff}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="staffEmail" className={styles.formLabel}>
                  Email Address *
                </label>
                <input
                  id="staffEmail"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, email: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="Enter email address"
                  disabled={creatingStaff}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="staffPhone" className={styles.formLabel}>
                  Phone Number *
                </label>
                <input
                  id="staffPhone"
                  type="tel"
                  value={staffForm.contactNumber}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      contactNumber: e.target.value,
                    })
                  }
                  className={styles.formInput}
                  placeholder="Enter 10-digit phone number"
                  disabled={creatingStaff}
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="staffRole" className={styles.formLabel}>
                  Role
                </label>
                <select
                  id="staffRole"
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, role: e.target.value })
                  }
                  className={styles.formSelect}
                  disabled={creatingStaff}
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="intern">Intern</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowCreateStaff(false)}
                className={`${styles.button} ${styles.secondary}`}
                disabled={creatingStaff}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStaff}
                disabled={creatingStaff}
                className={`${styles.button} ${styles.primary}`}
              >
                {creatingStaff ? (
                  <>
                    <span className={styles.spinnerSmall}></span>
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTab;
