// src/components/Profile/ProfilePage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import styles from "./ProfilePage.module.css";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  uploadProfileImage,
  removeProfileImage,
  type UpdateProfileRequest,
  type UpdatePasswordRequest,
} from "../../service/user-service";
import { LoadingLottie } from "../../components/lotties/loading-lottie";
import { FailureLottie } from "../../components/lotties/failure-lottie";
import { BuildingLottie } from "../../components/lotties/building-lottie";

interface ProfileFormData {
  name: string;
  contactNumber: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user: authUser, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAnimation, setShowAnimation] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    contactNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<ProfileFormData>
  >({});

  // Load user data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getUserProfile();
      const userData = response.data;

      // Set form data WITHOUT email (users can't change email)
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        contactNumber: userData.contactNumber || "",
      }));

      if (userData.profileImage) {
        setProfileImage(userData.profileImage);
      } else {
        // Generate initial avatar based on name
        const initials = userData.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setProfileImage(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            initials
          )}&background=${encodeURIComponent("#e53e3e")}&color=fff&size=256`
        );
      }
    } catch (error: any) {
      console.error("Failed to load profile:", error);

      // If unauthorized, logout user
      if (
        error.message.includes("Session expired") ||
        error.response?.status === 401
      ) {
        showErrorAnimation("Session expired. Please login again.");
        setTimeout(() => logout(), 2000);
        return;
      }

      showErrorAnimation(error.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessAnimation = (message: string) => {
    setShowAnimation({ type: "success", message });
    setTimeout(() => setShowAnimation(null), 3000);
  };

  const showErrorAnimation = (message: string) => {
    setShowAnimation({ type: "error", message });
    setTimeout(() => setShowAnimation(null), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name as keyof ProfileFormData]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showErrorAnimation("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorAnimation("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      const response = await uploadProfileImage(file);

      if (response.success) {
        setProfileImage(response.data.profileImage || "");
        showSuccessAnimation(
          response.message || "Profile image updated successfully!"
        );

        // Update user in context if needed
        if (response.data.profileImage) {
          updateUser({ profileImage: response.data.profileImage });
        }
      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      showErrorAnimation(error.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveProfileImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile image?"))
      return;

    try {
      const response = await removeProfileImage();

      if (response.success) {
        // Generate new avatar based on name
        const initials = formData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setProfileImage(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            initials
          )}&background=e53e3e&color=fff&size=256`
        );
        showSuccessAnimation(
          response.message || "Profile image removed successfully!"
        );

        // Update user in context
        updateUser({ profileImage: undefined });
      }
    } catch (error: any) {
      console.error("Failed to remove image:", error);
      showErrorAnimation(error.message || "Failed to remove image");
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ProfileFormData> = {};

    if (activeTab === "profile") {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      }

      if (
        formData.contactNumber &&
        !/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ""))
      ) {
        errors.contactNumber = "Please enter a valid 10-digit phone number";
      }
    } else if (activeTab === "security") {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          errors.currentPassword =
            "Current password is required to set a new password";
        }

        if (formData.newPassword.length < 6) {
          errors.newPassword = "Password must be at least 6 characters";
        }

        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async () => {
    try {
      const profileData: UpdateProfileRequest = {
        name: formData.name,
        contactNumber: formData.contactNumber || undefined,
      };

      const response = await updateUserProfile(profileData);

      // Update auth context WITHOUT calling login (to preserve token)
      updateUser({
        name: formData.name,
        contactNumber: formData.contactNumber || undefined,
      });

      return response;
    } catch (error: any) {
      console.error("Profile update failed:", error);

      // Handle session expiration
      if (
        error.message.includes("Session expired") ||
        error.response?.status === 401
      ) {
        showErrorAnimation("Session expired. Please login again.");
        setTimeout(() => logout(), 2000);
      }

      throw error;
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const passwordData: UpdatePasswordRequest = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await updateUserPassword(passwordData);

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      return response;
    } catch (error: any) {
      console.error("Password update failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorAnimation("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    setShowAnimation(null);

    try {
      let response;

      if (activeTab === "profile") {
        response = await handleProfileUpdate();
      } else {
        response = await handlePasswordUpdate();
      }

      if (response.success) {
        showSuccessAnimation(
          response.message || "Profile updated successfully!"
        );
      }
    } catch (error: any) {
      console.error("Update failed:", error);

      // Handle validation errors from server
      if (error.response?.data?.errors) {
        const serverErrors: Partial<ProfileFormData> = {};
        error.response.data.errors.forEach((err: string) => {
          if (err.includes("name")) serverErrors.name = err;
          if (err.includes("contactNumber")) serverErrors.contactNumber = err;
          if (err.includes("password")) serverErrors.currentPassword = err;
        });
        setValidationErrors(serverErrors);
      }

      showErrorAnimation(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingLottie />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className={styles.errorContainer}>
        <FailureLottie />
        <button
          className={styles.loginRedirectButton}
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Success/Error Animation Overlay */}
      {showAnimation && (
        <div className={styles.animationOverlay}>
          <BuildingLottie />
        </div>
      )}

      {/* Header */}
      <div className={styles.profileHeader}>
        <div className={styles.headerBackground}></div>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>
            Manage your personal information and security settings
          </p>
        </div>
      </div>

      <div className={styles.profileContent}>
        {/* Sidebar */}
        <div className={styles.profileSidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarWrapper}>
                <img
                  src={profileImage}
                  alt={formData.name}
                  className={styles.avatar}
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    const initials = formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      initials
                    )}&background=e53e3e&color=fff&size=256`;
                  }}
                />

                <div className={styles.avatarOverlay}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading || saving}
                    className={styles.avatarUploadBtn}
                    title="Change profile photo"
                  >
                    {imageUploading ? (
                      <span className={styles.uploadSpinner}></span>
                    ) : (
                      "📷"
                    )}
                  </button>
                  {profileImage && !profileImage.includes("ui-avatars.com") && (
                    <button
                      onClick={handleRemoveProfileImage}
                      disabled={saving}
                      className={styles.avatarRemoveBtn}
                      title="Remove profile photo"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{formData.name}</h2>
              <p className={styles.userEmail}>{authUser.email}</p>
              <div className={styles.userRole}>
                <span className={styles.roleBadge}>
                  {authUser.role.charAt(0).toUpperCase() +
                    authUser.role.slice(1)}
                </span>
              </div>
            </div>

            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Member Since</span>
                <span className={styles.statValue}>
                  {formatDate(authUser.createdAt)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Last Login</span>
                <span className={styles.statValue}>
                  {formatDate(authUser.lastLogin)}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    authUser.status === "active"
                      ? styles.active
                      : styles.inactive
                  }`}
                >
                  {authUser.status.charAt(0).toUpperCase() +
                    authUser.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.sidebarNav}>
            <button
              onClick={() => setActiveTab("profile")}
              className={`${styles.navButton} ${
                activeTab === "profile" ? styles.active : ""
              }`}
              disabled={saving}
            >
              <span className={styles.navIcon}>👤</span>
              <span className={styles.navText}>Personal Info</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`${styles.navButton} ${
                activeTab === "security" ? styles.active : ""
              }`}
              disabled={saving}
            >
              <span className={styles.navIcon}>🔒</span>
              <span className={styles.navText}>Security</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.profileMain}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {activeTab === "profile"
                  ? "Personal Information"
                  : "Security Settings"}
              </h3>
              <p className={styles.cardDescription}>
                {activeTab === "profile"
                  ? "Update your personal details and contact information"
                  : "Change your password and manage account security"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.profileForm}>
              {activeTab === "profile" ? (
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${
                        validationErrors.name ? styles.error : ""
                      }`}
                      placeholder="Enter your full name"
                      disabled={saving}
                    />
                    {validationErrors.name && (
                      <span className={styles.errorMessage}>
                        {validationErrors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      type="email"
                      value={authUser.email}
                      className={styles.formInput}
                      disabled
                      readOnly
                    />
                    <p className={styles.formHint}>
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contactNumber" className={styles.formLabel}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${
                        validationErrors.contactNumber ? styles.error : ""
                      }`}
                      placeholder="Enter your 10-digit phone number"
                      disabled={saving}
                    />
                    {validationErrors.contactNumber && (
                      <span className={styles.errorMessage}>
                        {validationErrors.contactNumber}
                      </span>
                    )}
                    <p className={styles.formHint}>
                      Enter your phone number for order updates and
                      notifications
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <label
                      htmlFor="currentPassword"
                      className={styles.formLabel}
                    >
                      Current Password *
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${
                        validationErrors.currentPassword ? styles.error : ""
                      }`}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      disabled={saving}
                    />
                    {validationErrors.currentPassword && (
                      <span className={styles.errorMessage}>
                        {validationErrors.currentPassword}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.formLabel}>
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${
                        validationErrors.newPassword ? styles.error : ""
                      }`}
                      placeholder="Enter new password (min. 6 characters)"
                      autoComplete="new-password"
                      disabled={saving}
                    />
                    {validationErrors.newPassword && (
                      <span className={styles.errorMessage}>
                        {validationErrors.newPassword}
                      </span>
                    )}
                    <p className={styles.formHint}>
                      Leave blank if you don't want to change your password
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      htmlFor="confirmPassword"
                      className={styles.formLabel}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${styles.formInput} ${
                        validationErrors.confirmPassword ? styles.error : ""
                      }`}
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      disabled={saving}
                    />
                    {validationErrors.confirmPassword && (
                      <span className={styles.errorMessage}>
                        {validationErrors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div className={styles.securityTips}>
                    <h4 className={styles.tipsTitle}>Password Tips</h4>
                    <ul className={styles.tipsList}>
                      <li>Use at least 6 characters</li>
                      <li>Include numbers and special characters</li>
                      <li>Avoid using personal information</li>
                      <li>Don't reuse passwords from other sites</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    loadUserProfile();
                    setValidationErrors({});
                  }}
                  className={`${styles.button} ${styles.secondary}`}
                  disabled={saving}
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.primary}`}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className={styles.spinnerSmall}></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Account Info Card */}
          <div className={styles.infoCard}>
            <h4 className={styles.infoTitle}>Account Information</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Account ID</span>
                <span className={styles.infoValue}>
                  {authUser._id
                    ? `#${authUser._id.slice(-8).toUpperCase()}`
                    : "N/A"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Account Type</span>
                <span className={styles.infoValue}>
                  {authUser.role
                    ? authUser.role.charAt(0).toUpperCase() +
                      authUser.role.slice(1)
                    : "User"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Last Updated</span>
                <span className={styles.infoValue}>
                  {formatDate(authUser.updatedAt)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Account Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    authUser.status === "active"
                      ? styles.active
                      : styles.inactive
                  }`}
                >
                  {authUser.status.charAt(0).toUpperCase() +
                    authUser.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
