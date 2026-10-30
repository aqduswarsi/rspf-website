import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  createCertificate,
  bulkCreateCertificates,
  getAllCertificates,
  deleteCertificate,
} from "../utils/api";

const initialForm = {
  name: "",
  certificateId: "",
  quizName: "",
  courseName: "",
  score: "",
  grade: "",
  completedOn: new Date().toISOString().split("T")[0],
  place: "RPSF/TC/GKP",
  dateOfIssue: new Date().toISOString().split("T")[0],
  watermark: "",
  signatures: [
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
  ],
};

const formatExcelDate = (value) => {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    }
    return "";
  }
  const dateText = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(dateText)) return dateText.slice(0, 10);
  const dayFirstDate = dateText.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dayFirstDate) {
    return `${dayFirstDate[3]}-${dayFirstDate[2].padStart(2, "0")}-${dayFirstDate[1].padStart(2, "0")}`;
  }
  const parsedDate = new Date(dateText);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
};

export default function AdminCertificate() {
  const [form, setForm] = useState(initialForm);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewCert, setPreviewCert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [printAllMode, setPrintAllMode] = useState(false);

  // Bulk
  const [showBulk, setShowBulk] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFile, setBulkFile] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkWatermark, setBulkWatermark] = useState("");
  const [bulkSignatures, setBulkSignatures] = useState([
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
  ]);
  const fileInputRef = useRef(null);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterQuiz, setFilterQuiz] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllCertificates();
      setCerts(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSignatureChange = (index, field, value) => {
    const updated = [...form.signatures];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, signatures: updated });
  };

  const handleImageUpload = (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Only image files allowed");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setMessage("Max 1MB image allowed");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "watermark") {
        setForm((prev) => ({ ...prev, watermark: reader.result }));
      } else {
        handleSignatureChange(index, "image", reader.result);
      }
      setMessage("");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.certificateId ||
      !form.courseName ||
      !form.completedOn
    ) {
      setMessage("Name, Certificate ID, Course and Completed On are required");
      return;
    }
    try {
      setSaving(true);
      setMessage("");
      await createCertificate({
        ...form,
        score: form.score ? Number(form.score) : 0,
      });
      setMessage("Certificate created successfully");
      setForm(initialForm);
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await deleteCertificate(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============ FILTERS ============
  const filteredCerts = certs.filter((cert) => {
    const query = searchText.trim().toLowerCase();
    if (
      query &&
      ![cert.name, cert.certificateId, cert.quizName, cert.courseName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ) {
      return false;
    }
    if (filterCourse && cert.courseName !== filterCourse) return false;
    if (filterQuiz && cert.quizName !== filterQuiz) return false;
    const completedDate = cert.completedOn
      ? String(cert.completedOn).slice(0, 10)
      : "";
    if (filterFromDate && (!completedDate || completedDate < filterFromDate))
      return false;
    if (filterToDate && (!completedDate || completedDate > filterToDate))
      return false;
    return true;
  });

  const certificateCourses = [
    ...new Set(certs.map((cert) => cert.courseName).filter(Boolean)),
  ].sort();
  const certificateQuizzes = [
    ...new Set(certs.map((cert) => cert.quizName).filter(Boolean)),
  ].sort();
  const hasActiveFilters =
    searchText || filterCourse || filterQuiz || filterFromDate || filterToDate;

  const clearFilters = () => {
    setSearchText("");
    setFilterCourse("");
    setFilterQuiz("");
    setFilterFromDate("");
    setFilterToDate("");
  };

  // ============ PRINT ALL ============
  const handlePrintAll = () => {
    if (filteredCerts.length === 0) {
      setMessage("No certificates to print");
      return;
    }
    setPrintAllMode(true);
    setTimeout(() => {
      window.print();
      setPrintAllMode(false);
    }, 500);
  };

  // ==================== BULK UPLOAD ====================
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkFile(file.name);
    setBulkRows([]);
    setMessage("");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, {
          type: "binary",
          cellDates: true,
        });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
        if (data.length === 0) {
          setMessage("Excel file is empty");
          return;
        }
        const mappedRows = data.map((row, index) => {
          const normalizedHeaders = Object.keys(row).reduce((headers, key) => {
            headers[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = key;
            return headers;
          }, {});
          const get = (keys) => {
            const key = keys
              .map((name) => normalizedHeaders[name])
              .find(Boolean);
            return key ? String(row[key] ?? "").trim() : "";
          };
          return {
            _rowNumber: index + 2,
            name: get(["name", "participantname", "studentname"]),
            certificateId: get(["certificateid", "certid", "id"]),
            quizName: get(["quizname", "quiz", "quiztitle"]),
            courseName: get(["coursename", "course", "coursetitle"]),
            score: get(["score", "marks", "percentage"]),
            grade: get(["grade", "gradepoint"]),
            completedOn: formatExcelDate(
              row[
                normalizedHeaders.completedon ||
                  normalizedHeaders.completed ||
                  normalizedHeaders.completiondate
              ],
            ),
            place: get(["place"]) || "RPSF/TC/GKP",
            dateOfIssue:
              formatExcelDate(
                row[normalizedHeaders.dateofissue || normalizedHeaders.issue],
              ) || new Date().toISOString().split("T")[0],
          };
        });
        setBulkRows(mappedRows);
        setMessage(
          `${mappedRows.length} rows detected. Verify the data and click Generate.`,
        );
      } catch (err) {
        setMessage(`Failed to read Excel: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkImageUpload = (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Only image files allowed");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setMessage("Max 1MB image allowed");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "watermark") {
        setBulkWatermark(reader.result);
      } else {
        const updated = [...bulkSignatures];
        updated[index] = { ...updated[index], image: reader.result };
        setBulkSignatures(updated);
      }
      setMessage("");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleBulkSignatureChange = (index, field, value) => {
    const updated = [...bulkSignatures];
    updated[index] = { ...updated[index], [field]: value };
    setBulkSignatures(updated);
  };

  const handleBulkGenerate = async () => {
    if (bulkRows.length === 0) {
      setMessage("Please upload an Excel file first");
      return;
    }

    setBulkSaving(true);
    setMessage("");

    const cleanSignatures = bulkSignatures.filter(
      (s) => s.image || s.officerName || s.rank,
    );
    const validRows = [];
    const failedRows = [];

    for (const row of bulkRows) {
      const score = Number(row.score);
      const missingFields = [
        ["name", row.name],
        ["certificateId", row.certificateId],
        ["completedOn", row.completedOn],
      ]
        .filter(([, value]) => !value)
        .map(([field]) => field);

      if (missingFields.length > 0) {
        failedRows.push({
          ...row,
          _error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        continue;
      }
      if (row.score && (!Number.isFinite(score) || score < 0 || score > 100)) {
        failedRows.push({ ...row, _error: "Score must be between 0 and 100" });
        continue;
      }
      validRows.push(row);
    }

    if (validRows.length === 0) {
      setBulkRows(failedRows);
      setMessage(`${failedRows.length} rows failed. Fix errors and retry.`);
      setBulkSaving(false);
      return;
    }

    try {
      const result = await bulkCreateCertificates({
        certificates: validRows.map((r) => ({
          name: r.name,
          certificateId: r.certificateId,
          quizName: r.quizName,
          courseName: r.courseName,
          score: Number(r.score) || 0,
          grade: r.grade || "",
          completedOn: r.completedOn,
          place: r.place,
          dateOfIssue: r.dateOfIssue,
        })),
        watermark: bulkWatermark,
        signatures: cleanSignatures,
      });

      if (failedRows.length === 0) {
        setMessage(`${result.created} certificates generated successfully`);
        setBulkRows([]);
        setBulkFile("");
        setBulkWatermark("");
        setBulkSignatures([
          { image: "", officerName: "", rank: "" },
          { image: "", officerName: "", rank: "" },
        ]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setShowBulk(false);
      } else {
        setBulkRows(failedRows);
        setMessage(
          `${result.created} certificates generated successfully. ${failedRows.length} failed; failed rows retained.`,
        );
      }
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBulkSaving(false);
    }
  };

  const resetBulk = () => {
    setShowBulk(false);
    setBulkRows([]);
    setBulkFile("");
    setBulkWatermark("");
    setBulkSignatures([
      { image: "", officerName: "", rank: "" },
      { image: "", officerName: "", rank: "" },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage("");
  };

  const downloadSampleExcel = () => {
    const sample = [
      {
        name: "Pramod Kumar Singh",
        certificateId: "504NPS04486",
        quizName: "Pre Assessment Quiz",
        courseName: "For testing purpose",
        score: 80,
        grade: "A",
        completedOn: "2026-05-20",
        place: "RPSF/TC/GKP",
        dateOfIssue: "2026-05-20",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");
    XLSX.writeFile(workbook, "certificates-sample.xlsx");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    color: "var(--ink)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    color: "var(--muted)",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
  };
  const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  };

  const isPositiveMessage =
    (message.toLowerCase().includes("success") ||
      message.toLowerCase().includes("detected")) &&
    !message.toLowerCase().includes("failed");

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Certificates</p>
          <h2>Generate Certificate</h2>
          <p>Create completion certificates for participants.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="table-action"
            onClick={() => {
              if (showBulk) {
                resetBulk();
              } else {
                setShowBulk(true);
                setShowForm(false);
                setMessage("");
              }
            }}
            style={{ padding: "10px 20px" }}
          >
            {showBulk ? "Close Bulk" : "Bulk Upload (Excel)"}
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setShowForm((visible) => !visible);
              setShowBulk(false);
              setMessage("");
            }}
            style={{ padding: "10px 24px" }}
          >
            {showForm ? "Close Form" : "New Certificate"}
          </button>
        </div>
      </div>

      {message && (
        <p
          style={{
            padding: "12px",
            background: isPositiveMessage
              ? "rgba(74,222,128,0.15)"
              : "rgba(239,68,68,0.15)",
            border: `1px solid ${isPositiveMessage ? "#4ade80" : "#ef4444"}`,
            color: isPositiveMessage ? "#15803D" : "#B91C1C",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </p>
      )}

      {/* ==================== BULK UPLOAD ==================== */}
      {showBulk && (
        <div
          className="education-panel"
          style={{ padding: "20px", marginBottom: "24px" }}
        >
          <h3 style={{ marginTop: 0 }}>Bulk Upload from Excel</h3>
          <div
            style={{
              padding: "16px",
              background: "#F8F7F4",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "0 0 12px", fontSize: "13px" }}>
              Excel columns:{" "}
              <strong>
                name, certificateId, quizName, courseName, score, grade,
                completedOn, place, dateOfIssue
              </strong>
            </p>
            <button
              type="button"
              onClick={downloadSampleExcel}
              className="table-action"
            >
              Download Sample Excel
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Upload Excel File (.xlsx, .xls, .csv)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              style={{
                padding: "10px",
                background: "#FFFFFF",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                width: "100%",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
            {bulkFile && (
              <p style={{ marginTop: "8px", fontSize: "12px" }}>
                {bulkFile} - {bulkRows.length} rows parsed
              </p>
            )}
          </div>

          {/* Watermark + Signatures */}
          <div
            style={{
              padding: "16px",
              background: "#F8F7F4",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                color: "var(--navy)",
                margin: "0 0 12px",
                fontSize: "14px",
              }}
            >
              Common Logo / Watermark &amp; Signatures (applies to all)
            </h4>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Logo / Emblem (optional)</label>
              {bulkWatermark ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <img
                    src={bulkWatermark}
                    alt=""
                    style={{
                      height: "60px",
                      border: "1px solid var(--line)",
                      padding: "4px",
                      background: "white",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setBulkWatermark("")}
                    style={{
                      padding: "6px 14px",
                      background: "#FEF2F2",
                      color: "#B91C1C",
                      border: "1px solid #FECACA",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBulkImageUpload(e, "watermark", 0)}
                  style={{ fontSize: "13px" }}
                />
              )}
            </div>

            <div style={grid3}>
              {bulkSignatures.map((sig, i) => {
                const labels = ["Left", "Right"];
                return (
                  <div
                    key={i}
                    style={{
                      padding: "12px",
                      background: "white",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px",
                        color: "var(--navy)",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Signature {labels[i]}
                    </p>
                    {sig.image ? (
                      <div style={{ marginBottom: "10px" }}>
                        <img
                          src={sig.image}
                          alt=""
                          style={{
                            height: "40px",
                            display: "block",
                            marginBottom: "6px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...bulkSignatures];
                            updated[i] = { ...updated[i], image: "" };
                            setBulkSignatures(updated);
                          }}
                          style={{
                            padding: "4px 10px",
                            background: "#FEF2F2",
                            color: "#B91C1C",
                            border: "1px solid #FECACA",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleBulkImageUpload(e, "signature", i)
                        }
                        style={{
                          fontSize: "12px",
                          marginBottom: "10px",
                          width: "100%",
                        }}
                      />
                    )}
                    <input
                      value={sig.officerName}
                      onChange={(e) =>
                        handleBulkSignatureChange(
                          i,
                          "officerName",
                          e.target.value,
                        )
                      }
                      placeholder="Officer Name / Designation"
                      style={{ ...inputStyle, marginBottom: "8px" }}
                    />
                    <input
                      value={sig.rank}
                      onChange={(e) =>
                        handleBulkSignatureChange(i, "rank", e.target.value)
                      }
                      placeholder="Rank / Unit"
                      style={inputStyle}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview Table */}
          {bulkRows.length > 0 && (
            <>
              <div
                className="education-table-wrap"
                style={{ marginBottom: "16px" }}
              >
                <table className="education-table">
                  <thead>
                    <tr>
                      <th>Excel Row</th>
                      <th>Name</th>
                      <th>Certificate ID</th>
                      <th>Quiz Name</th>
                      <th>Course</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Completed On</th>
                      {bulkRows.some((row) => row._error) && <th>Error</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row) => (
                      <tr key={row._rowNumber}>
                        <td>{row._rowNumber}</td>
                        <td>{row.name || "-"}</td>
                        <td>{row.certificateId || "-"}</td>
                        <td>{row.quizName || "-"}</td>
                        <td>{row.courseName || "-"}</td>
                        <td>{row.score || "-"}</td>
                        <td>{row.grade || "-"}</td>
                        <td>{row.completedOn || "-"}</td>
                        {bulkRows.some((item) => item._error) && (
                          <td>{row._error || "-"}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="primary"
                  onClick={handleBulkGenerate}
                  disabled={bulkSaving}
                >
                  {bulkSaving
                    ? "Generating..."
                    : `Generate ${bulkRows.length} Certificates`}
                </button>
                <button
                  type="button"
                  className="table-action"
                  onClick={resetBulk}
                  disabled={bulkSaving}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ==================== SINGLE FORM ==================== */}
      {showForm && (
        <div
          className="education-panel"
          style={{ padding: "20px", marginBottom: "24px" }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginTop: 0, color: "var(--navy)" }}>
              Certificate Details
            </h3>
            <div style={grid3}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Pramod Kumar Singh"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Certificate ID *</label>
                <input
                  name="certificateId"
                  value={form.certificateId}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="504NPS04486"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Quiz Name</label>
                <input
                  name="quizName"
                  value={form.quizName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Pre Assessment Quiz"
                />
              </div>
              <div>
                <label style={labelStyle}>Course Name</label>
                <input
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="For testing purpose"
                />
              </div>
              <div>
                <label style={labelStyle}>Score (%)</label>
                <input
                  type="number"
                  name="score"
                  value={form.score}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="80"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label style={labelStyle}>Grade</label>
                <input
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="A+, A, B, etc."
                />
              </div>
              <div>
                <label style={labelStyle}>Completed On *</label>
                <input
                  type="date"
                  name="completedOn"
                  value={form.completedOn}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Place</label>
                <input
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date of Issue</label>
                <input
                  type="date"
                  name="dateOfIssue"
                  value={form.dateOfIssue}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Logo */}
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                background: "#F8F7F4",
                border: "1px solid var(--line)",
                borderRadius: "10px",
              }}
            >
              <h4
                style={{
                  color: "var(--navy)",
                  margin: "0 0 12px",
                  fontSize: "14px",
                }}
              >
                Logo / Emblem (optional)
              </h4>
              {form.watermark ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <img
                    src={form.watermark}
                    alt="Logo"
                    style={{
                      height: "80px",
                      border: "1px solid var(--line)",
                      padding: "4px",
                      background: "white",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, watermark: "" })}
                    style={{
                      padding: "6px 14px",
                      background: "#FEF2F2",
                      color: "#B91C1C",
                      border: "1px solid #FECACA",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "watermark", 0)}
                  style={{ fontSize: "13px" }}
                />
              )}
            </div>

            {/* 2 Signatures */}
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                background: "#F8F7F4",
                border: "1px solid var(--line)",
                borderRadius: "10px",
              }}
            >
              <h4
                style={{
                  color: "var(--navy)",
                  margin: "0 0 12px",
                  fontSize: "14px",
                }}
              >
                Signatures (2)
              </h4>
              <div style={grid3}>
                {form.signatures.map((sig, i) => {
                  const labels = ["Left", "Right"];
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        background: "white",
                        border: "1px solid var(--line)",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 10px",
                          color: "var(--navy)",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        Signature {labels[i]}
                      </p>
                      {sig.image ? (
                        <div style={{ marginBottom: "10px" }}>
                          <img
                            src={sig.image}
                            alt="Signature"
                            style={{
                              height: "50px",
                              display: "block",
                              marginBottom: "6px",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleSignatureChange(i, "image", "")
                            }
                            style={{
                              padding: "4px 10px",
                              background: "#FEF2F2",
                              color: "#B91C1C",
                              border: "1px solid #FECACA",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "signature", i)}
                          style={{
                            fontSize: "12px",
                            marginBottom: "10px",
                            width: "100%",
                          }}
                        />
                      )}
                      <input
                        value={sig.officerName}
                        onChange={(e) =>
                          handleSignatureChange(
                            i,
                            "officerName",
                            e.target.value,
                          )
                        }
                        placeholder="Officer Name / Designation"
                        style={{ ...inputStyle, marginBottom: "8px" }}
                      />
                      <input
                        value={sig.rank}
                        onChange={(e) =>
                          handleSignatureChange(i, "rank", e.target.value)
                        }
                        placeholder="Rank / Unit (e.g. RPSF/TC/GKP)"
                        style={inputStyle}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                type="submit"
                className="primary"
                disabled={saving}
                style={{ padding: "10px 30px" }}
              >
                {saving ? "Saving..." : "Create Certificate"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="education-panel">
        <div className="panel-heading">
          <h3>
            All Certificates ({filteredCerts.length}
            {filteredCerts.length !== certs.length && ` of ${certs.length}`})
          </h3>
          <button
            type="button"
            className="primary"
            onClick={handlePrintAll}
            style={{
              padding: "8px 16px",
              fontSize: "13px",
              background: "var(--navy)",
              color: "white",
            }}
          >
            Print All ({filteredCerts.length})
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            alignItems: "end",
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div>
            <label style={labelStyle}>
              Search (Name, Certificate ID, Course)
            </label>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type any keyword..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Courses</option>
              {certificateCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quiz</label>
            <select
              value={filterQuiz}
              onChange={(e) => setFilterQuiz(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Quizzes</option>
              {certificateQuizzes.map((quiz) => (
                <option key={quiz} value={quiz}>
                  {quiz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Completed From</label>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Completed To</label>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            type="button"
            className="table-action"
            onClick={clearFilters}
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
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : certs.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No certificates found.
            </p>
          ) : filteredCerts.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No certificates match your filters.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Certificate ID</th>
                  <th>Quiz Name</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Completed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--gold)" }}>{c.name}</td>
                    <td>{c.certificateId}</td>
                    <td>{c.quizName}</td>
                    <td>{c.courseName}</td>
                    <td>{c.score}%</td>
                    <td>{c.grade || "-"}</td>
                    <td>{formatDate(c.completedOn)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => setPreviewCert(c)}
                      >
                        Preview
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {previewCert && (
        <CertificatePreview
          cert={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}

      {/* 👇 Print All Hidden Area */}
      {printAllMode && (
        <div
          className="print-all-area"
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 9999,
            background: "white",
          }}
        >
          {filteredCerts.map((cert) => (
            <div
              key={cert._id}
              style={{ pageBreakAfter: "always", marginBottom: "20px" }}
            >
              <CertificatePreview cert={cert} isPrintMode={true} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =========================================================
//              CERTIFICATE PREVIEW COMPONENT
// =========================================================

function CertificatePreview({ cert, onClose, isPrintMode = false }) {
  const formatIssueDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    return `${day} ${month}-${date.getFullYear()}`;
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        position: isPrintMode ? "relative" : "fixed",
        inset: isPrintMode ? "auto" : 0,
        background: isPrintMode ? "transparent" : "rgba(0,0,0,0.9)",
        zIndex: isPrintMode ? "auto" : 1000,
        overflowY: isPrintMode ? "visible" : "auto",
        padding: isPrintMode ? "0" : "40px 20px",
        pageBreakAfter: isPrintMode ? "always" : "auto",
      }}
      onClick={isPrintMode ? undefined : onClose}
    >
      {!isPrintMode && (
        <div
          style={{ textAlign: "center", marginBottom: "20px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: "10px 24px",
              background: "#C2410C",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
              marginRight: "12px",
            }}
          >
            Print / Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Close
          </button>
        </div>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <div className="training-cert-area">
          <div className="training-cert-inner">
            <div className="tc-border tc-border-top" />
            <div className="tc-border tc-border-bottom" />
            <div className="tc-border tc-border-left" />
            <div className="tc-border tc-border-right" />
            <div className="tc-corner tc-corner-tl" />
            <div className="tc-corner tc-corner-tr" />
            <div className="tc-corner tc-corner-bl" />
            <div className="tc-corner tc-corner-br" />

            <div className="tc-watermark">
              {cert.watermark && (
                <img src={cert.watermark} alt="" className="tc-watermark-img" />
              )}
              <div className="tc-watermark-text">RPSF</div>
              <div className="tc-watermark-text tc-watermark-sub">
                TRAINING CENTRE
              </div>
            </div>

            <div className="tc-content">
              {cert.watermark && (
                <div className="tc-logo-wrap">
                  <img src={cert.watermark} alt="" className="tc-logo" />
                </div>
              )}

              <svg
                className="tc-heading"
                viewBox="0 12 1000 345"
                preserveAspectRatio="xMidYMid meet"
                role="img"
              >
                <defs>
                  <path
                    id="ccArcHindi"
                    d="M 7.2 296.6 A 653 653 0 0 1 992.8 296.6"
                  />
                  <path
                    id="ccArcEnglish"
                    d="M 51 334.6 A 595 595 0 0 1 949 334.6"
                  />
                  <linearGradient id="ccTitle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b8325f" />
                    <stop offset="50%" stopColor="#8b1d45" />
                    <stop offset="100%" stopColor="#5e1030" />
                  </linearGradient>
                </defs>
                <text className="tc-arc-hi">
                  <textPath
                    href="#ccArcHindi"
                    startOffset="22.5"
                    textLength="1072"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    रेलवे सुरक्षा विशेष बल, प्रशिक्षण केन्द्र, राजही कैम्प,
                    गोरखपुर
                  </textPath>
                </text>
                <text className="tc-arc-en">
                  <textPath
                    href="#ccArcEnglish"
                    startOffset="20.8"
                    textLength="976"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    Railway Protection Special Force, Training Centre, Rajahi
                    Camp, Gorakhpur
                  </textPath>
                </text>
                <text
                  x="500"
                  y="275"
                  textAnchor="middle"
                  className="tc-main-title"
                >
                  CERTIFICATE
                </text>
              </svg>

              <div className="tc-divider" />

              <p className="tc-body">
                This is to certify that{" "}
                <span className="tc-hl">{cert.name}</span>
                {cert.certificateId ? (
                  <>
                    {" "}
                    (ID: <span className="tc-hl2">{cert.certificateId}</span>)
                  </>
                ) : null}{" "}
                has successfully completed the{" "}
                <span className="tc-hl">{cert.quizName}</span> in{" "}
                <span className="tc-hl2">{cert.courseName}</span>
                {cert.score ? (
                  <>
                    {" "}
                    and passed the assessment with a score of{" "}
                    <span className="tc-hl2">{cert.score}%</span>
                  </>
                ) : null}
                {cert.grade ? (
                  <>
                    {" "}
                    and achieved Grade{" "}
                    <span className="tc-hl2">{cert.grade}</span>
                  </>
                ) : null}
                .
              </p>

              <div className="tc-footer">
                {cert.completedOn && (
                  <p>
                    Completed on:{" "}
                    <strong>{formatDate(cert.completedOn)}</strong>
                  </p>
                )}
                {cert.place && <p>Place: {cert.place}</p>}
                {cert.dateOfIssue && (
                  <p>Date of Issue: {formatIssueDate(cert.dateOfIssue)}</p>
                )}
              </div>

              <div className="tc-signatures">
                {(cert.signatures || []).slice(0, 2).map((sig, i) => (
                  <div key={i} className="tc-sign-slot">
                    {sig.image && (
                      <img src={sig.image} alt="" className="tc-sign-img" />
                    )}
                    {sig.officerName && (
                      <p className="tc-sign-name">{sig.officerName}</p>
                    )}
                    {sig.rank && <p className="tc-sign-rank">{sig.rank}</p>}
                  </div>
                ))}
              </div>

              {cert.certificateId && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    right: "60px",
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(cert.certificateId)}`}
                    alt="QR"
                    width="70"
                    height="70"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 👇 CSS for Print */}
      <style>{`
        .training-cert-area { background: white; max-width: 1000px; margin: 0 auto; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .training-cert-inner { position: relative; min-height: 700px; padding: 50px 66px 38px; box-sizing: border-box; font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif; color: #2a3a9c; background: radial-gradient(circle at 50% 0%, #ffffff 0%, #fffdf7 60%, #fff6e3 100%); }
        .training-cert-inner::before { content: ""; position: absolute; inset: 30px; border: 2px solid #c62828; border-radius: 6px; pointer-events: none; }
        .training-cert-inner::after { content: ""; position: absolute; inset: 36px; border: 1px solid #f4b400; border-radius: 4px; pointer-events: none; }
        .tc-border { position: absolute; background-size: auto; }
        .tc-border-top, .tc-border-bottom { left: 24px; right: 24px; height: 24px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='24'%3E%3Cellipse cx='7' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(-22 7 12)'/%3E%3Cellipse cx='29' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(22 29 12)'/%3E%3Ccircle cx='18.00' cy='7.00' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='22.76' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='20.94' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='15.06' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='13.24' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='18' cy='12' r='2.7' fill='%238e0000'/%3E%3Ccircle cx='18' cy='12' r='1' fill='%23ffd54f'/%3E%3C/svg%3E"); background-repeat: space no-repeat; }
        .tc-border-top { top: 0; }
        .tc-border-bottom { bottom: 0; transform: scaleY(-1); }
        .tc-border-left, .tc-border-right { top: 24px; bottom: 24px; width: 24px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='36'%3E%3Cg transform='translate(24 0) rotate(90)'%3E%3Cellipse cx='7' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(-22 7 12)'/%3E%3Cellipse cx='29' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(22 29 12)'/%3E%3Ccircle cx='18.00' cy='7.00' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='22.76' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='20.94' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='15.06' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='13.24' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='18' cy='12' r='2.7' fill='%238e0000'/%3E%3Ccircle cx='18' cy='12' r='1' fill='%23ffd54f'/%3E%3C/g%3E%3C/svg%3E"); background-repeat: no-repeat space; }
        .tc-border-left { left: 0; }
        .tc-border-right { right: 0; transform: scaleX(-1); }
        .tc-corner { position: absolute; width: 24px; height: 24px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='18.20' cy='12.00' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='16.38' cy='16.38' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12.00' cy='18.20' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='7.62' cy='16.38' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='5.80' cy='12.00' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='7.62' cy='7.62' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12.00' cy='5.80' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='16.38' cy='7.62' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12' cy='12' r='4.2' fill='%23c62828'/%3E%3Ccircle cx='12' cy='12' r='1.6' fill='%23ffd54f'/%3E%3C/svg%3E") center / 24px 24px no-repeat; }
        .tc-corner-tl { top: 0; left: 0; }
        .tc-corner-tr { top: 0; right: 0; }
        .tc-corner-bl { bottom: 0; left: 0; }
        .tc-corner-br { bottom: 0; right: 0; }
        .tc-content { position: relative; z-index: 1; }
        .tc-watermark { position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; opacity: 0.12; z-index: 0; pointer-events: none; text-align: center; }
        .tc-watermark-img { width: 300px; height: 300px; object-fit: contain; margin-bottom: 6px; }
        .tc-watermark-text { font-family: 'Arial Black', Impact, Arial, sans-serif; font-weight: 900; font-size: 64px; letter-spacing: 8px; line-height: 1; color: #1c3bbf; }
        .tc-watermark-sub { font-size: 34px; letter-spacing: 6px; margin-top: 6px; color: #c62828; }
        .tc-logo-wrap { text-align: center; }
        .tc-logo { height: 100px; max-width: 200px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(31, 58, 110, 0.35)); }
        .tc-heading { display: block; width: 100%; height: auto; margin: 2px 0 0; overflow: visible; }
        .tc-arc-hi { font-family: 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif; font-size: 53px; font-weight: 800; fill: #1c3bbf; stroke: #1c3bbf; stroke-width: 0.9px; }
        .tc-arc-en { font-family: Arial, Helvetica, sans-serif; font-size: 27px; font-weight: 900; fill: #8e24aa; stroke: #8e24aa; stroke-width: 0.6px; }
        .tc-main-title { font-family: 'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif; font-size: 68px; font-weight: 900; letter-spacing: 2px; fill: url(#ccTitle); stroke: #3d0a1f; stroke-width: 1.4px; paint-order: stroke fill; filter: drop-shadow(3px 3px 0 #5b5bd6); }
        .tc-divider { width: 60%; height: 3px; margin: 8px auto 0; border-radius: 3px; background: linear-gradient(90deg, transparent, #1c3bbf, #8e24aa, #1c3bbf, transparent); }
        .tc-body { font-style: italic; font-size: 21px; line-height: 1.9; text-align: justify; color: #2a3a9c; margin: 20px 0 0; }
        .tc-body sup { font-size: 0.6em; line-height: 0; }
        .tc-hl  { color: #a01535; font-weight: 700; }
        .tc-hl2 { color: #17228a; font-weight: 700; }
        .tc-footer { margin-top: 14px; text-align: left; font-style: italic; font-size: 17px; color: #2a3a9c; }
        .tc-footer p { margin: 2px 0; }
        .tc-signatures { display: flex; justify-content: space-around; align-items: flex-end; gap: 60px; margin-top: 34px; }
        .tc-sign-slot { flex: 1; max-width: 300px; min-height: 90px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; text-align: center; }
        .tc-sign-img { height: 62px; max-width: 100%; object-fit: contain; margin-bottom: 2px; }
        .tc-sign-name, .tc-sign-rank { margin: 0; font-family: 'Times New Roman', Georgia, serif; font-size: 17px; font-weight: 700; line-height: 1.3; transform: scaleX(0.92); }
        .tc-sign-name { color: #1c3bbf; }
        .tc-sign-rank { color: #1c3bbf; }
        @page { size: A4 landscape; margin: 8mm; }
        @media print {
          body * { visibility: hidden; }
          .training-cert-area, .training-cert-area * { visibility: visible; }
          .training-cert-area { position: absolute; top: 0; left: 0; width: 100%; max-width: none; zoom: 0.8; }
          .training-cert-area button { display: none; }
          .print-all-area { display: block !important; position: absolute; top: 0; left: 0; width: 100%; }
          .print-all-area .training-cert-area { page-break-after: always; margin-bottom: 20px; }
          .print-all-area .training-cert-area:last-child { page-break-after: auto; }
        }
      `}</style>
    </div>
  );
}
