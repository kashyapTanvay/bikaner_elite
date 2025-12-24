// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { useAuth } from "../../context/AuthContext";
import { userLogin } from "../../service/user-service";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await userLogin(formData.email, formData?.password);
      const { token, user } = response;

      // Call login from AuthContext
      login(token, user);

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Decorative Background Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.element1}></div>
        <div className={styles.element2}></div>
        <div className={styles.element3}></div>
      </div>

      <div className={styles.loginContainer}>
        {/* Left Side - Brand/Info */}
        <div className={styles.loginLeft}>
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>BE</div>
              <div>
                <h1 className={styles.logoText}>BIKANER Elite</h1>
                <p className={styles.logoTagline}>
                  SWEETS • BAKERY • RESTAURANT
                </p>
              </div>
            </div>

            <div className={styles.infoCards}>
              <div className={`${styles.infoCard} ${styles.customerCard}`}>
                <div className={styles.cardIcon}>🎂</div>
                <h3>Customer Login</h3>
                <p>
                  Order sweets, bakery items, and restaurant food. Track your
                  orders and enjoy special offers.
                </p>
              </div>

              <div className={`${styles.infoCard} ${styles.staffCard}`}>
                <div className={styles.cardIcon}>👨‍🍳</div>
                <h3>Staff Portal</h3>
                <p>
                  Access training modules, view schedules, and manage your work
                  assignments.
                </p>
              </div>

              <div className={`${styles.infoCard} ${styles.adminCard}`}>
                <div className={styles.cardIcon}>⚙️</div>
                <h3>Admin Panel</h3>
                <p>
                  Manage inventory, view analytics, and oversee all operations
                  from a single dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.loginRight}>
          <div className={styles.loginFormWrapper}>
            <div className={styles.formHeader}>
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorAlert}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {/* Email Field */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address
                </label>
                <div className={styles.inputWithIcon}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.formLabel}>
                    Password
                  </label>
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    Forgot Password?
                  </Link>
                </div>
                <div className={styles.inputWithIcon}>
                  <svg
                    className={styles.inputIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M2 2L22 22M9.88 9.88C9.338 10.421 9 11.171 9 12C9 13.6569 10.3431 15 12 15C12.829 15 13.579 14.662 14.12 14.12M3 12C3 12 6.272 7 12 7C14.029 7 15.789 7.759 17.168 8.832M21 12C21 12 18.046 16 12 16C11.483 16 10.985 15.955 10.506 15.87"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`${styles.submitButton} ${
                  isLoading ? styles.loading : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerText}>or continue with</span>
              </div>

              {/* Social Login */}
              <div className={styles.socialLogin}>
                <button type="button" className={styles.socialButton}>
                  <svg className={styles.socialIcon} viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>

                <button type="button" className={styles.socialButton}>
                  <svg
                    className={styles.socialIcon}
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className={styles.signupLink}>
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className={styles.signupText}>
                    Sign up now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
