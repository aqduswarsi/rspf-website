import { useState, useEffect } from "react";
import { getAllResults, getResultById, updateResult } from "../utils/api";

export default function NonPrintedResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Filters & Pagination
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getAllResults({ isPrinted: false });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
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

  const handleMarkPrinted = async (id) => {
    if (!window.confirm("Mark as printed?")) return;
    try {
      await updateResult(id, { isPrinted: true });
      loadResults();
    } catch (err) {
      alert("❌ " + err.message);
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

  // --- Filter & Pagination Logic ---
  const filteredResults = results.filter((r) => {
    const q = searchText.toLowerCase();
    const name = (r.userId?.nameEnglish || "").toLowerCase();
    const idNo = (r.userId?.rollNumber || "").toLowerCase();
    const mobile = (r.userId?.mobileNumber || "").toLowerCase();
    const course = (r.courseId?.name || "").toLowerCase();

    const matchesSearch =
      name.includes(q) ||
      idNo.includes(q) ||
      mobile.includes(q) ||
      course.includes(q);
    const matchesStatus = filterStatus ? r.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- Select All Logic ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedResults.map((r) => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- Bulk Print Logic ---
  const handleBulkPrint = () => {
    if (selectedIds.length === 0)
      return alert("Please select at least one result to print.");

    const printWindow = window.open("", "_blank");
    const selectedData = results.filter((r) => selectedIds.includes(r._id));

    const htmlContent = `
      <html>
        <head>
          <title>Print Results</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .result-card { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; page-break-inside: avoid; }
            .header { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px; }
            .score { font-size: 18px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          </style>
        </head>
        <body>
          <h2>Exam Results</h2>
          ${selectedData
            .map(
              (r) => `
            <div class="result-card">
              <div class="header">
                <div>
                  <h3 style="margin:0">${r.userId?.nameEnglish || "-"}</h3>
                  <p style="margin:4px 0; color:#666; font-size:12px">ID: ${r.userId?.rollNumber || "-"} | Mobile: ${r.userId?.mobileNumber || "-"}</p>
                </div>
                <div style="text-align:right">
                  <div class="score">${r.totalScore}/${r.maxScore} (${r.percentage}%)</div>
                  <span style="color:${r.status === "Pass" ? "green" : "red"}; font-weight:bold">${r.status}</span>
                </div>
              </div>
              <p style="font-size:12px; margin:4px 0"><strong>Course:</strong> ${r.courseId?.name || "-"}</p>
              <p style="font-size:12px; margin:4px 0"><strong>Date:</strong> ${formatDate(r.createdAt)}</p>
              <table>
                <thead><tr><th>Question</th><th>User Answer</th><th>Result</th></tr></thead>
                <tbody>
                  ${r.answers
                    .map(
                      (a, i) => `
                    <tr>
                      <td>${i + 1}. ${a.questionText}</td>
                      <td>${a.userAnswer || "-"}</td>
                      <td>${a.marks}/${a.maxMarks}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `,
            )
            .join("")}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // --- Styles ---
  const inputStyle = {
    padding: "10px 12px",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    color: "var(--ink)",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Exam Management</p>
          <h2>Non Printed Result</h2>
          <p>Results that are not yet printed.</p>
        </div>
        <span className="record-count">
          {results.length} {results.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="education-panel">
        <div className="panel-heading">
          <h3>Result Records</h3>
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px auto auto",
            gap: "12px",
            alignItems: "end",
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--navy)",
                marginBottom: "6px",
                display: "block",
              }}
            >
              Search
            </label>
            <input
              type="search"
              placeholder="Search by Name, ID, Mobile, Course..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--navy)",
                marginBottom: "6px",
                display: "block",
              }}
            >
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={inputStyle}
            >
              <option value="">All Status</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button
            className="table-action"
            onClick={() => {
              setSearchText("");
              setFilterStatus("");
              setCurrentPage(1);
            }}
            style={{ padding: "10px 16px", height: "40px" }}
          >
            Clear
          </button>
          <button
            className="primary"
            onClick={handleBulkPrint}
            disabled={selectedIds.length === 0}
            style={{
              padding: "10px 20px",
              height: "40px",
              opacity: selectedIds.length === 0 ? 0.5 : 1,
            }}
          >
            Print Selected ({selectedIds.length})
          </button>
        </div>

        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : filteredResults.length === 0 ? (
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No records found.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        paginatedResults.length > 0 &&
                        selectedIds.length === paginatedResults.length
                      }
                    />
                  </th>
                  <th>#</th>
                  <th>Id No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((r, index) => (
                  <tr key={r._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r._id)}
                        onChange={() => handleSelectOne(r._id)}
                      />
                    </td>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{r.userId?.rollNumber || "-"}</td>
                    <td>{r.userId?.nameEnglish || "-"}</td>
                    <td>{r.userId?.mobileNumber || "-"}</td>
                    <td>{r.courseId?.name || "-"}</td>
                    <td>{formatDate(r.createdAt)}</td>
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
                              ? "#15803D"
                              : r.status === "pending"
                                ? "#92400E"
                                : "#B91C1C",
                          border: `1px solid ${r.status === "Pass" ? "#A7DDB2" : r.status === "pending" ? "#FDE68A" : "#FECACA"}`,
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
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleMarkPrinted(r._id)}
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid var(--line)",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredResults.length)} of{" "}
              {filteredResults.length} entries
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="table-action"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <button
                className="table-action"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                style={{
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Same Modal as before... */}
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
                Result Review — {selectedResult.userId?.nameEnglish}
              </h3>
              <button
                onClick={handleCloseModal}
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
                  {selectedResult.courseId?.name}
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
                  {selectedResult.subjectId?.name}
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
                <p style={{ color: "var(--navy)", margin: 0, fontWeight: 700 }}>
                  {selectedResult.totalScore}/{selectedResult.maxScore} (
                  {selectedResult.percentage}%)
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
                  STATUS
                </p>
                <p
                  style={{
                    color:
                      selectedResult.status === "Pass"
                        ? "#15803D"
                        : selectedResult.status === "pending"
                          ? "#92400E"
                          : "#B91C1C",
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
            {selectedResult.answers.map((a, idx) => (
              <div
                key={a.questionId}
                style={{
                  padding: "14px",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderLeft: `3px solid ${a.type === "Written" ? "#92400e" : a.isCorrect ? "#15803d" : "#b91c1c"}`,
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
                      color:
                        a.type === "Written"
                          ? "#92400e"
                          : a.isCorrect
                            ? "#15803d"
                            : "#b91c1c",
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
                    color: "var(--ink)",
                    fontSize: "13px",
                    margin: "6px 0",
                  }}
                >
                  {a.questionText}
                </p>
                <div style={{ marginTop: "10px", fontSize: "12.5px" }}>
                  <p style={{ margin: "4px 0", color: "var(--muted)" }}>
                    <strong>User Answer:</strong>{" "}
                    <span style={{ color: "var(--ink)" }}>
                      {a.userAnswer || "(Not answered)"}
                    </span>
                  </p>
                  {a.type !== "Written" && (
                    <p style={{ margin: "4px 0", color: "var(--muted)" }}>
                      <strong>Correct Answer:</strong>{" "}
                      <span style={{ color: "#15803D" }}>
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
                    <label style={{ color: "var(--navy)", fontSize: "12px" }}>
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
                        background: "#FFFFFF",
                        border: "1px solid var(--line)",
                        borderRadius: "6px",
                        color: "var(--ink)",
                        fontSize: "13px",
                      }}
                    />
                    <span style={{ color: "var(--muted)", fontSize: "12px" }}>
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
                  color: message.includes("✅") ? "#15803D" : "#B91C1C",
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
