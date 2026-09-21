import { useState } from "react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.newPassword || !form.confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setMessage("Password changed successfully.");
    setForm({ newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="admin-page-panel">
      <div className="admin-page-header">
        <h2>Change Password</h2>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-row-wide">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-row-wide">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="admin-form-error">{error}</p>}
        {message && <p className="admin-form-success">{message}</p>}

        <button type="submit" className="admin-primary-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}
