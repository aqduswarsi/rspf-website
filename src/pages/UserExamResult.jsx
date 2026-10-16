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
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

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
        bg: "#F0F8F1",
        color: "#15803D",
        border: "#A7DDB2",
      };
    if (status === "Fail")
      return {
        bg: "#FEF2F2",
        color: "#B91C1C",
        border: "#FECACA",
      };
    return { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" };
  };

  const filteredResults = results.filter((result) => {
    const query = searchText.trim().toLowerCase();
    if (
      query &&
      [
        result.examId?.title,
        result.courseId?.name,
        result.subjectId?.name,
        result.status,
      ]
        .filter(Boolean)
        .every((value) => !String(value).toLowerCase().includes(query))
    ) {
      return false;
    }

    if (
      filterStatus &&
      (result.status || "").toLowerCase() !== filterStatus.toLowerCase()
    ) {
      return false;
    }

    const resultDate = result.submittedAt || result.createdAt;
    const date = resultDate ? String(resultDate).slice(0, 10) : "";
    if (filterFromDate && (!date || date < filterFromDate)) return false;
    if (filterToDate && (!date || date > filterToDate)) return false;

    return true;
  });
  const resultStatuses = [
    ...new Set(results.map((result) => result.status).filter(Boolean)),
  ].sort();
  const hasActiveFilters =
    searchText || filterStatus || filterFromDate || filterToDate;

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
                borderColor: "#FECACA",
                color: "#B91C1C",
              }}
            >
              {message.text}
            </div>
          )}

          <div className="users-page">
            <div className="users-header">
              <h2>My Exam Results</h2>
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                {filteredResults.length}
                {filteredResults.length !== results.length &&
                  ` of ${results.length}`}{" "}
                {filteredResults.length === 1 ? "record" : "records"}
              </span>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px",
                  color: "var(--navy)",
                  fontSize: "14px",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Result Records
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  alignItems: "end",
                  marginBottom: "16px",
                }}
              >
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search exam, course, subject..."
                  aria-label="Search exam results"
                  className="search-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  aria-label="Filter results by status"
                  className="search-input"
                >
                  <option value="">All Statuses</option>
                  {resultStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  aria-label="Results submitted from"
                  className="search-input"
                />
                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  aria-label="Results submitted to"
                  className="search-input"
                />
                <button
                  type="button"
                  className="table-action"
                  onClick={() => {
                    setSearchText("");
                    setFilterStatus("");
                    setFilterFromDate("");
                    setFilterToDate("");
                  }}
                  disabled={!hasActiveFilters}
                  style={{
                    padding: "10px 16px",
                    cursor: hasActiveFilters ? "pointer" : "not-allowed",
                    opacity: hasActiveFilters ? 1 : 0.5,
                  }}
                >
                  Clear Filters
                </button>
              </div>

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
                      color: "var(--muted)",
                    }}
                  >
                    No results yet. Exam submit karo pehle.
                  </p>
                ) : filteredResults.length === 0 ? (
                  <p
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "var(--muted)",
                    }}
                  >
                    No results match your filters.
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
                      {filteredResults.map((r, i) => {
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
                  background: "#FFFFFF",
                  border: "1px solid var(--line)",
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
                      color: "var(--navy)",
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
                      border: "1px solid var(--line)",
                      color: "var(--navy)",
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
                    background: "#FCEDE5",
                    border: "1px solid #F5D1BE",
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
                        color: "var(--muted)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      COURSE
                    </p>
                    <p style={{ color: "var(--ink)", margin: 0 }}>
                      {selectedResult.courseId?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--muted)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      SUBJECT
                    </p>
                    <p style={{ color: "var(--ink)", margin: 0 }}>
                      {selectedResult.subjectId?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "var(--muted)",
                        margin: "0 0 4px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                      }}
                    >
                      SCORE
                    </p>
                    <p
                      style={{
                        color: "var(--navy)",
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
                        color: "var(--muted)",
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
                    color: "var(--navy)",
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
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        borderLeft: `3px solid ${
                          isWritten
                            ? "#92400e"
                            : isCorrect
                              ? "#15803d"
                              : "#b91c1c"
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
                            color: "var(--navy)",
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
                              ? "#92400e"
                              : isCorrect
                                ? "#15803d"
                                : "#b91c1c",
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
                          color: "var(--ink)",
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
                            color: "var(--muted)",
                          }}
                        >
                          <strong>Your Answer:</strong>{" "}
                          <span style={{ color: "var(--ink)" }}>
                            {a.userAnswer || "(Not answered)"}
                          </span>
                        </p>
                        {!isWritten && !isCorrect && (
                          <p
                            style={{
                              margin: "4px 0",
                              color: "var(--muted)",
                            }}
                          >
                            <strong>Correct Answer:</strong>{" "}
                            <span style={{ color: "#15803D" }}>
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
