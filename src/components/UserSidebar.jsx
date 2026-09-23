import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const name = localStorage.getItem("rpsf_user_name") || "Member";
  const [accountOpen, setAccountOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("rpsf_user_token");
    localStorage.removeItem("rpsf_user_name");
    localStorage.removeItem("rpsf_login_role");
    navigate("/login");
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-sidebar-brand">
        <h2>RPSF MEMBER</h2>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar">
          <span style={{ fontSize: "16px", fontWeight: "700" }}>
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="admin-profile-info">
          <strong>{name}</strong>
          <span className="online-status">
            <span className="dot" /> Online
          </span>
        </div>
      </div>

      <nav className="admin-nav" onClick={onClose}>
        <div className="nav-section">MAIN NAVIGATION</div>
        <NavLink
          to="/user/dashboard"
          end
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        {/* ============ MY ACCOUNT ============ */}
        <button
          type="button"
          className="admin-nav-item"
          onClick={(e) => {
            e.stopPropagation();
            setAccountOpen(!accountOpen);
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>My Account</span>
          <span style={{ fontSize: "10px", opacity: 0.6 }}>
            {accountOpen ? "▼" : "▶"}
          </span>
        </button>

        {accountOpen && (
          <div style={{ paddingLeft: "12px" }}>
            <NavLink
              to="/user/account/profile"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Profile Update
            </NavLink>
            <NavLink
              to="/user/account/id-card"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              ID Card
            </NavLink>
          </div>
        )}

        {/* ============ MY COURSE ============ */}
        <button
          type="button"
          className="admin-nav-item"
          onClick={(e) => {
            e.stopPropagation();
            setCourseOpen(!courseOpen);
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>My Course</span>
          <span style={{ fontSize: "10px", opacity: 0.6 }}>
            {courseOpen ? "▼" : "▶"}
          </span>
        </button>

        {courseOpen && (
          <div style={{ paddingLeft: "12px" }}>
            <NavLink
              to="/user/course/read"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              I Read Your Course
            </NavLink>
            <NavLink
              to="/user/course/exam"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Exam
            </NavLink>
            <NavLink
              to="/user/course/result"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Exam Result
            </NavLink>
          </div>
        )}

        {/* ============ ACCOUNT ============ */}
        <div className="nav-section">ACCOUNT</div>
        <NavLink
          to="/user/change-password"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          Change Password
        </NavLink>

        {/* ============ SUPPORT (Expandable) ============ */}
        <button
          type="button"
          className="admin-nav-item"
          onClick={(e) => {
            e.stopPropagation();
            setSupportOpen(!supportOpen);
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Support</span>
          <span style={{ fontSize: "10px", opacity: 0.6 }}>
            {supportOpen ? "▼" : "▶"}
          </span>
        </button>

        {supportOpen && (
          <div style={{ paddingLeft: "12px" }}>
            <NavLink
              to="/user/support/open"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Open Ticket
            </NavLink>
            <NavLink
              to="/user/support/tickets"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Support Ticket
            </NavLink>
          </div>
        )}

        <button onClick={handleLogout} className="admin-nav-item logout">
          Logout
        </button>
      </nav>
    </aside>
  );
}
