import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, userLogin } from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ input: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Detect karo — Email ya Phone
  const detectType = (value) => {
    if (value.includes("@")) return "admin";
    if (/^\d{10}$/.test(value)) return "user";
    return "unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { input, password } = form;

    if (!input || !password) {
      setError("Please enter both fields.");
      return;
    }

    const type = detectType(input);

    setLoading(true);
    setError("");

    try {
      // ============ ADMIN LOGIN ============
      if (type === "admin") {
        const data = await adminLogin(input, password);
        localStorage.setItem("rpsf_login_token", data.token);
        localStorage.setItem("rpsf_login_name", data.admin?.name || input);
        localStorage.setItem("rpsf_login_role", "admin");
        // user token clear
        localStorage.removeItem("rpsf_user_token");
        navigate("/admin");
      }

      // ============ USER LOGIN ============
      else if (type === "user") {
        const data = await userLogin(input, password);
        localStorage.setItem("rpsf_user_token", data.token);
        localStorage.setItem("rpsf_user_name", data.user?.name || input);
        localStorage.setItem("rpsf_login_role", "user");
        // admin token clear
        localStorage.removeItem("rpsf_login_token");
        navigate("/user/dashboard");
      }

      // ============ INVALID INPUT ============
      else {
        setError(
          "Please enter a valid Email (for admin) or 10-digit Phone (for member).",
        );
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page page-wrapper">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{ "--i": i }} />
          ))}
        </div>
      </div>

      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <img
            src="/rpsf-logo.jpg"
            alt="RPSF Logo"
            className="login-big-logo"
          />
          <h2>RPSF Command Portal</h2>
          <p>RPSF TRAINING CENTER RAJAHI CAMP GORAKHPUR</p>
          <p className="login-motto">तपसा शौर्यसन्धानम्</p>
          <div className="login-features">
            <div className="lf-item">
              <span>👨‍✈️</span> <strong>Admin:</strong> Email + Password
            </div>
            <div className="lf-item">
              <span>👤</span> <strong>Member:</strong> Phone + DOB (ddmmyyyy)
            </div>
            <div className="lf-item">
              <span>🔐</span> Single Secure Login
            </div>
            <div className="lf-item">
              <span>🇮🇳</span> Official Railway Portal
            </div>
          </div>
          <div className="login-warning">
            ⚠️ Restricted Access — Authorized RPSF Personnel Only.
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">🔐</div>
              <h3>Portal Login</h3>
              <p>Sign in with Email (Admin) or Phone (Member)</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="input">
                  <span className="label-icon">👤</span> Email or Phone
                </label>
                <input
                  id="input"
                  type="text"
                  name="input"
                  value={form.input}
                  onChange={handleChange}
                  placeholder="admin@rspf.com  OR  9876543210"
                  autoComplete="username"
                  required
                />
                <small
                  style={{
                    color: "rgba(212,175,55,0.7)",
                    fontSize: "11px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {form.input.includes("@")
                    ? "🔐 Admin mode detected"
                    : /^\d{10}$/.test(form.input)
                      ? "👤 Member mode detected"
                      : "Enter email for admin, 10-digit phone for member"}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔑</span> Password
                </label>
                <div className="password-wrap">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                <small
                  style={{
                    color: "rgba(212,175,55,0.7)",
                    fontSize: "11px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Member: password is your DOB (ddmmyyyy)
                </small>
              </div>

              {error && <div className="form-error">⚠️ {error}</div>}

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <span>🔓</span> Login
                  </>
                )}
              </button>

              <div className="login-divider">
                <span>RPSF QUICK LINKS</span>
              </div>

              <a
                href="https://rtionline.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="login-alt-btn"
              >
                📋 Access RTI Portal
              </a>
              <a
                href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp"
                target="_blank"
                rel="noreferrer"
                className="login-alt-btn"
              >
                🚆 Rail Madad Portal
              </a>
            </form>

            <p className="login-footer-note">
              🔒 Government of India — Security Directorate | RPSF Control
              System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
