import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import { getStats } from "../utils/api";

export default function AdminDashboard() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unverified: 0,
    verified: 0,
    blocked: 0,
    todayRegistered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const referralLink =
    "https://directsellingeducation.com/online_admission/32825325";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      console.log("Stats loaded:", data);
      setStats(data);
      setError("");
    } catch (err) {
      console.error("Stats error:", err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    {
      label: "Today Registered",
      value: stats.todayRegistered,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Unverified Members",
      value: stats.unverified,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Verified Members",
      value: stats.verified,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
    {
      label: "Total Members",
      value: stats.total,
      color:
        "linear-gradient(135deg, rgba(139,0,0,0.35), rgba(212,175,55,0.08))",
    },
  ];

  return (
    <>
      <div className="referral-block">
        <h3>Referral Link:</h3>
        <div className="referral-row">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyLink} className="btn-copy">
            {copied ? "✅ Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="user-management-summary">
        <div className="summary-heading">
          <h2>User Management</h2>
          <span>Real-time member overview</span>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--gold)",
            }}
          >
            Loading stats...
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#ef4444",
            }}
          >
            ❌ {error}
          </div>
        ) : (
          <div className="stats-grid">
            {statCards.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
