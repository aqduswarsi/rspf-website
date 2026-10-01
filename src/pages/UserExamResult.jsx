import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getMyResults, getMyResultById } from "../utils/api";

export default function UserExamResult() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await getMyResults();
      setResults(data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      setLoadingDetail(true);
      setMessage({ text: "", type: "" });
      const data = await getMyResultById(id);
      setSelectedResult(data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedResult(null);
  };

  const handlePrint = (result) => {
    const examTitle = result.examId?.title || "Exam";
    const courseName = result.courseId?.name || "—";
    const subjectName = result.subjectId?.name || "—";
    const dateStr = result.submittedAt
      ? new Date(result.submittedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Exam Result — ${examTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
            h1 { color: #8B0000; border-bottom: 3px solid #D4AF37; padding-bottom: 10px; }
            .badge { display:inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .pass { background: #d1fae5; color: #065f46; }
            .fail { background: #fee2e2; color: #991b1b; }
            .pending { background: #fef3c7; color: #92400e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            td:first-child { font-weight: bold; color: #8B0000; width: 220px; }
            .score { font-size: 32px; font-weight: bold; color: #D4AF37; }
          </style>
        </head>
        <body>
          <h1>RPSF — Exam Result</h1>
          <table>
            <tr><td>Exam</td><td>${examTitle}</td></tr>
            <tr><td>Course</td><td>${courseName}</td></tr>
            <tr><td>Subject</td><td>${subjectName}</td></tr>
            <tr><td>Date</td><td>${dateStr}</td></tr>
            <tr><td>Score</td><td><span class="score">${result.totalScore}/${result.maxScore}</span> (${result.percentage}%)</td></tr>
            <tr><td>Status</td><td><span class="badge ${result.status?.toLowerCase()}">${result.status}</span></td></tr>
            <tr><td>Total Questions</td><td>${result.totalQuestions}</td></tr>
          </table>
          <p style="margin-top:40px; font-style:italic; color:#666;">
            This is a computer-generated document.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor = (status) => {
    if (status === "Pass")
      return {
        bg: "rgba(74,222,128,0.15)",
        color: "#4ade80",
        border: "#4ade80",
      };
    if (status === "Fail")
      return {
        bg: "rgba(239,68,68,0.15)",
        color: "#ef4444",
        border: "#ef4444",
      };
    return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "#f59e0b" };
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          {message.text && (
            <div
              className="form-error"
              style={{
                marginBottom: "16px",
                background: "rgba(239,68,68,0.15)",
                borderColor: "#ef4444",
                color: "#ef4444",
              }}
            >
              {message.text}
            </div>
          )}

          <div className="users-page">
            <div className="users-header">
              <h2>My Exam Results</h2>
              <span
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
              >
                {results.length} {results.length === 1 ? "record" : "records"}
              </span>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px",
                  color: "var(--gold)",
                  fontSize: "14px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Result Records
              </h3>

              <div className="table-wrap">
                {loading ? (
                  <p
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "var(--gold)",
                    }}
                  >
                    Loading results...
                  </p>
                ) : results.length === 0 ? (
                  <p
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    No results yet. Exam submit karo pehle.
                  </p>
                ) : (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Exam</th>
                        <th>Course</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>%</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => {
                        const sc = statusColor(r.status);
                        return (
                          <tr key={r._id}>
                            <td>{i + 1}</td>
                            <td
                              style={{ color: "var(--gold)", fontWeight: 600 }}
                            >
                              {r.examId?.title || "—"}
                            </td>
                            <td>{r.courseId?.name || "—"}</td>
                            <td>{r.subjectId?.name || "—"}</td>
                            <td>
                              {r.totalScore}/{r.maxScore}
                            </td>
                            <td
                              style={{ color: "var(--gold)", fontWeight: 700 }}
                            >
                              {r.percentage}%
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: "11px",
                                  padding: "3px 10px",
                                  borderRadius: "12px",
                                  background: sc.bg,
                                  color: sc.color,
                                  border: `1px solid ${sc.border}`,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                fontSize: "12.5px",
                              }}
                            >
                              {formatDate(r.submittedAt || r.createdAt)}
                            </td>
                            <td>
                              <button
                                onClick={() => handleView(r._id)}
                                className="table-action"
                                style={{ marginRight: "6px" }}
                              >
                                View
                              </button>
                              <button
                                onClick={() => handlePrint(r)}
                                style={{
                                  background: "transparent",
                                  color: "#60a5fa",
                                  border: "1px solid #60a5fa",
                                  padding: "5px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                🖨️ Print
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* ==================== DETAIL MODAL ==================== */}
          {loadingDetail && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "var(--gold)",
              }}
            >
              Loading...
            </div>
          )}

          {selectedResult && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 20px",
                overflowY: "auto",
              }}
              onClick={handleCloseDetail}
            >
              <div
                style={{
                  background: "var(--dark-bg)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  borderRadius: "16px",
                  padding: "28px",
                  maxWidth: "800px",
                  width: "100%",
                  maxHeight: "85vh",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      color: "var(--gold)",
                      margin: 0,
                      fontFamily: "'Rajdhani', sans-serif",
                      letterSpacing: "2px",
                    }}
                  >
                    Result — {selectedResult.examId?.title || "Exam"}
                  </h3>
                  <button
                    onClick={handleCloseDetail}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(212,175,55,0.4)",
                      color: "var(--gold)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Summary */}
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(139,0,0,0.15)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "14px",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      COURSE
                    </p>
                    <p style={{ color: "white", margin: 0 }}>
                      {selectedResult.courseId?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      SUBJECT
                    </p>
                    <p style={{ color: "white", margin: 0 }}>
                      {selectedResult.subjectId?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      SCORE
                    </p>
                    <p
                      style={{
                        color: "var(--gold)",
                        margin: 0,
                        fontWeight: 700,
                      }}
                    >
                      {selectedResult.totalScore}/{selectedResult.maxScore} (
                      {selectedResult.percentage}%)
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      STATUS
                    </p>
                    <p
                      style={{
                        color: statusColor(selectedResult.status).color,
                        margin: 0,
                        fontWeight: 700,
                      }}
                    >
                      {selectedResult.status}
                    </p>
                  </div>
                </div>

                <h4
                  style={{
                    color: "var(--gold)",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "1.5px",
                    marginBottom: "14px",
                  }}
                >
                  Answers
                </h4>

                {selectedResult.answers?.map((a, idx) => {
                  const isWritten = a.type === "Written";
                  const isCorrect = a.isCorrect;

                  return (
                    <div
                      key={a.questionId}
                      style={{
                        padding: "14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        borderLeft: `3px solid ${
                          isWritten
                            ? "#f59e0b"
                            : isCorrect
                              ? "#4ade80"
                              : "#ef4444"
                        }`,
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--gold)",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          Q{idx + 1} — {a.type}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: isWritten
                              ? "#f59e0b"
                              : isCorrect
                                ? "#4ade80"
                                : "#ef4444",
                          }}
                        >
                          {isWritten
                            ? a.reviewed
                              ? `✅ Reviewed (${a.marks}/${a.maxMarks})`
                              : "⏳ Pending Review"
                            : isCorrect
                              ? `✅ Correct (${a.marks}/${a.maxMarks})`
                              : `❌ Wrong (${a.marks}/${a.maxMarks})`}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "13px",
                          margin: "6px 0",
                        }}
                      >
                        {a.questionText}
                      </p>

                      <div style={{ marginTop: "10px", fontSize: "12.5px" }}>
                        <p
                          style={{
                            margin: "4px 0",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          <strong>Your Answer:</strong>{" "}
                          <span style={{ color: "rgba(255,255,255,0.9)" }}>
                            {a.userAnswer || "(Not answered)"}
                          </span>
                        </p>
                        {!isWritten && !isCorrect && (
                          <p
                            style={{
                              margin: "4px 0",
                              color: "rgba(255,255,255,0.6)",
                            }}
                          >
                            <strong>Correct Answer:</strong>{" "}
                            <span style={{ color: "#4ade80" }}>
                              {a.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
