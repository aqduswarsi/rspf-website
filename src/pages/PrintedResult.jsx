import { useState, useEffect } from "react";
import { getAllResults, getResultById, updateResult } from "../utils/api";

export default function PrintedResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getAllResults({ isPrinted: true });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const data = await getResultById(id);
      setSelectedResult(data);
      setMessage("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedResult(null);
    setMessage("");
  };

  const handleWrittenMarkChange = (questionId, marks) => {
    setSelectedResult((prev) => ({
      ...prev,
      answers: prev.answers.map((a) =>
        a.questionId === questionId ? { ...a, marks: Number(marks) || 0 } : a,
      ),
    }));
  };

  const handleSaveReview = async () => {
    if (!selectedResult) return;
    setSaving(true);
    setMessage("");

    const writtenAnswers = selectedResult.answers
      .filter((a) => a.type === "Written")
      .map((a) => ({ questionId: a.questionId, marks: a.marks }));

    try {
      await updateResult(selectedResult._id, { answers: writtenAnswers });
      setMessage("✅ Result updated successfully!");
      loadResults();
      setTimeout(() => handleCloseModal(), 1200);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Exam Management</p>
          <h2>Printed Result</h2>
          <p>Results that have been printed.</p>
        </div>
        <span className="record-count">
          {results.length} {results.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="education-panel">
        <div className="panel-heading">
          <h3>Result Records</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : results.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No printed results.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => (
                  <tr key={r._id}>
                    <td>{index + 1}</td>
                    <td>{r.userId?.rollNumber || "-"}</td>
                    <td>{r.userId?.nameEnglish || "-"}</td>
                    <td>{r.userId?.mobileNumber || "-"}</td>
                    <td style={{ maxWidth: "200px" }}>
                      {r.userId?.presentAddress || "-"}
                    </td>
                    <td>{r.courseId?.name || "-"}</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>{r.userId?.category || "-"}</td>
                    <td>
                      {r.totalScore}/{r.maxScore} ({r.percentage}%)
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background:
                            r.status === "Pass"
                              ? "rgba(74,222,128,0.15)"
                              : r.status === "pending"
                                ? "rgba(245,158,11,0.15)"
                                : "rgba(239,68,68,0.15)",
                          color:
                            r.status === "Pass"
                              ? "#4ade80"
                              : r.status === "pending"
                                ? "#f59e0b"
                                : "#ef4444",
                          border: `1px solid ${
                            r.status === "Pass"
                              ? "#4ade80"
                              : r.status === "pending"
                                ? "#f59e0b"
                                : "#ef4444"
                          }`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleView(r._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Modal */}
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
          onClick={handleCloseModal}
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
                Result — {selectedResult.userId?.nameEnglish}
              </h3>
              <button
                onClick={handleCloseModal}
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
                  {selectedResult.courseId?.name}
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
                  {selectedResult.subjectId?.name}
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
                <p style={{ color: "var(--gold)", margin: 0, fontWeight: 700 }}>
                  {selectedResult.totalScore}/{selectedResult.maxScore} (
                  {selectedResult.percentage}%)
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
                  STATUS
                </p>
                <p
                  style={{
                    color:
                      selectedResult.status === "Pass"
                        ? "#4ade80"
                        : selectedResult.status === "pending"
                          ? "#f59e0b"
                          : "#ef4444",
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

            {selectedResult.answers.map((a, idx) => (
              <div
                key={a.questionId}
                style={{
                  padding: "14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderLeft: `3px solid ${
                    a.type === "Written"
                      ? "#f59e0b"
                      : a.isCorrect
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
                      color:
                        a.type === "Written"
                          ? "#f59e0b"
                          : a.isCorrect
                            ? "#4ade80"
                            : "#ef4444",
                    }}
                  >
                    {a.type === "Written"
                      ? a.reviewed
                        ? `✅ Reviewed (${a.marks}/${a.maxMarks})`
                        : "⏳ Pending Review"
                      : a.isCorrect
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
                    style={{ margin: "4px 0", color: "rgba(255,255,255,0.6)" }}
                  >
                    <strong>User Answer:</strong>{" "}
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>
                      {a.userAnswer || "(Not answered)"}
                    </span>
                  </p>
                  {a.type !== "Written" && (
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

                {a.type === "Written" && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label style={{ color: "var(--gold)", fontSize: "12px" }}>
                      Marks:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={a.maxMarks}
                      value={a.marks}
                      onChange={(e) =>
                        handleWrittenMarkChange(a.questionId, e.target.value)
                      }
                      style={{
                        width: "80px",
                        padding: "6px 10px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "13px",
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                      }}
                    >
                      / {a.maxMarks}
                    </span>
                  </div>
                )}
              </div>
            ))}

            {message && (
              <p
                style={{
                  marginTop: "16px",
                  color: message.includes("✅") ? "#4ade80" : "#ef4444",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="table-action"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="primary"
                onClick={handleSaveReview}
                disabled={saving}
                style={{ padding: "10px 24px" }}
              >
                {saving ? "Saving..." : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
