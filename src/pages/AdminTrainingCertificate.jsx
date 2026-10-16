import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  createTrainingCertificate,
  bulkCreateTrainingCertificates,
  getAllTrainingCertificates,
  deleteTrainingCertificate,
} from "../utils/api";

const initialForm = {
  certificateId: "",
  traineeName: "",
  unit: "",
  trainingCourse: "",
  grade: "",
  batch: "",
  fromDate: "",
  toDate: "",
  place: "RPSF/TC/GKP",
  dateOfIssue: new Date().toISOString().split("T")[0],
  watermark: "",
  signatures: [
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
  ],
};

export default function AdminTrainingCertificate() {
  const [form, setForm] = useState(initialForm);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewCert, setPreviewCert] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  // Bulk upload states
  const [showBulk, setShowBulk] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFile, setBulkFile] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkWatermark, setBulkWatermark] = useState("");
  const [bulkSignatures, setBulkSignatures] = useState([
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
    { image: "", officerName: "", rank: "" },
  ]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllTrainingCertificates();
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

  const resetForm = () => {
    setForm(initialForm);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.traineeName.trim() || !form.trainingCourse.trim()) {
      setMessage("Trainee name and course are required");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      await createTrainingCertificate(form);
      setMessage("Training certificate created successfully");
      resetForm();
      setShowForm(false);
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
      await deleteTrainingCertificate(id);
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
  const filteredCerts = certs.filter((c) => {
    // Search: trainee, certId, unit, course, batch
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      const fields = [
        c.traineeName,
        c.certificateId,
        c.unit,
        c.trainingCourse,
        c.batch,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      if (!fields.some((f) => f.includes(q))) return false;
    }

    if (filterUnit && (c.unit || "") !== filterUnit) return false;
    if (filterCourse && (c.trainingCourse || "") !== filterCourse) return false;
    if (filterBatch && (c.batch || "") !== filterBatch) return false;
    if (filterGrade && (c.grade || "") !== filterGrade) return false;

    // Date range on dateOfIssue
    const issueDate = c.dateOfIssue ? String(c.dateOfIssue).slice(0, 10) : "";
    if (filterFromDate && (!issueDate || issueDate < filterFromDate))
      return false;
    if (filterToDate && (!issueDate || issueDate > filterToDate)) return false;

    return true;
  });

  const uniqueUnits = [
    ...new Set(certs.map((c) => c.unit).filter(Boolean)),
  ].sort();
  const uniqueCourses = [
    ...new Set(certs.map((c) => c.trainingCourse).filter(Boolean)),
  ].sort();
  const uniqueBatches = [
    ...new Set(certs.map((c) => c.batch).filter(Boolean)),
  ].sort();
  const uniqueGrades = [
    ...new Set(certs.map((c) => c.grade).filter(Boolean)),
  ].sort();

  const hasActiveFilters =
    searchText ||
    filterUnit ||
    filterCourse ||
    filterBatch ||
    filterGrade ||
    filterFromDate ||
    filterToDate;

  const clearFilters = () => {
    setSearchText("");
    setFilterUnit("");
    setFilterCourse("");
    setFilterBatch("");
    setFilterGrade("");
    setFilterFromDate("");
    setFilterToDate("");
  };

  // ==================== BULK UPLOAD ====================
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFile(file.name);
    setMessage("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length === 0) {
          setMessage("Excel file is empty");
          return;
        }

        // Map columns (case-insensitive, ignore spaces/special chars)
        const mapped = json.map((row) => {
          const get = (keys) => {
            for (const k of keys) {
              const found = Object.keys(row).find(
                (rk) => rk.toLowerCase().replace(/[^a-z0-9]/g, "") === k,
              );
              if (found) return String(row[found] || "");
            }
            return "";
          };
          return {
            traineeName: get(["traineename", "name"]),
            unit: get(["unit"]),
            trainingCourse: get(["trainingcourse", "course"]),
            grade: get(["grade"]),
            batch: get(["batch", "batchname"]),
            fromDate: get(["fromdate", "from"]),
            toDate: get(["todate", "to"]),
            place: get(["place"]) || "RPSF/TC/GKP",
            dateOfIssue:
              get(["dateofissue", "issue", "dateofissued"]) ||
              new Date().toISOString().split("T")[0],
            certificateId: get(["certificateid", "certid", "id"]),
          };
        });

        setBulkRows(mapped);
        setMessage(
          `${mapped.length} rows detected. Verify below and click Generate.`,
        );
      } catch (err) {
        setMessage("Failed to read Excel: " + err.message);
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

    const cleanSignatures = bulkSignatures.filter(
      (s) => s.image || s.officerName || s.rank,
    );

    const payload = bulkRows.map((row) => ({
      ...row,
      watermark: bulkWatermark,
      signatures: cleanSignatures,
    }));

    try {
      setBulkSaving(true);
      setMessage("");
      const result = await bulkCreateTrainingCertificates(payload);
      setMessage(
        `${result.created} certificates generated successfully${
          result.failed?.length ? `, ${result.failed.length} failed` : ""
        }`,
      );
      setBulkRows([]);
      setBulkFile("");
      setBulkWatermark("");
      setBulkSignatures([
        { image: "", officerName: "", rank: "" },
        { image: "", officerName: "", rank: "" },
        { image: "", officerName: "", rank: "" },
      ]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowBulk(false);
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
      { image: "", officerName: "", rank: "" },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage("");
  };

  const downloadSampleExcel = () => {
    const sample = [
      {
        traineeName: "CT-Jitender Singh",
        unit: "9BN/RPSF",
        trainingCourse: "CTI Course (IT & WT)",
        grade: "AX",
        batch: "9th Batch",
        fromDate: "2016-08-01",
        toDate: "2016-10-07",
        place: "RPSF/TC/GKP",
        dateOfIssue: "2026-05-20",
        certificateId: "RPSF2016001",
      },
      {
        traineeName: "CT-Ramesh Kumar",
        unit: "2BN/RPSF",
        trainingCourse: "Basic Training",
        grade: "A",
        batch: "10th Batch",
        fromDate: "2017-01-10",
        toDate: "2017-04-15",
        place: "RPSF/TC/GKP",
        dateOfIssue: "2026-05-20",
        certificateId: "RPSF2017002",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Certificates");
    XLSX.writeFile(wb, "training-certificates-sample.xlsx");
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
    color: "var(--navy)",
    fontSize: "12px",
    letterSpacing: "0.5px",
    marginBottom: "6px",
    display: "block",
    fontWeight: 600,
  };
  const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Certificates</p>
          <h2>Training Certificate</h2>
          <p>Issue training completion certificates for officers.</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="table-action"
            onClick={() => {
              setShowBulk((prev) => !prev);
              setShowForm(false);
              setMessage("");
            }}
            style={{ padding: "10px 20px" }}
          >
            {showBulk ? "Close Bulk" : "Bulk Upload (Excel)"}
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              if (showForm) {
                resetForm();
                setShowForm(false);
              } else {
                setShowForm(true);
                setShowBulk(false);
              }
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
            background:
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("generated")
                ? "#f0f8f1"
                : "#FEF2F2",
            border: `1px solid ${
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("generated")
                ? "#a7ddb2"
                : "#FECACA"
            }`,
            color:
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("generated")
                ? "#15803D"
                : "#B91C1C",
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
          <h3 style={{ color: "var(--navy)", marginTop: 0 }}>
            Bulk Upload from Excel
          </h3>

          <div
            style={{
              padding: "16px",
              background: "#F8F7F4",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                margin: "0 0 12px",
                color: "var(--ink)",
                fontSize: "13px",
              }}
            >
              Excel columns required:{" "}
              <strong>
                traineeName, unit, trainingCourse, grade, batch, fromDate,
                toDate, place, dateOfIssue, certificateId
              </strong>
            </p>
            <button
              type="button"
              onClick={downloadSampleExcel}
              style={{
                padding: "8px 16px",
                background: "#FFF7ED",
                color: "#C2410C",
                border: "1px solid #FDBA74",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
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
                cursor: "pointer",
              }}
            />
            {bulkFile && (
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#15803D",
                  fontWeight: 600,
                }}
              >
                {bulkFile} — {bulkRows.length} rows parsed
              </p>
            )}
          </div>

          {/* Common Watermark + Signatures */}
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
                const labels = ["Bottom Left", "Bottom Middle", "Bottom Right"];
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
                      {labels[i]}
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
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  color: "var(--navy)",
                  margin: "0 0 12px",
                  fontSize: "14px",
                }}
              >
                Preview ({bulkRows.length} certificates will be generated)
              </h4>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  background: "white",
                }}
              >
                <table className="education-table" style={{ fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Trainee</th>
                      <th>Unit</th>
                      <th>Course</th>
                      <th>Grade</th>
                      <th>Batch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{row.traineeName || "-"}</td>
                        <td>{row.unit || "-"}</td>
                        <td>{row.trainingCourse || "-"}</td>
                        <td>{row.grade || "-"}</td>
                        <td>{row.batch || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="primary"
              onClick={handleBulkGenerate}
              disabled={bulkSaving || bulkRows.length === 0}
              style={{ padding: "10px 30px" }}
            >
              {bulkSaving
                ? "Generating..."
                : `Generate ${bulkRows.length} Certificates`}
            </button>
            <button type="button" className="table-action" onClick={resetBulk}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ==================== SINGLE FORM ==================== */}
      {showForm && (
        <div
          className="education-panel"
          style={{ padding: "20px", marginBottom: "24px" }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ color: "var(--navy)", marginTop: 0 }}>
              Certificate Details
            </h3>

            <div style={grid3}>
              <div>
                <label style={labelStyle}>Trainee Name *</label>
                <input
                  name="traineeName"
                  value={form.traineeName}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="CT-Jitender Singh"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Unit</label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="9BN/RPSF"
                />
              </div>
              <div>
                <label style={labelStyle}>Training Course *</label>
                <input
                  name="trainingCourse"
                  value={form.trainingCourse}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="CTI Course (IT & WT)"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Grade</label>
                <input
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="AX"
                />
              </div>
              <div>
                <label style={labelStyle}>Batch</label>
                <input
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="9th Batch"
                />
              </div>
              <div>
                <label style={labelStyle}>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  style={inputStyle}
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
              <div>
                <label style={labelStyle}>Certificate ID (optional)</label>
                <input
                  name="certificateId"
                  value={form.certificateId}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Logo / Emblem */}
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
                Logo / Emblem (optional, shows at top center)
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

            {/* 3 Signatures */}
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
                Signatures (3)
              </h4>
              <div style={grid3}>
                {form.signatures.map((sig, i) => {
                  const labels = [
                    "Bottom Left",
                    "Bottom Middle",
                    "Bottom Right",
                  ];
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
                        {labels[i]}
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

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="submit"
                className="primary"
                disabled={saving}
                style={{ padding: "10px 30px" }}
              >
                {saving ? "Saving..." : "Save Certificate"}
              </button>
              <button
                type="button"
                className="table-action"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="education-panel">
        <div className="panel-heading">
          <h3>
            All Training Certificates ({filteredCerts.length}
            {filteredCerts.length !== certs.length && ` of ${certs.length}`})
          </h3>
        </div>

        {/* Filters */}
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
              Search (Trainee, ID, Unit, Course, Batch)
            </label>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type any keyword..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Unit</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Units</option>
              {uniqueUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Batch</label>
            <select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Batches</option>
              {uniqueBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Grade</label>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Grades</option>
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Issued From</label>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Issued To</label>
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
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No training certificates yet.
            </p>
          ) : filteredCerts.length === 0 ? (
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No certificates match your filters.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Trainee</th>
                  <th>Unit</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Batch</th>
                  <th>Issued On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--navy)", fontWeight: 600 }}>
                      {c.traineeName}
                    </td>
                    <td>{c.unit || "-"}</td>
                    <td>{c.trainingCourse}</td>
                    <td>{c.grade || "-"}</td>
                    <td>{c.batch || "-"}</td>
                    <td>{formatDate(c.dateOfIssue)}</td>
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
        <TrainingCertificatePreview
          cert={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </section>
  );
}

// =========================================================
//           TRAINING CERTIFICATE PREVIEW
//   (unchanged - your design kept as-is)
// =========================================================

function TrainingCertificatePreview({ cert, onClose }) {
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

  const formatIssueDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    return `${day} ${month}-${date.getFullYear()}`;
  };

  const renderBatch = (text) => {
    const m = String(text).match(/^(.*?)(\d+)(st|nd|rd|th)(.*)$/i);
    if (!m) return text;
    return (
      <>
        {m[1]}
        {m[2]}
        <sup>{m[3]}</sup>
        {m[4]}
      </>
    );
  };

  const hasDates = cert.fromDate && cert.toDate;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 1000,
        overflowY: "auto",
        padding: "40px 20px",
      }}
      onClick={onClose}
    >
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
                aria-label="Railway Protection Special Force, Training Centre, Rajahi Camp, Gorakhpur - Certificate"
              >
                <defs>
                  <path
                    id="tcArcHindi"
                    d="M 7.2 296.6 A 653 653 0 0 1 992.8 296.6"
                  />
                  <path
                    id="tcArcEnglish"
                    d="M 51 334.6 A 595 595 0 0 1 949 334.6"
                  />
                  <linearGradient id="tcTitle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b8325f" />
                    <stop offset="50%" stopColor="#8b1d45" />
                    <stop offset="100%" stopColor="#5e1030" />
                  </linearGradient>
                </defs>

                <text className="tc-arc-hi">
                  <textPath
                    href="#tcArcHindi"
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
                    href="#tcArcEnglish"
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
                <span className="tc-hl">{cert.traineeName}</span>
                {cert.unit ? (
                  <>
                    {" "}
                    of <span className="tc-hl2">{cert.unit}</span>
                  </>
                ) : null}{" "}
                has successfully undergone the &ldquo;
                <span className="tc-hl">{cert.trainingCourse}</span>
                {cert.grade ? (
                  <>
                    {" "}
                    with grading &lsquo;
                    <span className="tc-hl2">{cert.grade}</span>&rsquo;
                  </>
                ) : null}
                &rdquo;
                {cert.batch ? (
                  <>
                    {" "}
                    in <span className="tc-hl2">{renderBatch(cert.batch)}</span>
                  </>
                ) : null}
                {hasDates ? (
                  <>
                    {" "}
                    conducted from{" "}
                    <span className="tc-hl2">
                      {formatDate(cert.fromDate)}
                    </span>{" "}
                    to <span className="tc-hl2">{formatDate(cert.toDate)}</span>
                  </>
                ) : null}
                {cert.place ? (
                  <>
                    {" "}
                    at <span className="tc-hl2">{cert.place}</span>
                  </>
                ) : null}
                .
              </p>

              <div className="tc-footer">
                {cert.place && <p>Place: {cert.place}</p>}
                {cert.dateOfIssue && (
                  <p>Date of Issue: {formatIssueDate(cert.dateOfIssue)}</p>
                )}
              </div>

              <div className="tc-signatures">
                {(cert.signatures || []).map((sig, i) => (
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
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .training-cert-area {
          background: white;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .training-cert-inner {
          position: relative;
          min-height: 700px;
          padding: 50px 66px 38px;
          box-sizing: border-box;
          font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
          color: #2a3a9c;
          background: radial-gradient(circle at 50% 0%, #ffffff 0%, #fffdf7 60%, #fff6e3 100%);
        }
        .training-cert-inner::before {
          content: "";
          position: absolute;
          inset: 30px;
          border: 2px solid #c62828;
          border-radius: 6px;
          pointer-events: none;
        }
        .training-cert-inner::after {
          content: "";
          position: absolute;
          inset: 36px;
          border: 1px solid #f4b400;
          border-radius: 4px;
          pointer-events: none;
        }

        .tc-border { position: absolute; background-size: auto; }
        .tc-border-top, .tc-border-bottom {
          left: 24px; right: 24px; height: 24px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='24'%3E%3Cellipse cx='7' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(-22 7 12)'/%3E%3Cellipse cx='29' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(22 29 12)'/%3E%3Ccircle cx='18.00' cy='7.00' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='22.76' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='20.94' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='15.06' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='13.24' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='18' cy='12' r='2.7' fill='%238e0000'/%3E%3Ccircle cx='18' cy='12' r='1' fill='%23ffd54f'/%3E%3C/svg%3E");
          background-repeat: space no-repeat;
        }
        .tc-border-top { top: 0; }
        .tc-border-bottom { bottom: 0; transform: scaleY(-1); }
        .tc-border-left, .tc-border-right {
          top: 24px; bottom: 24px; width: 24px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='36'%3E%3Cg transform='translate(24 0) rotate(90)'%3E%3Cellipse cx='7' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(-22 7 12)'/%3E%3Cellipse cx='29' cy='12' rx='6.5' ry='2.7' fill='%23c62828' stroke='%238e0000' stroke-width='0.5' transform='rotate(22 29 12)'/%3E%3Ccircle cx='18.00' cy='7.00' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='22.76' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='20.94' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='15.06' cy='16.05' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='13.24' cy='10.45' r='3.6' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='18' cy='12' r='2.7' fill='%238e0000'/%3E%3Ccircle cx='18' cy='12' r='1' fill='%23ffd54f'/%3E%3C/g%3E%3C/svg%3E");
          background-repeat: no-repeat space;
        }
        .tc-border-left { left: 0; }
        .tc-border-right { right: 0; transform: scaleX(-1); }
        .tc-corner {
          position: absolute;
          width: 24px; height: 24px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='18.20' cy='12.00' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='16.38' cy='16.38' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12.00' cy='18.20' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='7.62' cy='16.38' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='5.80' cy='12.00' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='7.62' cy='7.62' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12.00' cy='5.80' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='16.38' cy='7.62' r='3.4' fill='%23f4b400' stroke='%23b45f00' stroke-width='0.6'/%3E%3Ccircle cx='12' cy='12' r='4.2' fill='%23c62828'/%3E%3Ccircle cx='12' cy='12' r='1.6' fill='%23ffd54f'/%3E%3C/svg%3E") center / 24px 24px no-repeat;
        }
        .tc-corner-tl { top: 0; left: 0; }
        .tc-corner-tr { top: 0; right: 0; }
        .tc-corner-bl { bottom: 0; left: 0; }
        .tc-corner-br { bottom: 0; right: 0; }

        .tc-content { position: relative; z-index: 1; }

        .tc-watermark {
          position: absolute;
          top: 58%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.12;
          z-index: 0;
          pointer-events: none;
          text-align: center;
        }
        .tc-watermark-img {
          width: 300px;
          height: 300px;
          object-fit: contain;
          margin-bottom: 6px;
        }
        .tc-watermark-text {
          font-family: 'Arial Black', Impact, Arial, sans-serif;
          font-weight: 900;
          font-size: 64px;
          letter-spacing: 8px;
          line-height: 1;
          color: #1c3bbf;
        }
        .tc-watermark-sub {
          font-size: 34px;
          letter-spacing: 6px;
          margin-top: 6px;
          color: #c62828;
        }

        .tc-logo-wrap { text-align: center; }
        .tc-logo {
          height: 100px;
          max-width: 200px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(31, 58, 110, 0.35));
        }

        .tc-heading {
          display: block;
          width: 100%;
          height: auto;
          margin: 2px 0 0;
          overflow: visible;
        }
        .tc-arc-hi {
          font-family: 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif;
          font-size: 53px;
          font-weight: 800;
          fill: #1c3bbf;
          stroke: #1c3bbf;
          stroke-width: 0.9px;
        }
        .tc-arc-en {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 27px;
          font-weight: 900;
          fill: #8e24aa;
          stroke: #8e24aa;
          stroke-width: 0.6px;
        }
        .tc-main-title {
          font-family: 'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif;
          font-size: 68px;
          font-weight: 900;
          letter-spacing: 2px;
          fill: url(#tcTitle);
          stroke: #3d0a1f;
          stroke-width: 1.4px;
          paint-order: stroke fill;
          filter: drop-shadow(3px 3px 0 #5b5bd6);
        }
        .tc-divider {
          width: 60%;
          height: 3px;
          margin: 8px auto 0;
          border-radius: 3px;
          background: linear-gradient(90deg, transparent, #1c3bbf, #8e24aa, #1c3bbf, transparent);
        }

        .tc-body {
          font-style: italic;
          font-size: 21px;
          line-height: 1.9;
          text-align: justify;
          color: #2a3a9c;
          margin: 20px 0 0;
        }
        .tc-body sup { font-size: 0.6em; line-height: 0; }
        .tc-hl  { color: #a01535; font-weight: 700; }
        .tc-hl2 { color: #17228a; font-weight: 700; }

        .tc-footer {
          margin-top: 14px;
          text-align: left;
          font-style: italic;
          font-size: 17px;
          color: #2a3a9c;
        }
        .tc-footer p { margin: 2px 0; }

        .tc-signatures {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-top: 34px;
        }
        .tc-sign-slot {
          flex: 1;
          min-height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          text-align: center;
        }
        .tc-sign-img {
          height: 62px;
          max-width: 100%;
          object-fit: contain;
          margin-bottom: 2px;
        }
        .tc-sign-name,
        .tc-sign-rank {
          margin: 0;
          font-family: 'Times New Roman', Georgia, serif;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.3;
          transform: scaleX(0.92);
        }
        .tc-sign-name { color: #1c3bbf; }
        .tc-sign-rank { color: #1c3bbf; }

        @page { size: A4 landscape; margin: 8mm; }
        @media print {
          body * { visibility: hidden; }
          .training-cert-area, .training-cert-area * { visibility: visible; }
          .training-cert-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            max-width: none;
            zoom: 0.8;
          }
          .training-cert-area button { display: none; }
        }
      `}</style>
    </div>
  );
}
