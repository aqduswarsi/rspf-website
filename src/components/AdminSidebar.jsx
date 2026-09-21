import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("rpsf_login_name") || "Admin";
  const isUserManagementActive = location.pathname.startsWith("/admin/users");
  const isEducationActive = location.pathname.startsWith("/admin/education");
  const isExamActive = location.pathname.startsWith("/admin/exam");
  const isSupportActive = location.pathname.startsWith("/admin/support");
  const [usersOpen, setUsersOpen] = useState(isUserManagementActive);
  const [educationOpen, setEducationOpen] = useState(isEducationActive);
  const [examOpen, setExamOpen] = useState(isExamActive);
  const [supportOpen, setSupportOpen] = useState(isSupportActive);

  const handleLogout = () => {
    localStorage.removeItem("rpsf_login_token");
    localStorage.removeItem("rpsf_login_logged_in");
    localStorage.removeItem("rpsf_login_name");
    navigate("/login");
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-sidebar-brand">
        <h2>RPSF</h2>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar" aria-hidden="true" />
        <div className="admin-profile-info">
          <strong>{name}</strong>
          <span className="online-status">
            <span className="dot" /> Online
          </span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="nav-section">MAIN NAVIGATION</div>
        <NavLink
          to="/admin"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <div className="nav-section">USERS MANAGEMENT</div>
        <button
          type="button"
          className={`admin-nav-item admin-nav-toggle ${isUserManagementActive ? "active" : ""}`}
          aria-expanded={usersOpen}
          onClick={() => setUsersOpen((open) => !open)}
        >
          <span>User Management</span>
          <span className={`nav-chevron ${usersOpen ? "open" : ""}`} aria-hidden="true">
            ›
          </span>
        </button>
        {usersOpen && (
          <div className="admin-nav-submenu">
            <NavLink
              to="/admin/users/unverified"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              User Unverified
            </NavLink>
            <NavLink
              to="/admin/users/verified"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              User Verified
            </NavLink>
            <NavLink
              to="/admin/users/add"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Add User
            </NavLink>
            <NavLink
              to="/admin/events"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Add Events
            </NavLink>
            <NavLink
              to="/admin/news"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Add News
            </NavLink>
            <NavLink
              to="/admin/gallery"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Gallery
            </NavLink>
          </div>
        )}

        <div className="nav-section">EDUCATIONAL MANAGEMENT</div>
        <button
          type="button"
          className={`admin-nav-item admin-nav-toggle ${isEducationActive ? "active" : ""}`}
          aria-expanded={educationOpen}
          onClick={() => setEducationOpen((open) => !open)}
        >
          <span>Educational Management</span>
          <span className={`nav-chevron ${educationOpen ? "open" : ""}`} aria-hidden="true">
            ›
          </span>
        </button>
        {educationOpen && (
          <div className="admin-nav-submenu">
            <NavLink to="/admin/education/courses" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Manage Course
            </NavLink>
            <NavLink to="/admin/education/subjects" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Manage Subject
            </NavLink>
            <NavLink to="/admin/education/lessons/add" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Manage Lessons
            </NavLink>
            <NavLink to="/admin/education/lessons" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              All Lessons
            </NavLink>
          </div>
        )}

        <div className="nav-section">EXAM MANAGEMENT</div>
        <button
          type="button"
          className={`admin-nav-item admin-nav-toggle ${isExamActive ? "active" : ""}`}
          aria-expanded={examOpen}
          onClick={() => setExamOpen((open) => !open)}
        >
          <span>Exam Management</span>
          <span className={`nav-chevron ${examOpen ? "open" : ""}`} aria-hidden="true">›</span>
        </button>
        {examOpen && (
          <div className="admin-nav-submenu">
            <NavLink to="/admin/exam/questions" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Manage Question
            </NavLink>
            <NavLink to="/admin/exam/results" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Manage Result
            </NavLink>
            <NavLink to="/admin/exam/non-printed" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Non Printed Result
            </NavLink>
            <NavLink to="/admin/exam/printed" onClick={onClose} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
              Printed Result
            </NavLink>
          </div>
        )}

        <div className="nav-section">SUPPORT</div>
        <button
          type="button"
          className={`admin-nav-item admin-nav-toggle ${isSupportActive ? "active" : ""}`}
          aria-expanded={supportOpen}
          onClick={() => setSupportOpen((open) => !open)}
        >
          <span>Support</span>
          <span className={`nav-chevron ${supportOpen ? "open" : ""}`} aria-hidden="true">
            ›
          </span>
        </button>
        {supportOpen && (
          <div className="admin-nav-submenu">
            <NavLink
              to="/admin/support/non-answered"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Non Answered Ticket
            </NavLink>
            <NavLink
              to="/admin/support/answered"
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              Answered Ticket
            </NavLink>
          </div>
        )}

        <div className="nav-section">ACCOUNT</div>
        <NavLink
          to="/admin/change-password"
          onClick={onClose}
          className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
        >
          Change Password
        </NavLink>
        <NavLink
          to="/admin/contact-details"
          onClick={onClose}
          className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
        >
          Add Contact Details
        </NavLink>
        <button onClick={handleLogout} className="admin-nav-item logout">
          Logout
        </button>
      </nav>
    </aside>
  );
}
