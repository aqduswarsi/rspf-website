import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserOpenTicket() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [tickets, setTickets] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Load from localStorage (temporary — backend baad me)
  useEffect(() => {
    const saved = localStorage.getItem("rpsf_support_tickets");
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch {
        setTickets([]);
      }
    }
  }, []);

  const saveTickets = (newTickets) => {
    setTickets(newTickets);
    localStorage.setItem("rpsf_support_tickets", JSON.stringify(newTickets));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please enter your question");
      return;
    }

    setSubmitting(true);

    const newTicket = {
      id: Date.now(),
      ticketNo: `TKT#${Math.floor(100 + Math.random() * 900)}`,
      question: question.trim(),
      reply: null,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    setQuestion("");
    setSubmitting(false);
    alert("✅ Ticket submitted successfully!");
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
                  onChange={(e) => setQuestion(e.target.value)}
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
            </form>
          </div>

          {/* ============ Support Questions List ============ */}
          <div className="users-page">
            <div className="users-header">
              <h2>Support Questions List</h2>
            </div>

            <div className="table-wrap">
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
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td>{t.ticketNo}</td>
                      <td>{t.question}</td>
                      <td>
                        {t.reply ? (
                          <span style={{ color: "#4ade80", fontWeight: 600 }}>
                            Yes
                          </span>
                        ) : (
                          <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                            Pending
                          </span>
                        )}
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No tickets yet. Submit your first question above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
