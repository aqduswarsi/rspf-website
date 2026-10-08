import { useState, useEffect } from "react";
import {
  createCertificate,
  getAllCertificates,
  deleteCertificate,
} from "../utils/api";

const initialForm = {
  name: "",
  certificateId: "",
  quizName: "",
  courseName: "",
  score: "",
  completedOn: new Date().toISOString().split("T")[0],
};

export default function AdminCertificate() {
  const [form, setForm] = useState(initialForm);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewCert, setPreviewCert] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.certificateId ||
      !form.quizName ||
      !form.courseName ||
      !form.score
    ) {
      setMessage("All fields are required");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      await createCertificate({
        ...form,
        score: Number(form.score),
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

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "6px",
    color: "white",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Certificates</p>
          <h2>Generate Certificate</h2>
          <p>Create completion certificates for participants.</p>
        </div>
      </div>

      {message && (
        <p
          style={{
            padding: "12px",
            background: message.toLowerCase().includes("success")
              ? "rgba(74,222,128,0.15)"
              : "rgba(239,68,68,0.15)",
            border: `1px solid ${message.toLowerCase().includes("success") ? "#4ade80" : "#ef4444"}`,
            color: message.toLowerCase().includes("success")
              ? "#4ade80"
              : "#ef4444",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </p>
      )}

      {/* Form */}
      <div
        className="education-panel"
        style={{ padding: "20px", marginBottom: "24px" }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
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
              <label style={labelStyle}>Quiz Name *</label>
              <input
                name="quizName"
                value={form.quizName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Pre Assessment Quiz"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Course Name *</label>
              <input
                name="courseName"
                value={form.courseName}
                onChange={handleChange}
                style={inputStyle}
                placeholder="For testing purpose"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Score (%) *</label>
              <input
                type="number"
                name="score"
                value={form.score}
                onChange={handleChange}
                style={inputStyle}
                placeholder="80"
                min="0"
                max="100"
                required
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

      {/* Table */}
      <div className="education-panel">
        <div className="panel-heading">
          <h3>All Certificates ({certs.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : certs.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No certificates found.
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
                  <th>Completed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--gold)" }}>{c.name}</td>
                    <td>{c.certificateId}</td>
                    <td>{c.quizName}</td>
                    <td>{c.courseName}</td>
                    <td>{c.score}%</td>
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

      {/* Preview Modal */}
      {previewCert && (
        <CertificatePreview
          cert={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </section>
  );
}

// =========================================================
//              CERTIFICATE PREVIEW COMPONENT
// =========================================================

function CertificatePreview({ cert, onClose }) {
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
        className="cert-actions"
        style={{ textAlign: "center", marginBottom: "20px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: "10px 24px",
            background:
              "linear-gradient(135deg, var(--maroon), var(--maroon-light))",
            color: "var(--gold)",
            border: "1px solid rgba(212,175,55,0.4)",
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
            color: "var(--gold)",
            border: "1px solid rgba(212,175,55,0.4)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Close
        </button>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <div className="cert-print-area">
          <div className="cert-outer">
            <div className="cert-inner">
              {/* Corner brackets */}
              <div className="cert-corner cert-tl" />
              <div className="cert-corner cert-tr" />
              <div className="cert-corner cert-bl" />
              <div className="cert-corner cert-br" />

              <h1 className="cert-header">RPSF TRAINING CENTRE, GORAKHPUR</h1>
              <p className="cert-subheader">(Railway Protection Force)</p>

              <h2 className="cert-title">Certificate of Completion</h2>

              <div className="cert-body">
                <p className="cert-awarded">This certificate is awarded to</p>

                <p className="cert-name">{cert.name}</p>

                <p className="cert-id">ID: {cert.certificateId}</p>

                <p className="cert-text">
                  For successfully completing the{" "}
                  <strong>{cert.quizName}</strong> in
                </p>

                <p className="cert-course">{cert.courseName}</p>

                <p className="cert-text">
                  and successfully passing the assessment with a score of{" "}
                  <strong className="cert-score">{cert.score}%</strong>.
                </p>

                <p className="cert-completed">
                  Completed on {formatDate(cert.completedOn)}
                </p>
              </div>

              <div className="cert-footer">
                <div className="cert-sign">
                  <img
                    src="/signature-coordinator.png"
                    alt="Course Co-ordinator Signature"
                    className="cert-sign-img"
                  />
                  <p className="cert-sign-label">Course Co-ordinator</p>
                  <div className="cert-sign-line" />
                </div>

                <div className="cert-qr">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      cert.certificateId,
                    )}`}
                    alt="QR Code"
                    width="80"
                    height="80"
                  />
                </div>

                <div className="cert-sign">
                  <img
                    src="/signature-viceprincipal.png"
                    alt="Vice-Principal Signature"
                    className="cert-sign-img"
                  />
                  <p className="cert-sign-label">Vice-Principal</p>
                  <div className="cert-sign-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cert-print-area {
          background: #fffdf8;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 14px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cert-outer {
          background: #fffdf8;
          border: 8px solid #c9b45e;
          padding: 8px;
        }
        .cert-inner {
          border: 2px solid #0f2350;
          padding: 36px 60px 40px;
          position: relative;
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #0f2350;
          text-align: center;
          min-height: 640px;
          display: flex;
          flex-direction: column;
        }
        .cert-corner {
          position: absolute;
          width: 36px;
          height: 36px;
          border-color: #0f2350;
        }
        .cert-tl { top: 8px; left: 8px; border-top: 3px solid; border-left: 3px solid; }
        .cert-tr { top: 8px; right: 8px; border-top: 3px solid; border-right: 3px solid; }
        .cert-bl { bottom: 8px; left: 8px; border-bottom: 3px solid; border-left: 3px solid; }
        .cert-br { bottom: 8px; right: 8px; border-bottom: 3px solid; border-right: 3px solid; }

        .cert-header {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #0f2350;
          margin: 0;
          letter-spacing: 0;
        }
        .cert-subheader {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          color: #0f2350;
          margin: 2px 0 14px;
          font-weight: 400;
        }
        .cert-title {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 50px;
          font-weight: 700;
          color: #0f2350;
          margin: 8px 0 0;
        }
        .cert-body {
          margin-top: 120px;
        }
        .cert-awarded {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 17px;
          color: #666;
          margin: 0 0 10px;
        }
        .cert-name {
          font-size: 48px;
          font-style: italic;
          font-family: 'Georgia', 'Times New Roman', serif;
          color: #222;
          margin: 0;
          font-weight: 400;
        }
        .cert-id {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #888;
          margin: 6px 0 26px;
        }
        .cert-text {
          font-size: 18px;
          color: #222;
          margin: 8px 0;
        }
        .cert-text strong {
          color: #222;
          font-weight: 700;
        }
        .cert-text .cert-score {
          color: #c8651b;
        }
        .cert-course {
          font-size: 44px;
          font-style: italic;
          color: #c8651b;
          font-family: 'Georgia', 'Times New Roman', serif;
          margin: 14px 0 6px;
        }
        .cert-completed {
          font-size: 17px;
          color: #888;
          margin: 14px 0 0;
        }
        .cert-footer {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-top: 40px;
          gap: 120px;
        }
        .cert-sign {
          width: 260px;
          text-align: center;
        }
        .cert-sign-img {
          height: 70px;
          width: auto;
          display: block;
          margin: 0 auto 14px;
          object-fit: contain;
        }
        .cert-sign-label {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f2350;
          margin: 0;
        }
        .cert-sign-line {
          border-top: 1px solid #0f2350;
          margin: 18px auto 0;
          width: 100%;
          opacity: 0.5;
        }
        .cert-qr {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px;
        }

        @media print {
          @page { size: A4 landscape; margin: 0; }
          body * { visibility: hidden; }
          .cert-print-area, .cert-print-area * { visibility: visible; }
          .cert-print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 0;
            border-radius: 0;
          }
          .cert-actions { display: none; }
        }
      `}</style>
    </div>
  );
}
