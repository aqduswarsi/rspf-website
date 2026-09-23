import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getUserProfile } from "../utils/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main">
          <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="admin-content">
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "var(--gold)",
              }}
            >
              Loading...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main">
          <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="admin-content">
            <div
              style={{ padding: "80px", textAlign: "center", color: "#ef4444" }}
            >
              ❌ {error}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Joining Date",
      value: user?.dateOfEnlistment || "—",
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "My Rank",
      value: user?.rank || "—",
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Zone",
      value: user?.zone || "—",
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Status",
      value: user?.status ? user.status.toUpperCase() : "—",
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
  ];

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          {/* ============ Welcome Banner ============ */}
          <div
            className="referral-block"
            style={{ textAlign: "center", padding: "30px 20px" }}
          >
            <h2
              style={{
                color: "var(--gold)",
                margin: "0 0 8px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "2px",
                fontSize: "24px",
              }}
            >
              Welcome, {user?.nameEnglish || "Member"} 👋
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                fontSize: "14px",
                letterSpacing: "1px",
              }}
            >
              RPSF MEMBER DASHBOARD
            </p>
          </div>

          {/* ============ Stats Cards ============ */}
          <div className="stats-grid">
            {statCards.map((s, i) => (
              <div className="stat-box" key={i} style={{ background: s.color }}>
                <div
                  className="stat-value"
                  style={{
                    fontSize:
                      typeof s.value === "string" && s.value.length > 8
                        ? "24px"
                        : "40px",
                  }}
                >
                  {s.value}
                </div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-footer">
                  My Info <span>➜</span>
                </div>
                <div className="stat-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ))}
          </div>

          {/* ============ Two Column Info ============ */}
          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Profile Card */}
            <div className="users-page">
              <div className="users-header">
                <h2>👤 My Profile</h2>
              </div>
              <table className="users-table" style={{ minWidth: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Roll Number
                    </td>
                    <td>{user?.rollNumber || "—"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Name
                    </td>
                    <td>{user?.nameEnglish || "—"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Phone
                    </td>
                    <td>{user?.mobileNumber || "—"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Email
                    </td>
                    <td>{user?.email || "—"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Blood Group
                    </td>
                    <td>{user?.bloodGroup || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* News Card */}
            <div className="users-page">
              <div className="users-header">
                <h2>📰 Latest News</h2>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "rgba(139,0,0,0.12)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "6px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                <strong style={{ color: "var(--gold)" }}>
                  1. Early Morning Live Classes
                </strong>
                <br />
                Join Zoom Meeting:
                <br />
                🔗{" "}
                <span style={{ color: "var(--gold)" }}>
                  https://us06web.zoom.us/j/81315476933
                </span>
                <br />
                Meeting ID: 813 1547 6933
                <br />
                Passcode: 123
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
