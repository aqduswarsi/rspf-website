import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getAllTickets, replyTicket, deleteTicket } from "../utils/api";

export default function SupportTickets() {
  const location = useLocation();
  const status = location.pathname.includes("/answered")
    ? "answered"
    : "pending";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTickets();
  }, [status]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllTickets({ status });
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (ticket) => {
    setSelectedTicket(ticket);
    setAnswer(ticket.answer || "");
    setMessage("");
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setAnswer("");
    setMessage("");
  };

  const handleReply = async () => {
    if (!answer.trim()) {
      setMessage("❌ Answer is required");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await replyTicket(selectedTicket._id, answer.trim());
      setMessage("✅ Reply sent successfully!");
      loadTickets();
      setTimeout(() => handleCloseModal(), 1000);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      loadTickets();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="users-page support-page">
      {/* Header */}
      <div className="users-header">
        <h2>Support Ticket Report</h2>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          {tickets.length} tickets
        </span>
      </div>

      {/* Tabs */}
      <div className="support-tabs">
        <NavLink
          to="/admin/support/non-answered"
          className={`support-tab ${status === "pending" ? "active" : ""}`}
        >
          Non Answered Ticket
        </NavLink>
        <NavLink
          to="/admin/support/answered"
          className={`support-tab ${status === "answered" ? "active" : ""}`}
        >
          Answered Ticket
        </NavLink>
      </div>

      {/* Table */}
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
        ) : tickets.length === 0 ? (
          <p
            style={{
              padding: "40px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No {status === "answered" ? "answered" : "pending"} tickets.
          </p>
        ) : (
          <table className="users-table support-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Sr. No</th>
                <th style={{ width: "140px" }}>User</th>
                <th>Question</th>
                <th style={{ width: "260px" }}>Answer</th>
                <th style={{ width: "120px" }}>Date</th>
                <th style={{ width: "150px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr key={t._id}>
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
                      {t.userId?.nameEnglish || "-"}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "11px",
                      }}
                    >
                      {t.userId?.rollNumber || "-"}
                    </div>
                  </td>
                  <td style={{ lineHeight: 1.7 }}>{t.question}</td>
                  <td style={{ lineHeight: 1.7 }}>
                    {t.answer ? (
                      <span style={{ color: "#4ade80" }}>{t.answer}</span>
                    ) : (
                      <span
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontStyle: "italic",
                          fontSize: "12px",
                        }}
                      >
                        — Not answered yet —
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      whiteSpace: "nowrap",
                      fontSize: "12.5px",
                    }}
                  >
                    {formatDate(t.createdAt)}
                  </td>
                  <td>
                    {status === "pending" ? (
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleOpenReply(t)}
                      >
                        Reply
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleOpenReply(t)}
                      >
                        View
                      </button>
                    )}{" "}
                    <button
                      type="button"
                      className="table-action danger"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reply/View Modal */}
      {selectedTicket && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={handleCloseModal}
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
                {status === "pending" ? "Reply to Ticket" : "Ticket Details"}
              </h3>
              <button
                onClick={handleCloseModal}
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
                ✕
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
                {selectedTicket.userId?.nameEnglish}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                }}
              >
                Roll No: {selectedTicket.userId?.rollNumber} • Mobile:{" "}
                {selectedTicket.userId?.mobileNumber}
              </p>
            </div>

            {/* Question */}
            <label
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                letterSpacing: "1px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              QUESTION
            </label>
            <p
              style={{
                padding: "12px 14px",
                background: "rgba(0,0,0,0.4)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: "6px",
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              {selectedTicket.question}
            </p>

            {/* Answer */}
            <label
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                letterSpacing: "1px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              ANSWER
            </label>

            {status === "pending" ? (
              <textarea
                rows="4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your reply here..."
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
                  background: "rgba(74,222,128,0.08)",
                  borderLeft: "3px solid #4ade80",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {selectedTicket.answer}
              </p>
            )}

            {message && (
              <p
                style={{
                  marginTop: "14px",
                  color: message.includes("✅") ? "#4ade80" : "#ef4444",
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
                onClick={handleCloseModal}
              >
                Close
              </button>
              {status === "pending" && (
                <button
                  type="button"
                  className="primary"
                  onClick={handleReply}
                  disabled={saving}
                  style={{ padding: "10px 24px" }}
                >
                  {saving ? "Sending..." : "Send Reply"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
