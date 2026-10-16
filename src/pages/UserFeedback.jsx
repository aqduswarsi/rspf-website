import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminFeedback from "./AdminFeedback";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserFeedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("rpsf_user_token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="admin-content">
          <AdminFeedback userMode />
        </main>
      </div>
    </div>
  );
}
