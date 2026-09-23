import { useLocation, Link } from "react-router-dom";

export default function UserTopbar({ onMenuClick }) {
  const location = useLocation();
  const path = location.pathname;

  const titleMap = {
    "/user/dashboard": "Dashboard",
    "/user/profile": "My Profile",
    "/user/news": "News",
    "/user/events": "Events",
    "/user/gallery": "Gallery",
  };

  const title = titleMap[path] || "Dashboard";

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="admin-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h1>
          {title} <span className="subtitle">Member panel</span>
        </h1>
      </div>

      <div className="admin-topbar-right">
        <div className="breadcrumb">
          <Link to="/user/dashboard">🏠 Home</Link>
          <span>›</span>
          <span>{title}</span>
        </div>
        <div className="topbar-user">
          <div className="avatar">👤</div>
          <span>Member</span>
        </div>
      </div>
    </header>
  );
}
