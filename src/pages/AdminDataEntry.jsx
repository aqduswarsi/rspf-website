import { useState, useEffect } from "react";
import {
  createCourseProforma,
  getAllCourseProforma,
  updateCourseProforma,
  deleteCourseProforma,
} from "../utils/api";

const initialForm = {
  reference: "",
  courseName: "",
  batchName: "",
  trainingDays: "",
  fromDate: "",
  toDate: "",
  participantLevel: "",
  totalStrength: "",
  // RPF Zones
  wr: "",
  cr: "",
  nr: "",
  nwr: "",
  ecr: "",
  scr: "",
  sr: "",
  ner: "",
  swr: "",
  wcr: "",
  ecor: "",
  ncr: "",
  er: "",
  ser: "",
  secr: "",
  nfr: "",
  scor: "",
  metro: "",
  dlwPu: "",
  clwPu: "",
  icfPu: "",
  rcfKxhPu: "",
  dmwPu: "",
  rwfPu: "",
  rblKxhPu: "",
  rwpPu: "",
  // RPSF Battalions
  bn1: "",
  bn2: "",
  bn3: "",
  bn4: "",
  bn5: "",
  bn6: "",
  bn7: "",
  bn8: "",
  bn9: "",
  bn10: "",
  bn11: "",
  bn12: "",
  bn14: "",
  bn15: "",
  // Shortfall / Excess
  shortfallRPF: "",
  shortfallRPSF: "",
  excessRPF: "",
  excessRPSF: "",
  // Ranks
  ipf: "",
  sipf: "",
  asi: "",
  hc: "",
  ct: "",
  ctR: "",
  // Gender
  male: "",
  female: "",
  // Training
  attended: "",
  completed: "",
  certificateIssued: "",
  remarks: "",
};

const num = (v) => Number(v) || 0;

