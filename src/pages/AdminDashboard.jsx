import { useState } from "react";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const [copied, setCopied] = useState(false);
  const referralLink =
    "https://directsellingeducation.com/online_admission/32825325";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Today Registered Members", value: 0, color: "#27ae60" },
    { label: "Unverified Members", value: 5, color: "#27ae60" },
    { label: "Verified Members", value: 8, color: "#27ae60" },
  ];

  return (
    <>
      <div className="referral-block">
        <h3>Referral Link:</h3>
        <div className="referral-row">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyLink} className="btn-copy">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="user-management-summary">
        <div className="summary-heading">
          <h2>User Management</h2>
          <span>Member overview</span>
        </div>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>
    </>
  );
}
