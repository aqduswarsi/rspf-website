import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

const subjects = [
  "Acquisition of Intellectual Knowledge",
  "Skill Acquisition",
  "Wealth Generation",
  "Achieving ranks in direct selling companies",
  "Cultivating consciousness",
];

const lessons = [
  "https://directsellingeducation.in/lesson-1/",
  "https://directsellingeducation.in/lesson-2/",
  "https://directsellingeducation.in/lesson-3/",
  "https://directsellingeducation.in/lesson-4/",
  "https://directsellingeducation.in/lesson-5/",
  "https://directsellingeducation.in/lesson-6/",
  "https://directsellingeducation.in/lesson-7/",
  "https://directsellingeducation.in/lesson-8/",
  "https://directsellingeducation.in/lesson-9/",
  "https://directsellingeducation.in/lesson-10/",
];

export default function UserReadCourse() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [subject, setSubject] = useState("");

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Read Course</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                Select Subject
              </span>
            </div>

            {/* Language Selector */}
            <div style={{ marginBottom: "20px" }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="search-input"
                style={{ width: "200px" }}
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "var(--gold)",
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Select Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="search-input"
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div
              style={{
                padding: "16px",
                background: "rgba(139,0,0,0.12)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: "6px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                lineHeight: 1.7,
                marginBottom: "24px",
              }}
            >
              Please click on the text provided below, watch the embedded video
              carefully, and answer the questions asked in the blog's comment
              section.
            </div>

            {/* Lessons List */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {lessons.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(212,175,55,0.15)",
                    borderLeft: "3px solid var(--gold)",
                    borderRadius: "6px",
                    color: "var(--gold)",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139,0,0,0.2)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "rgba(212,175,55,0.6)",
                      minWidth: "28px",
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {url}
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
