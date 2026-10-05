import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getMyTickets } from "../utils/api";

export default function UserSupportTicket() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rpsf_user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
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
          <div className="users-page">
            <div className="users-header">
              <h2>Support Ticket List</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>

            {message && (
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
              ) : tickets.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No support tickets yet. Submit your first question from Open
                  Ticket page.
                </p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Sr. No</th>
                      <th style={{ width: "130px" }}>Ticket No</th>
                      <th>Question</th>
                      <th style={{ width: "140px" }}>Reply ?</th>
                      <th style={{ width: "140px" }}>Ticket Date</th>
                      <th style={{ width: "100px" }}>Action</th>
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
                        <td
                          style={{
                            color: "var(--gold)",
                            fontWeight: 600,
                            fontFamily: "monospace",
                          }}
                        >
                          {getTicketNo(t._id)}
                        </td>
                        <td style={{ lineHeight: 1.6, maxWidth: "400px" }}>
                          {t.question}
                        </td>
                        <td>
                          {t.status === "answered" ? (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "3px 10px",
                                borderRadius: "12px",
                                background: "rgba(74,222,128,0.15)",
                                color: "#4ade80",
                                border: "1px solid #4ade80",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Answered
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "3px 10px",
                                borderRadius: "12px",
                                background: "rgba(245,158,11,0.15)",
                                color: "#f59e0b",
                                border: "1px solid #f59e0b",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Pending
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
                          <button
                            type="button"
                            className="table-action"
                            onClick={() => setSelectedTicket(t)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {selectedTicket && (
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
              onClick={() => setSelectedTicket(null)}
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
                    Ticket {getTicketNo(selectedTicket._id)}
                  </h3>
                  <button
                    onClick={() => setSelectedTicket(null)}
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

                <label
                  style={{
                    color: "var(--gold)",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  YOUR QUESTION
                </label>
                <p
                  style={{
                    padding: "12px 14px",
                    background: "rgba(0,0,0,0.4)",
                    borderLeft: "3px solid var(--gold)",
                    borderRadius: "6px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                  }}
                >
                  {selectedTicket.question}
                </p>

                <label
                  style={{
                    color: "var(--gold)",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  ADMIN REPLY
                </label>
                {selectedTicket.answer ? (
                  <p
                    style={{
                      padding: "12px 14px",
                      background: "rgba(74,222,128,0.08)",
                      borderLeft: "3px solid #4ade80",
                      borderRadius: "6px",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "14px",
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedTicket.answer}
                  </p>
                ) : (
                  <p
                    style={{
                      padding: "12px 14px",
                      background: "rgba(245,158,11,0.08)",
                      borderLeft: "3px solid #f59e0b",
                      borderRadius: "6px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "13px",
                      fontStyle: "italic",
                    }}
                  >
                    Admin ne abhi reply nahi kiya. Please wait.
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    className="table-action"
                    onClick={() => setSelectedTicket(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
