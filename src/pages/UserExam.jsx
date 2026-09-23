import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserExam() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePayFee = () => {
    alert(
      "ℹ️ Payment gateway will be integrated soon.\n\nContact admin for exam fee payment.",
    );
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Exam</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                Online exam portal
              </span>
            </div>

            {/* Warning Banner */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(220, 50, 50, 0.25), rgba(220, 50, 50, 0.1))",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderLeft: "4px solid #ef4444",
                borderRadius: "10px",
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "24px" }}>⚠️</span>
              <div>
                <h3
                  style={{
                    margin: "0 0 4px",
                    color: "#ff6b6b",
                    fontSize: "16px",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "1px",
                  }}
                >
                  Exam Fee Payment Required
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "13px",
                  }}
                >
                  Please complete the exam fee payment to unlock your exam.
                </p>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayFee}
              style={{
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "'Outfit', sans-serif",
                boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(22, 163, 74, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(22, 163, 74, 0.4)";
              }}
            >
              💳 Pay ₹100 Exam Fee
            </button>

            {/* Info Section */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  color: "var(--gold)",
                  fontSize: "14px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                📋 Exam Instructions
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  lineHeight: 2,
                }}
              >
                <li>Exam fee of ₹100 must be paid before starting</li>
                <li>Duration: 30 minutes</li>
                <li>Total questions: 25 (Multiple Choice)</li>
                <li>Passing marks: 50%</li>
                <li>Once started, exam cannot be paused</li>
                <li>Results will be available immediately after submission</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
