import { Navigate, Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import "../styles/admin.css";

export default function UserLayout() {
  const token = localStorage.getItem("rpsf_user_token") || localStorage.getItem("rpsf_login_token");

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout user-layout">
      <UserSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1>Dashboard <span className="subtitle">User panel</span></h1>
          </div>
          <div className="admin-topbar-right">
            <div className="topbar-user">
              <div className="avatar">U</div>
              <span>{localStorage.getItem("rpsf_user_name") || localStorage.getItem("rpsf_login_name") || "User"}</span>
            </div>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}