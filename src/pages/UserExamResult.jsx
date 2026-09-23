import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserExamResult() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data — baad me backend se aayega
  const results = [
    {
      idNo: "37270974",
      name: "JEETAN",
      sponsorCode: "32825325",
      mobile: "9118382581",
      address: "VILLAGE POST KACHANARWA PS KONE",
      class:
        "STEP 01 Basic Diploma in Conceptual Knowledge of Direct Selling: 'Tarkash Astra'",
      date: "11-Jul-2026",
      category: "Silver",
    },
  ];

  const handlePrint = (result) => {
    // Simple print — new window open karo
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Exam Result — ${result.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1e3a8a; border-bottom: 3px solid #D4AF37; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            td:first-child { font-weight: bold; color: #1e3a8a; width: 200px; }
          </style>
        </head>
        <body>
          <h1>RPSF — Exam Result Certificate</h1>
          <table>
            <tr><td>ID No</td><td>${result.idNo}</td></tr>
            <tr><td>Name</td><td>${result.name}</td></tr>
            <tr><td>Sponsor Code</td><td>${result.sponsorCode}</td></tr>
            <tr><td>Mobile No</td><td>${result.mobile}</td></tr>
            <tr><td>Address</td><td>${result.address}</td></tr>
            <tr><td>Class</td><td>${result.class}</td></tr>
            <tr><td>Date</td><td>${result.date}</td></tr>
            <tr><td>Category</td><td>${result.category}</td></tr>
          </table>
          <p style="margin-top:40px; font-style:italic; color:#666;">
            This is a computer-generated document.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Generated Result List</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                All Records
              </span>
            </div>

            {/* Result Records Sub-heading */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px",
                  color: "var(--gold)",
                  fontSize: "14px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Result Records
              </h3>

              <div className="table-wrap">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Id No</th>
                      <th>Name</th>
                      <th>Sponsor Code</th>
                      <th>Mobile No</th>
                      <th>Address</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{r.idNo}</td>
                        <td>{r.name}</td>
                        <td>{r.sponsorCode}</td>
                        <td>{r.mobile}</td>
                        <td>{r.address}</td>
                        <td style={{ maxWidth: "280px" }}>{r.class}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{r.date}</td>
                        <td>{r.category}</td>
                        <td>
                          <button
                            onClick={() => handlePrint(r)}
                            style={{
                              background: "transparent",
                              color: "#60a5fa",
                              border: "1px solid #60a5fa",
                              padding: "5px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#60a5fa";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "#60a5fa";
                            }}
                          >
                            🖨️ Print
                          </button>
                        </td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan="10" className="empty-row">
                          No results generated yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
