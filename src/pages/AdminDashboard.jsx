import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { getAdminDashboard } from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard();
      setData(res);
      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColor = (status) => {
    if (status === "verified" || status === "Pass" || status === "answered")
      return { bg: "#f0f8f1", color: "#15803D", border: "#a7ddb2" };
    if (status === "unverified" || status === "pending")
      return { bg: "#fffbeb", color: "#92400e", border: "#fde68a" };
    return { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" };
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "80px", color: "var(--gold)" }}
      >
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  // ============ STAT CARDS DATA ============
  const userCards = [
    {
      label: "Today Registered",
      value: data.users.todayRegistered,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Unverified Members",
      value: data.users.unverified,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Verified Members",
      value: data.users.verified,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Total Members",
      value: data.users.total,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
  ];

  const examCards = [
    {
      label: "Total Exams",
      value: data.exams.total,
      color:
        "linear-gradient(135deg, rgba(15,35,80,0.25), rgba(30,58,138,0.08))",
    },
    {
      label: "Total Attempts",
      value: data.exams.attempts,
      color:
        "linear-gradient(135deg, rgba(15,35,80,0.25), rgba(30,58,138,0.08))",
    },
    {
      label: "Passed",
      value: data.exams.pass,
      color:
        "linear-gradient(135deg, rgba(21,128,61,0.15), rgba(74,222,128,0.08))",
    },
    {
      label: "Avg Score %",
      value: data.exams.avgScore,
      color:
        "linear-gradient(135deg, rgba(194,65,12,0.15), rgba(245,158,11,0.08))",
    },
  ];

  const contentCards = [
    {
      label: "Courses",
      value: data.content.courses,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.25), rgba(212,175,55,0.08))",
    },
    {
      label: "Subjects",
      value: data.content.subjects,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.25), rgba(212,175,55,0.08))",
    },
    {
      label: "Lessons",
      value: data.content.lessons,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.25), rgba(212,175,55,0.08))",
    },
    {
      label: "Questions",
      value: data.content.questions,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.25), rgba(212,175,55,0.08))",
    },
  ];

  // ============ RENDER ============
  return (
    <>
      {/* USER MANAGEMENT */}
      <div className="user-management-summary">
        <div className="summary-heading">
          <h2>User Management</h2>
          <span>Real-time member overview</span>
        </div>
        <div className="stats-grid">
          {userCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>

      {/* EXAM STATS */}
      <div className="user-management-summary" style={{ marginTop: "24px" }}>
        <div className="summary-heading">
          <h2>Exam Overview</h2>
          <span>Performance &amp; attempts</span>
        </div>
        <div className="stats-grid">
          {examCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>

      {/* CONTENT STATS */}
      <div className="user-management-summary" style={{ marginTop: "24px" }}>
        <div className="summary-heading">
          <h2>Content Library</h2>
          <span>Courses, subjects &amp; material</span>
        </div>
        <div className="stats-grid">
          {contentCards.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="user-management-summary" style={{ marginTop: "24px" }}>
        <div className="summary-heading">
          <h2>Quick Stats</h2>
          <span>Tickets, reattempts, certificates &amp; feedback</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <QuickCard
            title="Pending Tickets"
            value={data.support.pending}
            subValue={`${data.support.answered} answered`}
            accent="#C2410C"
            onClick={() => navigate("/admin/support/non-answered")}
          />
          <QuickCard
            title="Reattempt Requests"
            value={data.reattempts.pending}
            subValue="pending approval"
            accent="#B45309"
            onClick={() => navigate("/admin/exam/reattempt-requests")}
          />
          <QuickCard
            title="Certificates Issued"
            value={data.certificates.total}
            subValue={`${data.certificates.completion} completion + ${data.certificates.training} training`}
            accent="#15803D"
            onClick={() => navigate("/admin/training-certificates")}
          />
          <QuickCard
            title="Feedback Responses"
            value={data.feedback.total}
            subValue={`Avg rating: ${data.feedback.avgRating} / 5`}
            accent="#1E3A8A"
            onClick={() => navigate("/admin/feedback")}
          />
        </div>
      </div>

      {/* RECENT ACTIVITY — 2 COLUMN */}
      <div
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Recent Members */}
        <div className="education-panel" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--navy)",
                fontSize: "15px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Recent Members
            </h3>
            <button
              type="button"
              className="table-action"
              onClick={() => navigate("/admin/users/verified")}
              style={{ fontSize: "11px", padding: "5px 12px" }}
            >
              View All
            </button>
          </div>
          {data.recentMembers.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              No members yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {data.recentMembers.map((m) => {
                const sc = statusColor(m.status);
                return (
                  <div
                    key={m._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 12px",
                      background: "#FFFFFF",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: m.photo
                          ? `url(${m.photo}) center / cover`
                          : "linear-gradient(135deg, #0f2350, #1e3a8a)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "15px",
                        flexShrink: 0,
                      }}
                    >
                      {!m.photo && (m.nameEnglish?.[0] || "?")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--navy)",
                          fontWeight: 600,
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.nameEnglish}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: "var(--muted)",
                          fontSize: "11.5px",
                        }}
                      >
                        Roll: {m.rollNumber || "-"} • {m.zone || "-"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {m.status}
                      </span>
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: "var(--muted)",
                          fontSize: "10.5px",
                        }}
                      >
                        {formatDate(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="education-panel" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--navy)",
                fontSize: "15px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Recent Support Tickets
            </h3>
            <button
              type="button"
              className="table-action"
              onClick={() => navigate("/admin/support/non-answered")}
              style={{ fontSize: "11px", padding: "5px 12px" }}
            >
              View All
            </button>
          </div>
          {data.recentTickets.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              No tickets yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {data.recentTickets.map((t) => {
                const sc = statusColor(t.status);
                return (
                  <div
                    key={t._id}
                    style={{
                      padding: "10px 12px",
                      background: "#FFFFFF",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "var(--navy)",
                          fontWeight: 600,
                          fontSize: "12.5px",
                        }}
                      >
                        {t.userId?.nameEnglish || "Unknown"}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          fontWeight: 700,
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--ink)",
                        fontSize: "12px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.question}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "var(--muted)",
                        fontSize: "10.5px",
                      }}
                    >
                      {formatDateTime(t.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Reattempts */}
        <div className="education-panel" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "var(--navy)",
                fontSize: "15px",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Recent Reattempt Requests
            </h3>
            <button
              type="button"
              className="table-action"
              onClick={() => navigate("/admin/exam/reattempt-requests")}
              style={{ fontSize: "11px", padding: "5px 12px" }}
            >
              View All
            </button>
          </div>
          {data.recentReattempts.length === 0 ? (
            <p
              style={{
                color: "var(--muted)",
                fontSize: "13px",
                textAlign: "center",
                padding: "20px",
              }}
            >
              No reattempt requests yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {data.recentReattempts.map((r) => {
                const sc = statusColor(r.status);
                return (
                  <div
                    key={r._id}
                    style={{
                      padding: "10px 12px",
                      background: "#FFFFFF",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: "var(--navy)",
                          fontWeight: 600,
                          fontSize: "12.5px",
                        }}
                      >
                        {r.userId?.nameEnglish || "Unknown"}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          fontWeight: 700,
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--ink)",
                        fontSize: "12px",
                      }}
                    >
                      {r.examId?.title || "Exam"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "var(--muted)",
                        fontSize: "10.5px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// =========================================================
//              QUICK CARD COMPONENT
// =========================================================

function QuickCard({ title, value, subValue, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "18px 20px",
        background: "#FFFFFF",
        border: "1px solid var(--line)",
        borderLeft: `4px solid ${accent}`,
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(15,35,80,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <p
        style={{
          margin: 0,
          color: "var(--muted)",
          fontSize: "11.5px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "8px 0 4px",
          color: "var(--navy)",
          fontSize: "28px",
          fontWeight: 800,
          fontFamily: "'Rajdhani', sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: "11.5px" }}>
        {subValue}
      </p>
    </div>
  );
}
