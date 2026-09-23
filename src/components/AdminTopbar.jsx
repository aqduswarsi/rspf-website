import { useLocation, Link } from "react-router-dom";

export default function AdminTopbar({ onMenuClick }) {
  const location = useLocation();
  const path = location.pathname;
  const role = localStorage.getItem("rpsf_login_role") || "admin";
  const displayName = role === "user"
    ? (localStorage.getItem("rpsf_user_name") || "User")
    : (localStorage.getItem("rpsf_login_name") || "Admin");

  const homePath = role === "user" ? "/user/dashboard" : "/admin";

  const titleMap = {
    "/admin": "Dashboard",
    "/admin/users/unverified": "Unverified Users",
    "/admin/users/verified": "Verified Users",
    "/admin/users/add": "Add User",
    "/admin/events": "Add Events",
    "/admin/news": "Add News",
    "/admin/gallery": "Gallery",
    "/admin/education/courses": "Manage Course",
    "/admin/education/subjects": "Manage Subject",
    "/admin/education/lessons/add": "Manage Lessons",
    "/admin/education/lessons": "All Lessons",
    "/admin/exam/questions": "Manage Question",
    "/admin/exam/results": "Manage Result",
    "/admin/exam/non-printed": "Non Printed Result",
    "/admin/exam/printed": "Printed Result",
    "/admin/support": "Support Ticket Report",
    "/admin/support/non-answered": "Non Answered Ticket",
    "/admin/support/answered": "Answered Ticket",
    "/admin/change-password": "Change Password",
    "/admin/contact-details": "Add Contact Details",
  };

  const title = titleMap[path] || "Dashboard";

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="admin-menu-btn" onClick={onMenuClick}>
          Menu
        </button>
        <h1>
          {title} <span className="subtitle">Control panel</span>
        </h1>
      </div>

      <div className="admin-topbar-right">
        <div className="breadcrumb">
          <Link to={homePath}>Home</Link>
          <span>›</span>
          <span>{title}</span>
        </div>
        <div className="topbar-user">
          <div className="avatar">{role === "user" ? "U" : "A"}</div>
          <span>{role === "user" ? "User" : "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
