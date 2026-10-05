import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { createUserTicket, getMyTickets } from "../utils/api";

export default function UserOpenTicket() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rpsf_user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadTickets();
  }, [navigate]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setMessage({ text: "Please enter your question", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      await createUserTicket(question.trim());
      setQuestion("");
      setMessage({
        text: "Ticket submitted successfully",
        type: "success",
      });
      loadTickets();
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSubmitting(false);
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

  const getTicketNo = (id) => {
    if (!id) return "-";
    return "TKT#" + id.slice(-3).toUpperCase();
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          {/* ============ Write Question ============ */}
          <div className="users-page" style={{ marginBottom: "20px" }}>
            <div className="users-header">
              <h2>Open Ticket</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <h3
                style={{
                  margin: "0 0 12px",
                  color: "var(--gold)",
                  fontSize: "14px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Write Question
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <textarea
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setMessage({ text: "", type: "" });
                  }}
                  placeholder="Enter your question here..."
                  rows="6"
                  style={{
                    flex: 1,
                    minWidth: "280px",
                    padding: "14px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "10px",
                    color: "var(--white)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(212,175,55,0.25)")
                  }
                />

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--maroon), var(--maroon-light))",
                    color: "var(--gold)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    padding: "14px 32px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    letterSpacing: "1px",
                    fontFamily: "'Outfit', sans-serif",
                    minWidth: "140px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, var(--gold-dark), var(--gold))";
                      e.currentTarget.style.color = "var(--dark-bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, var(--maroon), var(--maroon-light))";
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {message.text && (
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "13px",
                    color: message.type === "success" ? "#4ade80" : "#ef4444",
                  }}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>

          {/* ============ Support Questions List ============ */}
          <div className="users-page">
            <div className="users-header">
              <h2>Support Questions List</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>

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
                  No tickets yet. Submit your first question above.
                </p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Ticket No</th>
                      <th>Question</th>
                      <th>Reply ?</th>
                      <th>Ticket Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t, i) => (
                      <tr key={t._id}>
                        <td>{i + 1}</td>
                        <td
                          style={{
                            color: "var(--gold)",
                            fontFamily: "monospace",
                            fontWeight: 600,
                          }}
                        >
                          {getTicketNo(t._id)}
                        </td>
                        <td>{t.question}</td>
                        <td>
                          {t.status === "answered" ? (
                            <span style={{ color: "#4ade80", fontWeight: 600 }}>
                              Answered
                            </span>
                          ) : (
                            <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td>{formatDate(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
