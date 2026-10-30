import { useState, useEffect } from "react";
import {
  getAdminReattemptRequests,
  respondToReattemptRequest,
} from "../utils/api";

export default function AdminReattemptRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  useEffect(() => {
    load();
  }, [filter]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAdminReattemptRequests(filter);
      setRequests(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (r) => {
    setSelected(r);
    setAdminNote(r.adminNote || "");
    setMessage("");
  };

  const closeModal = () => {
    setSelected(null);
    setAdminNote("");
    setMessage("");
  };

  const handleRespond = async (status) => {
    try {
      setSaving(true);
      setMessage("");
      await respondToReattemptRequest(selected._id, status, adminNote);
      setMessage("Request updated successfully.");
      setTimeout(() => {
        closeModal();
        load();
      }, 1000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredRequests = requests.filter((request) => {
    const query = searchText.trim().toLowerCase();
    if (
      query &&
      ![
        request.userId?.nameEnglish,
        request.userId?.rollNumber,
        request.examId?.title,
        request.reason,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ) {
      return false;
    }

    const requestDate = request.createdAt
      ? String(request.createdAt).slice(0, 10)
      : "";
    if (filterFromDate && (!requestDate || requestDate < filterFromDate))
      return false;
    if (filterToDate && (!requestDate || requestDate > filterToDate))
      return false;

    return true;
  });
  const hasActiveFilters = searchText || filterFromDate || filterToDate;

  const getStatusStyle = (status) => {
    if (status === "approved")
      return {
        bg: "rgba(74,222,128,0.15)",
        color: "#4ade80",
        border: "#4ade80",
      };
    if (status === "rejected")
      return {
        bg: "rgba(239,68,68,0.15)",
        color: "#ef4444",
        border: "#ef4444",
      };
    return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "#f59e0b" };
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Reattempt Requests</h2>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          {filteredRequests.length}
          {filteredRequests.length !== requests.length && ` of ${requests.length}`}{" "}
          {filteredRequests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="support-tabs" style={{ marginBottom: 16 }}>
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`support-tab ${filter === s ? "active" : ""}`}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          alignItems: "end",
          padding: "16px",
          marginBottom: "16px",
          background: "var(--panel, rgba(255,255,255,0.04))",
          border: "1px solid var(--line)",
          borderRadius: "10px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "var(--ink)",
              fontSize: "12px",
            }}
          >
            Search (User, Roll Number, Exam, Reason)
          </label>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Type any keyword..."
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              color: "var(--ink)",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "var(--ink)",
              fontSize: "12px",
            }}
          >
            Request Date From
          </label>
          <input
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              color: "var(--ink)",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "var(--ink)",
              fontSize: "12px",
            }}
          >
            Request Date To
          </label>
          <input
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#FFFFFF",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              color: "var(--ink)",
              fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="button"
          className="table-action"
          onClick={() => {
            setSearchText("");
            setFilterFromDate("");
            setFilterToDate("");
          }}
          disabled={!hasActiveFilters}
          style={{
            padding: "10px 16px",
            cursor: hasActiveFilters ? "pointer" : "not-allowed",
            opacity: hasActiveFilters ? 1 : 0.5,
          }}
        >
          Clear Filters
        </button>
      </div>

      {message && !selected && (
        <p
          style={{
            padding: "12px",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid #ef4444",
            color: "#ef4444",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </p>
      )}

      <div className="table-wrap">
        {loading ? (
          <p
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--gold)",
            }}
          >
            Loading...
          </p>
        ) : requests.length === 0 ? (
          <p
            style={{
              padding: "40px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No {filter} requests.
          </p>
        ) : filteredRequests.length === 0 ? (
          <p
            style={{
              padding: "40px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No requests match your filters.
          </p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Sr. No</th>
                <th style={{ width: "180px" }}>User</th>
                <th>Exam</th>
                <th>Reason</th>
                <th style={{ width: "130px" }}>Status</th>
                <th style={{ width: "120px" }}>Date</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, i) => {
                const sc = getStatusStyle(r.status);
                return (
                  <tr key={r._id}>
                    <td
                      style={{
                        textAlign: "center",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td>
                      <div
                        style={{
                          color: "var(--gold)",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        {r.userId?.nameEnglish || "-"}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "11px",
                        }}
                      >
                        {r.userId?.rollNumber || "-"}
                      </div>
                    </td>
                    <td style={{ fontSize: "13px" }}>
                      {r.examId?.title || "-"}
                    </td>
                    <td
                      style={{
                        maxWidth: "320px",
                        fontSize: "13px",
                        lineHeight: 1.5,
                      }}
                    >
                      {r.reason}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          whiteSpace: "nowrap",
                          textTransform: "capitalize",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "#000000",
                        whiteSpace: "nowrap",
                        fontSize: "12.5px",
                      }}
                    >
                      {formatDate(r.createdAt)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleOpen(r)}
                      >
                        {r.status === "pending" ? "Respond" : "View"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "var(--dark-bg)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "640px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  color: "var(--gold)",
                  margin: 0,
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "2px",
                }}
              >
                {selected.status === "pending"
                  ? "Respond to Request"
                  : "Request Details"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "var(--gold)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                X
              </button>
            </div>

            {/* User info */}
            <div
              style={{
                padding: "14px",
                background: "rgba(139,0,0,0.15)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  color: "var(--gold)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {selected.userId?.nameEnglish}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                }}
              >
                Roll No: {selected.userId?.rollNumber} • Mobile:{" "}
                {selected.userId?.mobileNumber}
              </p>
            </div>

            {/* Exam */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                letterSpacing: "1px",
                margin: "0 0 6px",
              }}
            >
              EXAM
            </p>
            <p
              style={{
                color: "var(--gold)",
                fontSize: "14px",
                margin: "0 0 16px",
                fontWeight: 600,
              }}
            >
              {selected.examId?.title}
            </p>

            {/* Reason */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                letterSpacing: "1px",
                margin: "0 0 6px",
              }}
            >
              REASON
            </p>
            <p
              style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.4)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: "6px",
                color: "rgba(255,255,255,0.9)",
                fontSize: "14px",
                lineHeight: 1.6,
                margin: "0 0 20px",
              }}
            >
              {selected.reason}
            </p>

            {/* Admin note */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                letterSpacing: "1px",
                margin: "0 0 6px",
              }}
            >
              ADMIN NOTE {selected.status === "pending" ? "(optional)" : ""}
            </p>
            {selected.status === "pending" ? (
              <textarea
                rows="3"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter a note (optional)..."
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "'Outfit', sans-serif",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <p
                style={{
                  padding: "12px 14px",
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                {selected.adminNote || "(no note)"}
              </p>
            )}

            {message && (
              <p
                style={{
                  marginTop: "14px",
                  color: message.toLowerCase().includes("success")
                    ? "#4ade80"
                    : "#ef4444",
                   fontSize: "13px",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="table-action"
                onClick={closeModal}
              >
                Close
              </button>
              {selected.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleRespond("rejected")}
                    disabled={saving}
                    style={{
                      padding: "10px 24px",
                      background: "rgba(239,68,68,0.15)",
                      color: "#ef4444",
                      border: "1px solid #ef4444",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespond("approved")}
                    disabled={saving}
                    className="primary"
                    style={{ padding: "10px 24px" }}
                  >
                    {saving ? "Saving..." : "Approve"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
