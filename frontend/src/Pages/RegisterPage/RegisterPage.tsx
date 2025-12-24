// src/pages/RegisterPage/RegisterPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import { useAuth } from "../../context/AuthContext";
import {
  registerUser,
  type UserRegisterForm,
} from "../../service/user-service";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserRegisterForm>({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(""); // Clear error on input change
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser(form);

      const { token, user } = response;

      // Call login from AuthContext to set the user in context
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
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={submit}>
        <h2>Create Account</h2>

        {/* Error Message */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <input
          className={styles.formInput}
          placeholder="Full Name"
          name="name"
          value={form.name}
          required
          onChange={handleChange}
          disabled={loading}
        />

        <input
          className={styles.formInput}
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          required
          onChange={handleChange}
          disabled={loading}
        />

        <input
          className={styles.formInput}
          placeholder="Phone Number"
          name="contactNumber"
          value={form.contactNumber}
          type="tel"
          required
          onChange={handleChange}
          disabled={loading}
        />

        <input
          className={styles.formInput}
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          required
          onChange={handleChange}
          disabled={loading}
        />

        <button
          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className={styles.smallText}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
