import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { changeUserPassword } from "../utils/api";

export default function UserChangePassword() {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      setMessage({ text: "❌ Both fields are required", type: "error" });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "❌ Passwords do not match", type: "error" });
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage({
        text: "❌ Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await changeUserPassword(form.newPassword, form.confirmPassword);
      setMessage({
        text: "✅ Password updated successfully!",
        type: "success",
      });
      setForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ text: "❌ " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
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
                    background:
                      message.type === "success"
                        ? "rgba(74,222,128,0.15)"
                        : "rgba(239,68,68,0.15)",
                    borderColor:
                      message.type === "success"
                        ? "rgba(74,222,128,0.4)"
                        : "rgba(239,68,68,0.4)",
                    color: message.type === "success" ? "#4ade80" : "#ef4444",
                  }}
                >
                  {message.text}
                </div>
              )}

              <button type="submit" className="primary" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
