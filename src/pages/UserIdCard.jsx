import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getUserProfile } from "../utils/api";

export default function UserIdCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rpsf_user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    try {
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="admin-layout">
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main">
          <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="admin-content">
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "var(--gold)",
              }}
            >
              Loading...
            </div>
          </main>
        </div>
      </div>
    );
  }

  const fullLocation =
    [user.presentAddress, user.state].filter(Boolean).join(", ") || "—";

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {/* Action buttons */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  border: "2px dashed #1e3a8a",
                  borderRadius: "8px",
                  padding: "14px",
                  color: "#1e3a8a",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "12px",
                }}
              >
                📷 Choose New Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setUser({ ...user, photo: ev.target.result });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <button
                style={{
                  width: "100%",
                  background: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                }}
                onClick={() => alert("Profile photo updated!")}
              >
                Update Digital ID
              </button>
            </div>

            {/* ==================== ID CARD ==================== */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                background: "white",
              }}
            >
              {/* ---------- Blue Header ---------- */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                  padding: "24px 20px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Logo */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "white",
                    margin: "0 auto 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    border: "3px solid #D4AF37",
                  }}
                >
                  <img
                    src="/rpsf-logo.jpg"
                    alt="RPSF"
                    style={{
                      width: "78px",
                      height: "78px",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <h2
                  style={{
                    color: "white",
                    margin: "0 0 4px",
                    fontSize: "20px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  RPSF DIGITAL
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Railway Protection Special Force
                </p>
              </div>

              {/* ---------- White Body ---------- */}
              <div style={{ padding: "24px 28px", background: "white" }}>
                {/* Profile Photo or Logo circle */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 14px",
                    border: "3px solid #D4AF37",
                    boxShadow: "0 4px 15px rgba(30,58,138,0.15)",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="/rpsf-logo.jpg"
                      alt="RPSF"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                {/* Name + Role */}
                <h3
                  style={{
                    textAlign: "center",
                    margin: "0 0 4px",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#1e3a8a",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  {user.nameEnglish?.toUpperCase() || "MEMBER"}
                </h3>
                <p
                  style={{
                    textAlign: "center",
                    margin: "0 0 20px",
                    fontSize: "12px",
                    color: "#6b7280",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {user.rank || "RPSF Member"}
                </p>

                {/* Dotted divider */}
                <div
                  style={{
                    borderTop: "1px dashed #d1d5db",
                    marginBottom: "20px",
                  }}
                />

                {/* Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <DetailRow
                    icon="🆔"
                    label="User ID"
                    value={user.rollNumber || user.mobileNumber || "—"}
                  />
                  <DetailRow
                    icon="👨"
                    label="Father/Husband"
                    value={user.fatherNameEnglish || "—"}
                  />
                  <DetailRow
                    icon="📞"
                    label="Phone"
                    value={user.mobileNumber || "—"}
                  />
                  <DetailRow
                    icon="✉️"
                    label="Email"
                    value={user.email || "—"}
                  />
                  <DetailRow icon="📍" label="Location" value={fullLocation} />
                </div>
              </div>

              {/* ---------- Bottom Bar ---------- */}
              <div
                style={{
                  background: "#1e3a8a",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  borderTop: "3px solid #D4AF37",
                }}
              >
                <span style={{ fontSize: "16px" }}>🛡️</span>
                <span
                  style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  Authorized Digital Identity Card
                </span>
              </div>
            </div>

            {/* Print Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => window.print()}
                className="btn-copy"
                style={{ padding: "10px 30px" }}
              >
                🖨️ Print ID Card
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ==================== Detail Row Component ====================
function DetailRow({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px" }}>{icon}</span>
        <span
          style={{
            color: "#1e3a8a",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.3px",
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          color: "#374151",
          fontSize: "14px",
          fontWeight: 500,
          maxWidth: "60%",
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );
}
