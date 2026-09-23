import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserSupportTicket() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

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

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Support Ticket List</h2>
            </div>

            <div className="table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Ticket No</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Ticket Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td>{t.ticketNo}</td>
                      <td>{t.question}</td>
                      <td style={{ color: "rgba(255,255,255,0.7)" }}>
                        {t.reply ? (
                          t.reply
                        ) : (
                          <span
                            style={{
                              color: "#f59e0b",
                              fontStyle: "italic",
                              fontSize: "12px",
                            }}
                          >
                            ⏳ Awaiting reply
                          </span>
                        )}
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No support tickets yet.
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
