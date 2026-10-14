import { useState, useEffect } from "react";
import {
  createTrainingCertificate,
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
        <button
          type="button"
          className="primary"
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              setShowForm(true);
            }
          }}
          style={{ padding: "10px 24px" }}
        >
          {showForm ? "Close Form" : "New Certificate"}
        </button>
      </div>

      {message && (
        <p
          style={{
            padding: "12px",
            background: message.toLowerCase().includes("success")
              ? "#f0f8f1"
              : "#FEF2F2",
            border: `1px solid ${message.toLowerCase().includes("success") ? "#a7ddb2" : "#FECACA"}`,
            color: message.toLowerCase().includes("success")
              ? "#15803D"
              : "#B91C1C",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </p>
      )}

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
          <h3>All Training Certificates ({certs.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : certs.length === 0 ? (
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No training certificates yet.
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
                {certs.map((c, i) => (
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
//   Redesigned to match the original printed certificate:
//   stamp-pattern border, top-center emblem, arched Hindi +
//   English heading, bold CERTIFICATE, italic body text,
//   Place / Date of Issue below the body, signatures at the bottom.
// =========================================================

function TrainingCertificatePreview({ cert, onClose }) {
  // 01.08.2016
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

  // 20 May-2026
  const formatIssueDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    return `${day} ${month}-${date.getFullYear()}`;
  };

  // "9th Batch" -> 9<sup>th</sup> Batch
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
            {/* Stamp-pattern border (4 sides) */}
            <div className="tc-border tc-border-top" />
            <div className="tc-border tc-border-bottom" />
            <div className="tc-border tc-border-left" />
            <div className="tc-border tc-border-right" />

            <div className="tc-content">
              {/* Emblem / logo - top center */}
              {cert.watermark && (
                <div className="tc-logo-wrap">
                  <img src={cert.watermark} alt="" className="tc-logo" />
                </div>
              )}

              {/* Arched heading + CERTIFICATE */}
              <svg
                className="tc-heading"
                viewBox="0 15 1000 280"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Railway Protection Special Force, Training Centre, Rajahi Camp, Gorakhpur - Certificate"
              >
                <defs>
                  <path
                    id="tcArcHindi"
                    d="M 25 313.3 A 560 560 0 0 1 975 313.3"
                  />
                  <path
                    id="tcArcEnglish"
                    d="M 69 340.8 A 508 508 0 0 1 931 340.8"
                  />
                </defs>

                <text className="tc-arc-hi">
                  <textPath
                    href="#tcArcHindi"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    रेलवे सुरक्षा विशेष बल, प्रशिक्षण केन्द्र, राजही कैम्प,
                    गोरखपुर
                  </textPath>
                </text>

                <text className="tc-arc-en">
                  <textPath
                    href="#tcArcEnglish"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    Railway Protection Special Force, Training Centre, Rajahi
                    Camp, Gorakhpur
                  </textPath>
                </text>

                <text
                  x="500"
                  y="252"
                  textAnchor="middle"
                  className="tc-main-title"
                >
                  CERTIFICATE
                </text>
              </svg>

              {/* Body */}
              <p className="tc-body">
                This is to certify that {cert.traineeName}
                {cert.unit ? ` of ${cert.unit}` : ""} has successfully undergone
                the &ldquo;{cert.trainingCourse}
                {cert.grade ? ` with grading \u2018${cert.grade}\u2019` : ""}
                &rdquo;
                {cert.batch ? <> in {renderBatch(cert.batch)}</> : null}
                {hasDates
                  ? ` conducted from ${formatDate(cert.fromDate)} to ${formatDate(cert.toDate)}`
                  : ""}
                {cert.place ? ` at ${cert.place}` : ""}.
              </p>

              {/* Footer: Place + Date of Issue */}
              <div className="tc-footer">
                {cert.place && <p>Place: {cert.place}</p>}
                {cert.dateOfIssue && (
                  <p>Date of Issue: {formatIssueDate(cert.dateOfIssue)}</p>
                )}
              </div>

              {/* Signatures */}
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
          background: white;
          min-height: 700px;
          padding: 34px 48px 30px;
          box-sizing: border-box;
          font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
          color: #262626;
        }

        /* ---------- Stamp-pattern border ---------- */
        .tc-border {
          position: absolute;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect x='1.5' y='1.5' width='13' height='13' rx='3' fill='%23ffffff' stroke='%23333333' stroke-width='2'/%3E%3Crect x='5' y='5' width='6' height='6' rx='1' fill='%23777777'/%3E%3C/svg%3E");
          background-size: 16px 16px;
        }
        .tc-border-top    { top: 0; left: 0; right: 0; height: 16px; background-repeat: space no-repeat; }
        .tc-border-bottom { bottom: 0; left: 0; right: 0; height: 16px; background-repeat: space no-repeat; }
        .tc-border-left   { top: 16px; bottom: 16px; left: 0; width: 16px; background-repeat: no-repeat space; }
        .tc-border-right  { top: 16px; bottom: 16px; right: 0; width: 16px; background-repeat: no-repeat space; }

        .tc-content { position: relative; z-index: 1; }

        /* ---------- Emblem ---------- */
        .tc-logo-wrap { text-align: center; }
        .tc-logo {
          height: 110px;
          max-width: 200px;
          object-fit: contain;
          filter: grayscale(1) contrast(1.05);
        }

        /* ---------- Arched heading ---------- */
        .tc-heading {
          display: block;
          width: 100%;
          height: auto;
          margin: 6px 0 0;
          overflow: visible;
        }
        .tc-arc-hi {
          font-family: 'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', 'Kohinoor Devanagari', sans-serif;
          font-size: 38px;
          font-weight: 700;
          fill: #262626;
        }
        .tc-arc-en {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 27px;
          font-weight: 700;
          fill: #262626;
        }
        .tc-main-title {
          font-family: 'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif;
          font-size: 56px;
          font-weight: 900;
          letter-spacing: 1px;
          fill: #4a4a4a;
          stroke: #111111;
          stroke-width: 1.6px;
          paint-order: stroke fill;
        }

        /* ---------- Body ---------- */
        .tc-body {
          font-style: italic;
          font-size: 21px;
          line-height: 1.95;
          text-align: justify;
          color: #262626;
          margin: 42px 0 0;
        }
        .tc-body sup { font-size: 0.6em; line-height: 0; }

        /* ---------- Signatures ---------- */
        .tc-signatures {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-top: 60px;
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
          color: #262626;
          transform: scaleX(0.92);
        }

        /* ---------- Footer ---------- */
        .tc-footer {
          margin-top: 22px;
          text-align: left;
          font-style: italic;
          font-size: 17px;
          color: #262626;
        }
        .tc-footer p { margin: 2px 0; }

        /* ---------- Print ---------- */
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
            zoom: 0.9;
          }
          .training-cert-area button { display: none; }
        }
      `}</style>
    </div>
  );
}
