import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({
      text: "ℹ️ Password change feature will be available soon. Contact admin to reset password.",
      type: "info",
    });
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="form-page" style={{ maxWidth: "600px" }}>
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Enter old password"
              />

              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
              />

              {message.text && (
                <div
                  className="form-error"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    borderColor: "rgba(212,175,55,0.4)",
                    color: "var(--gold)",
                  }}
                >
                  {message.text}
                </div>
              )}

              <button type="submit" className="primary" disabled={loading}>
                Update Password
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
