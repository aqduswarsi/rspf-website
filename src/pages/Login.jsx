import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(form.email, form.password);

      // token save
      localStorage.setItem("rpsf_login_token", data.token);
      localStorage.setItem("rpsf_login_logged_in", "true");

      // name save — user या admin दोनों handle करें
      const name =
        data.user?.name ||
        data.admin?.name ||
        data.user?.email ||
        data.admin?.email ||
        form.email;
      localStorage.setItem("rpsf_login_name", name);

      navigate("/admin");
    } catch (loginError) {
      setError(loginError.message || "Login failed. Please try again.");
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
              Website &amp; Content Control
            </div>
            <div className="lf-item">
              Encrypted Access
            </div>
            <div className="lf-item">
              Real-time Management
            </div>
            <div className="lf-item">
              Official Railway Portal
            </div>
          </div>
          <div className="login-warning">
            Restricted Access — Authorized RPSF Personnel Only.
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">ADMIN</div>
              <h3>Admin Login</h3>
              <p>Sign in to access the RPSF Control Dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
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
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    Access Dashboard
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
                Access RTI Portal
              </a>
              <a
                href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp"
                target="_blank"
                rel="noreferrer"
                className="login-alt-btn"
              >
                Rail Madad Portal
              </a>
            </form>

            <p className="login-footer-note">
              Government of India — Security Directorate | RPSF Control
              System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
