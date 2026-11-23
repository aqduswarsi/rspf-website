import { useState, useEffect, useRef } from "react";
import { getUnverifiedUsers, acceptUser, deleteUser } from "../utils/api";

export default function UsersUnverified() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const selectAllRef = useRef(null);

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

  const toggleSelected = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const uniqueValues = (field) =>
    [...new Set(users.map((u) => u[field]).filter(Boolean))].sort();

  const filtered = users.filter(
    (u) => {
      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        !searchText ||
        (u.nameEnglish || "").toLowerCase().includes(searchText) ||
        (u.email || "").toLowerCase().includes(searchText) ||
        (u.mobileNumber || "").includes(searchText) ||
        (u.rollNumber || "").toLowerCase().includes(searchText);

      const matchesRank = !rankFilter || u.rank === rankFilter;
      const matchesZone = !zoneFilter || u.zone === zoneFilter;
      const matchesBlood = !bloodFilter || u.bloodGroup === bloodFilter;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        if (!u.createdAt) return false;
        const created = new Date(u.createdAt);
        if (dateFrom) matchesDate = matchesDate && created >= new Date(`${dateFrom}T00:00:00`);
        if (dateTo) matchesDate = matchesDate && created <= new Date(`${dateTo}T23:59:59`);
      }

      return matchesSearch && matchesRank && matchesZone && matchesBlood && matchesDate;
    },
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((u) => selectedIds.includes(u._id));
  const someFilteredSelected =
    filtered.some((u) => selectedIds.includes(u._id)) && !allFilteredSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someFilteredSelected;
    }
  }, [someFilteredSelected, filtered.length]);

  const toggleSelectAllFiltered = () => {
    const filteredIds = filtered.map((u) => u._id);
    setSelectedIds((current) =>
      allFilteredSelected
        ? current.filter((id) => !filteredIds.includes(id))
        : [...new Set([...current, ...filteredIds])],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setRankFilter("");
    setZoneFilter("");
    setBloodFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    const actionLabel = action === "accept" ? "Accept" : "Reject and delete";
    if (!window.confirm(`${actionLabel} ${selectedIds.length} selected user(s)?`)) return;

    setBulkSaving(true);
    const results = await Promise.allSettled(
      selectedIds.map((id) => (action === "accept" ? acceptUser(id) : deleteUser(id))),
    );
    const successfulIds = selectedIds.filter(
      (_, index) => results[index].status === "fulfilled",
    );
    const failedCount = results.length - successfulIds.length;

    setUsers((current) =>
      action === "accept"
        ? current.filter((u) => !successfulIds.includes(u._id))
        : current.filter((u) => !successfulIds.includes(u._id)),
    );
    setSelectedIds([]);
    setBulkAction("");
    setBulkSaving(false);

    if (failedCount === 0) {
      alert(`✅ ${successfulIds.length} user(s) ${action === "accept" ? "accepted" : "rejected"} successfully.`);
    } else {
      alert(`⚠️ ${successfulIds.length} succeeded, ${failedCount} failed.`);
      loadUsers();
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Unverified Users ({users.length})</h2>
        <div className="users-header-actions">
          {selectedIds.length > 0 && (
            <>
              <span className="selected-count">{selectedIds.length} selected</span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="bulk-action-select"
                aria-label="Bulk action"
              >
                <option value="">Bulk Action</option>
                <option value="accept">Accept Selected</option>
                <option value="reject">Reject Selected</option>
              </select>
              <button
                type="button"
                className="bulk-btn"
                disabled={bulkSaving}
                onClick={() => {
                  if (!bulkAction) {
                    alert("Please choose Accept or Reject.");
                    return;
                  }
                  handleBulkAction(bulkAction);
                }}
              >
                {bulkSaving ? "Processing..." : "Apply"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search name, email, mobile or roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)} className="filter-select">
          <option value="">All Ranks</option>
          {uniqueValues("rank").map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="filter-select">
          <option value="">All Zones</option>
          {uniqueValues("zone").map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} className="filter-select">
          <option value="">All Blood Groups</option>
          {uniqueValues("bloodGroup").map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="filter-input" aria-label="From date" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="filter-input" aria-label="To date" />
        <button type="button" className="clear-filter-btn" onClick={clearFilters}>Clear Filters</button>
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
                <th className="checkbox-column">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allFilteredSelected}
                    disabled={filtered.length === 0}
                    onChange={toggleSelectAllFiltered}
                    aria-label="Select all filtered users"
                    title="Select all filtered users"
                  />
                </th>
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
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u._id)}
                      onChange={() => toggleSelected(u._id)}
                      aria-label={`Select ${u.nameEnglish || "user"}`}
                    />
                  </td>
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
                  <td colSpan="11" className="empty-row">
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
