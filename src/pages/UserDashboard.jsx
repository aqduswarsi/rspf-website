import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import {
  getUserProfile,
  getUserDashboardStats,
  getMyResults,
  getAllNews,
} from "../utils/api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    pending: 0,
  });
  const [recentResults, setRecentResults] = useState([]);
  const [news, setNews] = useState([]);
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
      const [userData, statsData, resultsData, newsData] = await Promise.all([
        getUserProfile(),
        getUserDashboardStats().catch(() => ({
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
        })),
        getMyResults().catch(() => []),
        getAllNews().catch(() => []),
      ]);
      setUser(userData);
      setStats(statsData);
      setRecentResults(resultsData.slice(0, 3)); // top 3
      setNews(newsData.slice(0, 2)); // top 2
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
      label: "Total Exams",
      value: stats.total,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Passed",
      value: stats.passed,
      color:
        "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(212,175,55,0.05))",
    },
    {
      label: "Failed",
      value: stats.failed,
      color:
        "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(212,175,55,0.05))",
    },
    {
      label: "Pending",
      value: stats.pending,
      color:
        "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(212,175,55,0.05))",
    },
  ];

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor = (status) => {
    if (status === "Pass") return "#4ade80";
    if (status === "Fail") return "#ef4444";
    return "#f59e0b";
  };

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
              Welcome, {user?.nameEnglish || "Member"}
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
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-footer">
                  View <span>➜</span>
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
                      Rank
                    </td>
                    <td>{user?.rank || "—"}</td>
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
                  <tr>
                    <td style={{ color: "var(--gold)", fontWeight: 600 }}>
                      Zone
                    </td>
                    <td>{user?.zone || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recent Results Card */}
            <div className="users-page">
              <div className="users-header">
                <h2>📊 Recent Results</h2>
              </div>
              {recentResults.length === 0 ? (
                <p
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  No exam results yet.
                </p>
              ) : (
                recentResults.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      padding: "14px",
                      background: "rgba(139,0,0,0.12)",
                      borderLeft: `3px solid ${statusColor(r.status)}`,
                      borderRadius: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <strong
                        style={{ color: "var(--gold)", fontSize: "13px" }}
                      >
                        {r.examId?.title || "Exam"}
                      </strong>
                      <span
                        style={{
                          fontSize: "11px",
                          color: statusColor(r.status),
                          fontWeight: 700,
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Score:{" "}
                      <strong style={{ color: "var(--gold)" }}>
                        {r.totalScore}/{r.maxScore}
                      </strong>{" "}
                      ({r.percentage}%) • {formatDate(r.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* News Card */}
            <div className="users-page">
              <div className="users-header">
                <h2>📰 Latest News</h2>
              </div>
              {news.length === 0 ? (
                <p
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  No news available.
                </p>
              ) : (
                news.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "14px",
                      background: "rgba(139,0,0,0.12)",
                      borderLeft: "3px solid var(--gold)",
                      borderRadius: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--gold)",
                        fontSize: "13px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {n.title}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.6,
                      }}
                    >
                      {n.description || n.content || ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
