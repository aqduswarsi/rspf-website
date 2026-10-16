import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getAllCourses, getAllSubjects, getAllLessons } from "../utils/api";

export default function UserReadCourse() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [message, setMessage] = useState("");
  const [lessonSearch, setLessonSearch] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (cid) => {
    setCourseId(cid);
    setSubjectId("");
    setLessonSearch("");
    setSubjects([]);
    setLessons([]);
    if (!cid) return;

    try {
      const data = await getAllSubjects(cid);
      setSubjects(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubjectChange = async (sid) => {
    setSubjectId(sid);
    setLessonSearch("");
    setLessons([]);
    if (!sid || !courseId) return;

    try {
      setLoadingLessons(true);
      const data = await getAllLessons(courseId, sid);
      setLessons(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoadingLessons(false);
    }
  };

  const isUrl = (str) => {
    if (!str) return false;
    return /^https?:\/\//i.test(str.trim());
  };

  const filteredLessons = lessons.filter((lesson) => {
    const query = lessonSearch.trim().toLowerCase();
    return (
      !query ||
      [lesson.title, lesson.content]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  });

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="users-page">
            <div className="users-header">
              <h2>Read Course</h2>
            </div>

            {message && (
              <p
                style={{
                  padding: "12px",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                {message}
              </p>
            )}

            {/* Course Selector */}
            <div style={{ marginBottom: "20px" }}>
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
                Select Course
              </label>
              <select
                value={courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="search-input"
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
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
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                disabled={!courseId}
                className="search-input"
                style={{ width: "100%", maxWidth: "400px" }}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            {subjectId && (
              <div
                style={{
                  padding: "16px",
                  background: "#FCEDE5",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "6px",
                  color: "var(--ink)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                Please click on the content provided below. You can open the
                lesson link or download the PDF study material.
              </div>
            )}

            {/* Lessons List */}
            {loadingLessons ? (
              <p
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                Loading lessons...
              </p>
            ) : !subjectId ? (
              <p
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                Select a course and subject to view study material.
              </p>
            ) : lessons.length === 0 ? (
              <p
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                No study material available for this subject yet.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(220px, 1fr) auto",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <input
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder="Search lesson title or content..."
                    aria-label="Search study materials"
                    className="search-input"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                    {filteredLessons.length} of {lessons.length} lessons
                  </span>
                </div>
                {filteredLessons.length === 0 ? (
                  <p
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                  >
                    No lessons match your search.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {filteredLessons.map((lesson, i) => (
                  <div
                    key={lesson._id}
                    style={{
                      padding: "16px 20px",
                      background: "#FFFFFF",
                      border: "1px solid var(--line)",
                      borderLeft: "3px solid var(--gold)",
                      borderRadius: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--muted)",
                          minWidth: "32px",
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: "16px",
                          paddingTop: "2px",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <div style={{ flex: 1 }}>
                        {lesson.title && (
                          <h4
                            style={{
                              margin: "0 0 6px",
                              color: "var(--navy)",
                              fontFamily: "'Rajdhani', sans-serif",
                              fontSize: "15px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {lesson.title}
                          </h4>
                        )}

                        {lesson.content && !isUrl(lesson.content) && (
                          <p
                            style={{
                              margin: "0 0 10px",
                              color: "var(--ink)",
                              fontSize: "13.5px",
                              lineHeight: 1.6,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {lesson.content}
                          </p>
                        )}

                        {/* Action buttons */}
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "8px",
                          }}
                        >
                          {isUrl(lesson.content) && (
                            <a
                              href={lesson.content.trim()}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: "8px 18px",
                                background: "#FFFFFF",
                                border: "1px solid var(--gold)",
                                borderRadius: "6px",
                                color: "var(--signal)",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#FCEDE5";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#FFFFFF";
                              }}
                            >
                              Open Lesson Link
                            </a>
                          )}

                          {lesson.pdfUrl && (
                            <a
                              href={lesson.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={
                                lesson.title
                                  ? `${lesson.title}.pdf`
                                  : `lesson-${i + 1}.pdf`
                              }
                              style={{
                                padding: "8px 18px",
                                background: "#C2410C",
                                border: "1px solid #C2410C",
                                borderRadius: "6px",
                                color: "#FFFFFF",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#9A3412";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#C2410C";
                              }}
                            >
                              Download PDF
                            </a>
                          )}

                          {!isUrl(lesson.content) &&
                            !lesson.pdfUrl &&
                            !lesson.title && (
                              <span
                                style={{
                                  color: "var(--muted)",
                                  fontSize: "12px",
                                  fontStyle: "italic",
                                }}
                              >
                                No content available
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
