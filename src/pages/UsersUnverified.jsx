import { useState, useEffect } from "react";
import { getUnverifiedUsers, acceptUser, deleteUser } from "../utils/api";

export default function UsersUnverified() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUnverifiedUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id, name) => {
    if (!window.confirm(`Accept ${name}?`)) return;
    try {
      await acceptUser(id);
      setUsers(users.filter((u) => u._id !== id));
      alert(`✅ ${name} accepted`);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject and delete ${name}?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      alert(`❌ ${name} rejected`);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.nameEnglish || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.mobileNumber || "").includes(search),
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Unverified Users ({users.length})</h2>
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
                <th>Blood</th>
                <th>Date</th>
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
                  <td>{u.bloodGroup || "-"}</td>
                  <td>
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td className="action-cell">
                    <button
                      className="btn-accept"
                      onClick={() => handleAccept(u._id, u.nameEnglish)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(u._id, u.nameEnglish)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-row">
                    No unverified users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
