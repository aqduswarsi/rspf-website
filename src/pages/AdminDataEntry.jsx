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
  shortfallRPF: "",
  shortfallRPSF: "",
  excessRPF: "",
  excessRPSF: "",
  ipf: "",
  sipf: "",
  asi: "",
  hc: "",
  ct: "",
  ctR: "",
  male: "",
  female: "",
  attended: "",
  completed: "",
  certificateIssued: "",
  remarks: "",
};

const ZONES = [
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
];

const BATTALIONS = [
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
];

const RANKS = [
  ["ipf", "IPF"],
  ["sipf", "SIPF"],
  ["asi", "ASI"],
  ["hc", "HC"],
  ["ct", "CT"],
  ["ctR", "CT/R"],
];

const num = (v) => Number(v) || 0;

export default function AdminDataEntry() {
  const [form, setForm] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterZone, setFilterZone] = useState("");
  const [filterBattalion, setFilterBattalion] = useState("");
  const [filterRank, setFilterRank] = useState("");
  const [filterHasData, setFilterHasData] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

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

    const rpfTotal = ZONES.reduce((sum, [key]) => sum + num(form[key]), 0);
    const rpsfTotal = BATTALIONS.reduce(
      (sum, [key]) => sum + num(form[key]),
      0,
    );

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

  // ============ FILTERED RECORDS ============
  const filteredRecords = records.filter((r) => {
    // Text search across ALL text fields
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      const textFields = [
        r.reference,
        r.courseName,
        r.batchName,
        r.participantLevel,
        r.remarks,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      const matched = textFields.some((t) => t.includes(q));
      if (!matched) return false;
    }

    // Batch
    if (filterBatch && (r.batchName || "") !== filterBatch) return false;

    // Year
    if (filterYear) {
      const y = r.fromDate ? new Date(r.fromDate).getFullYear().toString() : "";
      if (y !== filterYear) return false;
    }

    // Zone (has value > 0)
    if (filterZone && num(r[filterZone]) <= 0) return false;

    // Battalion (has value > 0)
    if (filterBattalion && num(r[filterBattalion]) <= 0) return false;

    // Rank (has value > 0)
    if (filterRank && num(r[filterRank]) <= 0) return false;

    // Date range
    if (filterFromDate) {
      const fdate = r.fromDate ? new Date(r.fromDate) : null;
      const filterDate = new Date(filterFromDate);
      if (!fdate || fdate < filterDate) return false;
    }
    if (filterToDate) {
      const tdate = r.toDate ? new Date(r.toDate) : null;
      const filterDate = new Date(filterToDate);
      if (!tdate || tdate > filterDate) return false;
    }

    // "Has Data" filter
    if (filterHasData) {
      switch (filterHasData) {
        case "attended":
          if (num(r.attended) <= 0) return false;
          break;
        case "completed":
          if (num(r.completed) <= 0) return false;
          break;
        case "certificate":
          if (num(r.certificateIssued) <= 0) return false;
          break;
        case "shortfall":
          if (num(r.shortfallRPF) + num(r.shortfallRPSF) <= 0) return false;
          break;
        case "excess":
          if (num(r.excessRPF) + num(r.excessRPSF) <= 0) return false;
          break;
        case "male":
          if (num(r.male) <= 0) return false;
          break;
        case "female":
          if (num(r.female) <= 0) return false;
          break;
        case "remarks":
          if (!r.remarks || !r.remarks.trim()) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  const uniqueBatches = [
    ...new Set(records.map((r) => r.batchName).filter(Boolean)),
  ].sort();

  const uniqueYears = [
    ...new Set(
      records
        .map((r) =>
          r.fromDate ? new Date(r.fromDate).getFullYear().toString() : "",
        )
        .filter(Boolean),
    ),
  ].sort((a, b) => b - a);

  const clearFilters = () => {
    setSearchText("");
    setFilterBatch("");
    setFilterYear("");
    setFilterZone("");
    setFilterBattalion("");
    setFilterRank("");
    setFilterHasData("");
    setFilterFromDate("");
    setFilterToDate("");
  };

  const hasActiveFilters =
    searchText ||
    filterBatch ||
    filterYear ||
    filterZone ||
    filterBattalion ||
    filterRank ||
    filterHasData ||
    filterFromDate ||
    filterToDate;

  const calcRpfTotal = ZONES.reduce((sum, [key]) => sum + num(form[key]), 0);
  const calcRpsfTotal = BATTALIONS.reduce(
    (sum, [key]) => sum + num(form[key]),
    0,
  );

  // ============ STYLES ============
  const fieldStyle = { display: "grid", gap: "6px" };
  const labelStyle = { color: "var(--ink)", fontSize: "12px" };
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
  const sectionStyle = {
    marginBottom: "24px",
    padding: "16px",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
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
  const filterGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "12px",
    alignItems: "end",
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
            border: `1px solid ${
              message.toLowerCase().includes("success") ? "#4ade80" : "#ef4444"
            }`,
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
                {ZONES.map(([name, label]) => (
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
                {BATTALIONS.map(([name, label]) => (
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
              <h4 style={sectionTitleStyle}>Shortfall &amp; Excess</h4>
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
                {RANKS.map(([name, label]) => (
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
              <h4 style={sectionTitleStyle}>Gender &amp; Training</h4>
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

            {/* Auto-Calculated Summary */}
            <div style={sectionStyle}>
              <h4 style={sectionTitleStyle}>Auto-Calculated Summary</h4>
              <div style={grid3}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Total Arrival from RPF</label>
                  <input
                    value={calcRpfTotal}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#F8F7F4",
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Total Arrival from RPSF</label>
                  <input
                    value={calcRpsfTotal}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#F8F7F4",
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Grand Total Arrival</label>
                  <input
                    value={calcRpfTotal + calcRpsfTotal}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#FFF7ED",
                      color: "#C2410C",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Grand Total Shortfall</label>
                  <input
                    value={num(form.shortfallRPF) + num(form.shortfallRPSF)}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#F8F7F4",
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Grand Total Excess</label>
                  <input
                    value={num(form.excessRPF) + num(form.excessRPSF)}
                    readOnly
                    style={{
                      ...inputStyle,
                      background: "#F8F7F4",
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>
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
          <h3>
            All Records ({filteredRecords.length}
            {filteredRecords.length !== records.length &&
              ` of ${records.length}`}
            )
          </h3>
          <button
            type="button"
            className="table-action"
            onClick={() => setShowAdvanced((prev) => !prev)}
            style={{ padding: "8px 14px", fontSize: "12px" }}
          >
            {showAdvanced ? "Hide Advanced Filters" : "Advanced Filters"}
          </button>
        </div>

        {/* Basic Filters */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
            ...filterGrid,
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Search (Course, Batch, Reference, Remarks)
            </label>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type any keyword..."
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
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

          <div style={fieldStyle}>
            <label style={labelStyle}>Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Years</option>
              {uniqueYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>&nbsp;</label>
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
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--line)",
              background: "#FAFAF8",
              ...filterGrid,
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Zone (has data)</label>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Zones</option>
                {ZONES.map(([name, label]) => (
                  <option key={name} value={name}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Battalion (has data)</label>
              <select
                value={filterBattalion}
                onChange={(e) => setFilterBattalion(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Battalions</option>
                {BATTALIONS.map(([name, label]) => (
                  <option key={name} value={name}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Rank (has data)</label>
              <select
                value={filterRank}
                onChange={(e) => setFilterRank(e.target.value)}
                style={inputStyle}
              >
                <option value="">All Ranks</option>
                {RANKS.map(([name, label]) => (
                  <option key={name} value={name}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Has Data In</label>
              <select
                value={filterHasData}
                onChange={(e) => setFilterHasData(e.target.value)}
                style={inputStyle}
              >
                <option value="">Any</option>
                <option value="attended">Attended</option>
                <option value="completed">Completed</option>
                <option value="certificate">Certificate Issued</option>
                <option value="shortfall">Shortfall</option>
                <option value="excess">Excess</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="remarks">Has Remarks</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>From Date (after)</label>
              <input
                type="date"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>To Date (before)</label>
              <input
                type="date"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : records.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records found. Click "Add New Record" to start.
            </p>
          ) : filteredRecords.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records match your filters.
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
                  <th>RPF</th>
                  <th>RPSF</th>
                  <th>Grand Arrival</th>
                  <th>Shortfall</th>
                  <th>Excess</th>
                  <th>Attended</th>
                  <th>Completed</th>
                  <th>Certificate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td style={{ color: "var(--gold)", maxWidth: "220px" }}>
                      {r.courseName}
                    </td>
                    <td>{r.batchName || "-"}</td>
                    <td>{r.trainingDays || "-"}</td>
                    <td>{formatDate(r.fromDate)}</td>
                    <td>{formatDate(r.toDate)}</td>
                    <td>{r.totalFromRPF || 0}</td>
                    <td>{r.totalFromRPSF || 0}</td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: "var(--navy)",
                      }}
                    >
                      {r.grandTotalArrival || 0}
                    </td>
                    <td>{r.grandTotalShortfall || 0}</td>
                    <td>{r.grandTotalExcess || 0}</td>
                    <td>{r.attended || 0}</td>
                    <td>{r.completed || 0}</td>
                    <td>{r.certificateIssued || 0}</td>
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
