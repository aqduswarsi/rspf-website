import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ username: 'login', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter login ID and Password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('rpsf_login_logged_in', 'true');
      localStorage.setItem('rpsf_login_name', form.username);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="login-page page-wrapper">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-particles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="particle" style={{ '--i': i }} />
          ))}
        </div>
      </div>

      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="login-big-logo" />
          <h2>RPSF login Command Portal</h2>
          <p>RAILWAY PROTECTION SPECIAL FORCE</p>
          <p className="login-motto">तपसा शौर्यसन्धानम्</p>
          <div className="login-features">
            <div className="lf-item"><span>🛡️</span> Website & Hero Slider Control</div>
            <div className="lf-item"><span>🔐</span> Encrypted login Access</div>
            <div className="lf-item"><span>⚙️</span> Real-time Content Management</div>
            <div className="lf-item"><span>🇮🇳</span> Official Railway Portal</div>
          </div>
          <div className="login-warning">
            ⚠️ Restricted Access — Authorized RPSF login Personnel Only.
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">👨‍✈️</div>
              <h3>login Portal Login</h3>
              <p>Sign in to access the RPSF Control &amp; Hero Slider Dashboard</p>
            </div>

            <div className="demo-credentials-badge">
              <span>💡 Demo Login:</span> <strong>ID:</strong> login | <strong>Pass:</strong> login123
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">
                  <span className="label-icon">👤</span> login ID / Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter login ID"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔑</span> Password
                </label>
                <div className="password-wrap">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter login Password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="form-error">
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <><span>🔓</span> Access login Dashboard</>
                )}
              </button>

              <div className="login-divider">
                <span>RPSF QUICK LINKS</span>
              </div>

              <a href="https://rtionline.gov.in/" target="_blank" rel="noreferrer" className="login-alt-btn">
                📋 Access RTI Portal
              </a>
              <a href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp" target="_blank" rel="noreferrer" className="login-alt-btn">
                🚆 Rail Madad Portal
              </a>
            </form>

            <p className="login-footer-note">
              🔒 Government of India — Security Directorate | RPSF Control System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