export default function AdminDataEntry() {
  const [form, setForm] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllCourseProforma();
      setRecords(data);
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

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
  };

  const handleEdit = (r) => {
    const filled = {};
    Object.keys(initialForm).forEach((k) => {
      filled[k] = r[k] !== undefined && r[k] !== null ? r[k] : "";
    });
    setForm(filled);
    setEditingId(r._id);
    setShowForm(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteCourseProforma(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.courseName.trim()) {
      setMessage("Course name is required");
      return;
    }

    // Auto calculations
    const rpfTotal =
      num(form.wr) +
      num(form.cr) +
      num(form.nr) +
      num(form.nwr) +
      num(form.ecr) +
      num(form.scr) +
      num(form.sr) +
      num(form.ner) +
      num(form.swr) +
      num(form.wcr) +
      num(form.ecor) +
      num(form.ncr) +
      num(form.er) +
      num(form.ser) +
      num(form.secr) +
      num(form.nfr) +
      num(form.scor) +
      num(form.metro) +
      num(form.dlwPu) +
      num(form.clwPu) +
      num(form.icfPu) +
      num(form.rcfKxhPu) +
      num(form.dmwPu) +
      num(form.rwfPu) +
      num(form.rblKxhPu) +
      num(form.rwpPu);

    const rpsfTotal =
      num(form.bn1) +
      num(form.bn2) +
      num(form.bn3) +
      num(form.bn4) +
      num(form.bn5) +
      num(form.bn6) +
      num(form.bn7) +
      num(form.bn8) +
      num(form.bn9) +
      num(form.bn10) +
      num(form.bn11) +
      num(form.bn12) +
      num(form.bn14) +
      num(form.bn15);

    const payload = {
      ...form,
      trainingDays: num(form.trainingDays),
      totalStrength: num(form.totalStrength),
      totalFromRPF: rpfTotal,
      totalFromRPSF: rpsfTotal,
      grandTotalArrival: rpfTotal + rpsfTotal,
      grandTotalShortfall: num(form.shortfallRPF) + num(form.shortfallRPSF),
      grandTotalExcess: num(form.excessRPF) + num(form.excessRPSF),
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateCourseProforma(editingId, payload);
        setMessage("Record updated successfully");
      } else {
        await createCourseProforma(payload);
        setMessage("Record saved successfully");
      }
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
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

  const fieldStyle = { display: "grid", gap: "6px" };
  const labelStyle = { color: "rgba(255,255,255,0.6)", fontSize: "12px" };
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
  const sectionStyle = {
    marginBottom: "24px",
    padding: "16px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "10px",
  };
  const sectionTitleStyle = {
    color: "var(--gold)",
    margin: "0 0 14px",
    fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  };
  const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Course Management</p>
          <h2>Data Entry</h2>
          <p>Add and manage course proforma records.</p>
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
          {showForm ? "Close Form" : "Add New Record"}
        </button>
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

      {/* ==================== FORM ==================== */}
      {showForm && (
        <div
          className="education-panel"
          style={{ marginBottom: "24px", padding: "20px" }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ color: "var(--gold)", marginTop: 0 }}>
              {editingId ? "Edit Record" : "New Record"}
            </h3>

            {/* Basic Info */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Basic Information</h4>
              <div style={grid3}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Reference</label>
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Course Name *</label>
                  <input
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Batch Name</label>
                  <input
                    name="batchName"
                    value={form.batchName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Training Days</label>
                  <input
                    type="number"
                    name="trainingDays"
                    value={form.trainingDays}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>From</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={form.fromDate}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>To</label>
                  <input
                    type="date"
                    name="toDate"
                    value={form.toDate}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Participant Level</label>
                  <input
                    name="participantLevel"
                    value={form.participantLevel}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Total Strength</label>
                  <input
                    type="number"
                    name="totalStrength"
                    value={form.totalStrength}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* RPF Zones */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>RPF Zones</h4>
              <div style={grid3}>
                {[
                  ["wr", "WR"],
                  ["cr", "CR"],
                  ["nr", "NR"],
                  ["nwr", "NWR"],
                  ["ecr", "ECR"],
                  ["scr", "SCR"],
                  ["sr", "SR"],
                  ["ner", "NER"],
                  ["swr", "SWR"],
                  ["wcr", "WCR"],
                  ["ecor", "ECoR"],
                  ["ncr", "NCR"],
                  ["er", "ER"],
                  ["ser", "SER"],
                  ["secr", "SECR"],
                  ["nfr", "NFR"],
                  ["scor", "SCoR"],
                  ["metro", "Metro"],
                  ["dlwPu", "DLW (PU)"],
                  ["clwPu", "CLW (PU)"],
                  ["icfPu", "ICF (PU)"],
                  ["rcfKxhPu", "RCF/KXH (PU)"],
                  ["dmwPu", "DMW (PU)"],
                  ["rwfPu", "RWF (PU)"],
                  ["rblKxhPu", "RBL/KXH (PU)"],
                  ["rwpPu", "RWP (PU)"],
                ].map(([name, label]) => (
                  <div key={name} style={fieldStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RPSF Battalions */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>RPSF Battalions</h4>
              <div style={grid3}>
                {[
                  ["bn1", "1 BN"],
                  ["bn2", "2 BN"],
                  ["bn3", "3 BN"],
                  ["bn4", "4 BN"],
                  ["bn5", "5 BN"],
                  ["bn6", "6 BN"],
                  ["bn7", "7 BN"],
                  ["bn8", "8 BN"],
                  ["bn9", "9 BN"],
                  ["bn10", "10 BN"],
                  ["bn11", "11 BN"],
                  ["bn12", "12 BN"],
                  ["bn14", "14 BN"],
                  ["bn15", "15 BN"],
                ].map(([name, label]) => (
                  <div key={name} style={fieldStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shortfall / Excess */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Shortfall & Excess</h4>
              <div style={grid3}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Shortfall from RPF</label>
                  <input
                    type="number"
                    name="shortfallRPF"
                    value={form.shortfallRPF}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Shortfall from RPSF</label>
                  <input
                    type="number"
                    name="shortfallRPSF"
                    value={form.shortfallRPSF}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Excess from RPF</label>
                  <input
                    type="number"
                    name="excessRPF"
                    value={form.excessRPF}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Excess from RPSF</label>
                  <input
                    type="number"
                    name="excessRPSF"
                    value={form.excessRPSF}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Ranks */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Ranks</h4>
              <div style={grid3}>
                {[
                  ["ipf", "IPF"],
                  ["sipf", "SIPF"],
                  ["asi", "ASI"],
                  ["hc", "HC"],
                  ["ct", "CT"],
                  ["ctR", "CT/R"],
                ].map(([name, label]) => (
                  <div key={name} style={fieldStyle}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Gender + Training */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Gender & Training</h4>
              <div style={grid3}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Male</label>
                  <input
                    type="number"
                    name="male"
                    value={form.male}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Female</label>
                  <input
                    type="number"
                    name="female"
                    value={form.female}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Attended</label>
                  <input
                    type="number"
                    name="attended"
                    value={form.attended}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Completed</label>
                  <input
                    type="number"
                    name="completed"
                    value={form.completed}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Certificate Issued</label>
                  <input
                    type="number"
                    name="certificateIssued"
                    value={form.certificateIssued}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Remarks</h4>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows="3"
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Additional notes..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="submit"
                className="primary"
                disabled={saving}
                style={{ padding: "10px 30px" }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Record"
                    : "Save Record"}
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

      {/* ==================== TABLE ==================== */}
      <div className="education-panel">
        <div className="panel-heading">
          <h3>All Records ({records.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : records.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records found. Click "Add New Record" to start.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Batch</th>
                  <th>Days</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Total Arrival</th>
                  <th>Attended</th>
                  <th>Completed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--gold)", maxWidth: "220px" }}>
                      {r.courseName}
                    </td>
                    <td>{r.batchName || "-"}</td>
                    <td>{r.trainingDays || "-"}</td>
                    <td>{formatDate(r.fromDate)}</td>
                    <td>{formatDate(r.toDate)}</td>
                    <td>{r.grandTotalArrival || 0}</td>
                    <td>{r.attended || 0}</td>
                    <td>{r.completed || 0}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(r)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(r._id)}
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
    </section>
  );
}