import { useState, useEffect } from "react";
import { getVerifiedUsers, blockUser, updateUser } from "../utils/api";

export default function UsersVerified() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getVerifiedUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => setEditing({ ...user });

  const handleBlock = async (id, name) => {
    if (!window.confirm(`Block ${name}?`)) return;
    try {
      await blockUser(id);
      setUsers(users.filter((u) => u._id !== id));
      alert(`🚫 ${name} blocked`);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await updateUser(editing._id, editing);
      setUsers(users.map((u) => (u._id === editing._id ? res.data : u)));
      setEditing(null);
      alert("✅ Updated");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.nameEnglish || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Verified Users ({users.length})</h2>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "40px", color: "var(--gold)" }}
        >
          Loading...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
          ❌ {error}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Rank</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Zone</th>
                <th>Category</th>
                <th>Verified By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.rollNumber || "-"}</td>
                  <td>{u.nameEnglish || "-"}</td>
                  <td>{u.rank || "-"}</td>
                  <td>{u.mobileNumber || "-"}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.zone || "-"}</td>
                  <td>{u.category || "-"}</td>
                  <td>{u.verifiedBy || "-"}</td>
                  <td className="action-cell">
                    <button className="btn-edit" onClick={() => handleEdit(u)}>
                      Edit
                    </button>
                    <button
                      className="btn-block"
                      onClick={() => handleBlock(u._id, u.nameEnglish)}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">
                    No verified users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit — {editing.nameEnglish}</h3>
            <input
              value={editing.nameEnglish || ""}
              onChange={(e) =>
                setEditing({ ...editing, nameEnglish: e.target.value })
              }
              placeholder="Name (English)"
            />
            <input
              value={editing.mobileNumber || ""}
              onChange={(e) =>
                setEditing({ ...editing, mobileNumber: e.target.value })
              }
              placeholder="Mobile"
            />
            <input
              value={editing.email || ""}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              placeholder="Email"
            />
            <input
              value={editing.presentAddress || ""}
              onChange={(e) =>
                setEditing({ ...editing, presentAddress: e.target.value })
              }
              placeholder="Address"
            />
            <input
              value={editing.zone || ""}
              onChange={(e) => setEditing({ ...editing, zone: e.target.value })}
              placeholder="Zone"
            />
            <div className="modal-actions">
              <button onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </button>
              <button className="primary" onClick={saveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
