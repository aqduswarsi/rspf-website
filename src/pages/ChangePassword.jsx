import { useState } from "react";
import { API_BASE_URL } from "../utils/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      setMessage("❌ Both fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("rpsf_login_token");
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setMessage("✅ Password changed successfully!");
      setForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Change Password</h2>
          <p>Update your admin account password.</p>
        </div>
      </div>

      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />

          <div style={{ marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}
