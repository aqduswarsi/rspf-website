export default function StatCard({ label, value, color }) {
  return (
    <div className="stat-box" style={{ background: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-footer">
        More info
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
  );
}
