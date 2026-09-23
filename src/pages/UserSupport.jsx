import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Support</h2>
            </div>

            <div style={{ padding: "20px", display: "grid", gap: "16px" }}>
              <div
                style={{
                  padding: "20px",
                  background: "rgba(139,0,0,0.12)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ color: "var(--gold)", margin: "0 0 8px" }}>
                  📞 Helpline
                </h3>
                <p
                  style={{ color: "white", margin: "4px 0", fontSize: "16px" }}
                >
                  182
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                    fontSize: "12px",
                  }}
                >
                  24×7 Railway Helpline
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(139,0,0,0.12)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ color: "var(--gold)", margin: "0 0 8px" }}>
                  ✉️ Email
                </h3>
                <p
                  style={{ color: "white", margin: "4px 0", fontSize: "14px" }}
                >
                  rpsf.tc.gkp@gov.in
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  background: "rgba(139,0,0,0.12)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ color: "var(--gold)", margin: "0 0 8px" }}>
                  📍 Address
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  RPSF Training Center, Rajahi Camp,
                  <br />
                  Gorakhpur, Uttar Pradesh
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
