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
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
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

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchText.trim().toLowerCase();
    if (
      query &&
      ![
        getTicketNo(ticket._id),
        ticket.question,
        ticket.answer,
        ticket.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ) {
      return false;
    }

    if (filterStatus && ticket.status !== filterStatus) return false;
    const ticketDate = ticket.createdAt
      ? String(ticket.createdAt).slice(0, 10)
      : "";
    if (filterFromDate && (!ticketDate || ticketDate < filterFromDate))
      return false;
    if (filterToDate && (!ticketDate || ticketDate > filterToDate)) return false;

    return true;
  });
  const hasActiveFilters =
    searchText || filterStatus || filterFromDate || filterToDate;

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
                    background: "#FFFFFF",
                    border: "1px solid var(--line)",
                    borderRadius: "10px",
                    color: "var(--ink)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "var(--signal)",
                    color: "#FFFFFF",
                    border: "1px solid var(--signal)",
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
                        "#C94D0A";
                      e.currentTarget.style.color = "#FFFFFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--signal)";
                    e.currentTarget.style.color = "#FFFFFF";
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
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                {filteredTickets.length}
                {filteredTickets.length !== tickets.length &&
                  ` of ${tickets.length}`}{" "}
                {filteredTickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>

            {tickets.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  alignItems: "end",
                  marginBottom: "16px",
                }}
              >
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search ticket, question, reply..."
                  aria-label="Search support tickets"
                  className="search-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  aria-label="Filter tickets by status"
                  className="search-input"
                >
                  <option value="">All Statuses</option>
                  <option value="answered">Answered</option>
                  <option value="pending">Pending</option>
                </select>
                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  aria-label="Tickets from date"
                  className="search-input"
                />
                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  aria-label="Tickets to date"
                  className="search-input"
                />
                <button
                  type="button"
                  className="table-action"
                  onClick={() => {
                    setSearchText("");
                    setFilterStatus("");
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
              ) : tickets.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No tickets yet. Submit your first question above.
                </p>
              ) : filteredTickets.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No tickets match your filters.
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
                    {filteredTickets.map((t, i) => (
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
                            <span style={{ color: "#15803D", fontWeight: 600 }}>
                              Answered
                            </span>
                          ) : (
                            <span style={{ color: "#92400E", fontWeight: 600 }}>
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
