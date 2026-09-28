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
      if (type === "admin") {
        const data = await adminLogin(input, password);
        localStorage.setItem("rpsf_login_token", data.token);
        localStorage.setItem("rpsf_login_name", data.admin?.name || input);
        localStorage.setItem("rpsf_login_role", "admin");
        localStorage.removeItem("rpsf_user_token");
        navigate("/admin");
      } else if (type === "user") {
        const data = await userLogin(input, password);
        localStorage.setItem("rpsf_user_token", data.token);
        localStorage.setItem("rpsf_user_name", data.user?.name || input);
        localStorage.setItem("rpsf_login_role", "user");
        localStorage.removeItem("rpsf_login_token");
        navigate("/user/dashboard");
      } else {
        setError(
          "Please enter a valid email (admin) or 10-digit phone (member).",
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
              <span className="lf-label">Admin</span>
              Email and password
            </div>
            <div className="lf-item">
              <span className="lf-label">Member</span>
              Phone and date of birth (ddmmyyyy)
            </div>
            <div className="lf-item">
              <span className="lf-label">Access</span>
              Single secure login
            </div>
            <div className="lf-item">
              <span className="lf-label">Portal</span>
              Official Railway Network
            </div>
          </div>

          <div className="login-warning">
            Restricted Access — Authorized RPSF Personnel Only
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <h3>Portal Login</h3>
              <p>Sign in with Email (Admin) or Phone (Member)</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="input">Email or Phone</label>
                <input
                  id="input"
                  type="text"
                  name="input"
                  value={form.input}
                  onChange={handleChange}
                  placeholder="admin@rpsf.com or 9876543210"
                  autoComplete="username"
                  required
                />
                <small className="field-hint">
                  {form.input.includes("@")
                    ? "Admin mode detected"
                    : /^\d{10}$/.test(form.input)
                      ? "Member mode detected"
                      : "Enter email for admin or 10-digit phone for member"}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
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
                <small className="field-hint">
                  Member password is date of birth (ddmmyyyy)
                </small>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : "Login"}
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
                RTI Portal
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
              Government of India — Security Directorate | RPSF Control System
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .field-hint {
          color: rgba(212, 175, 55, 0.7);
          font-size: 11px;
          margin-top: 6px;
          display: block;
          letter-spacing: 0.3px;
        }
        .lf-label {
          color: var(--gold);
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
          font-size: 11px;
          text-transform: uppercase;
          min-width: 60px;
          display: inline-block;
        }
        .login-btn {
          letter-spacing: 2px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
        }
        .login-alt-btn {
          letter-spacing: 1px;
          font-weight: 500;
        }
        .login-warning {
          letter-spacing: 0.5px;
        }
        .login-card-header h3 {
          letter-spacing: 3px;
        }
        .pass-toggle {
          font-size: 11px !important;
          letter-spacing: 0.5px;
          font-family: 'Outfit', sans-serif;
          color: rgba(212, 175, 55, 0.7);
          padding: 4px 8px;
        }
        .pass-toggle:hover {
          color: var(--gold);
        }
      `}</style>
    </div>
  );
}
