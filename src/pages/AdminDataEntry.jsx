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
  tc: "",
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
  ["tc", "TC"],
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
const textValue = (v) =>
  String(v ?? "")
    .trim()
    .toLowerCase();
const dateValue = (v) => {
  if (!v) return "";
  const value = String(v).trim();
  const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, "0"),
    String(parsed.getDate()).padStart(2, "0"),
  ].join("-");
};

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
    const normalized = dateValue(d);
    if (!normalized) return "-";
    const [year, month, day] = normalized.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============ FILTERED RECORDS ============
  const filteredRecords = records.filter((r) => {
    // Text search across ALL text fields
    if (searchText.trim()) {
      const q = textValue(searchText);
      const textFields = [
        r.reference,
        r.courseName,
        r.batchName,
        r.participantLevel,
        r.remarks,
      ]
        .filter(Boolean)
        .map(textValue);
      const matched = textFields.some((t) => t.includes(q));
      if (!matched) return false;
    }

    // Batch
    if (filterBatch && textValue(r.batchName) !== textValue(filterBatch))
      return false;

    // Year
    if (filterYear) {
      const fromDate = dateValue(r.fromDate);
      const y = fromDate ? fromDate.slice(0, 4) : "";
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
      const fdate = dateValue(r.fromDate);
      if (!fdate || fdate < filterFromDate) return false;
    }
    if (filterToDate) {
      const tdate = dateValue(r.toDate);
      if (!tdate || tdate > filterToDate) return false;
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
          if (!textValue(r.remarks)) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  const uniqueBatches = [
    ...new Set(
      records.map((r) => String(r.batchName ?? "").trim()).filter(Boolean),
    ),
  ].sort();

  const uniqueYears = [
    ...new Set(
      records.map((r) => dateValue(r.fromDate).slice(0, 4)).filter(Boolean),
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

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const handlePrintSummary = () => {
    if (filteredRecords.length === 0) {
      alert("No records available to print.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) {
      alert("Please allow pop-ups to print the course summary.");
      return;
    }

    const selectedZone = ZONES.find(([key]) => key === filterZone)?.[1] || "";
    const selectedBattalion =
      BATTALIONS.find(([key]) => key === filterBattalion)?.[1] || "";
    const selectedRank = RANKS.find(([key]) => key === filterRank)?.[1] || "";
    const activeFilters = [
      searchText.trim() ? `Search: ${searchText.trim()}` : "",
      filterBatch ? `Batch: ${filterBatch}` : "",
      filterYear ? `Year: ${filterYear}` : "",
      selectedZone ? `Zone: ${selectedZone}` : "",
      selectedBattalion ? `Battalion: ${selectedBattalion}` : "",
      selectedRank ? `Rank: ${selectedRank}` : "",
      filterHasData ? `Has data: ${filterHasData}` : "",
      filterFromDate ? `From date: ${formatDate(filterFromDate)}` : "",
      filterToDate ? `To date: ${formatDate(filterToDate)}` : "",
    ].filter(Boolean);
    const totals = filteredRecords.reduce(
      (sum, r) => ({
        trainingDays: sum.trainingDays + num(r.trainingDays),
        strength: sum.strength + num(r.totalStrength),
        selectedZone: sum.selectedZone + num(filterZone ? r[filterZone] : 0),
        selectedBattalion:
          sum.selectedBattalion + num(filterBattalion ? r[filterBattalion] : 0),
        selectedRank: sum.selectedRank + num(filterRank ? r[filterRank] : 0),
        rpf:
          sum.rpf +
          (num(r.totalFromRPF) ||
            ZONES.reduce((n, [key]) => n + num(r[key]), 0)),
        rpsf:
          sum.rpsf +
          (num(r.totalFromRPSF) ||
            BATTALIONS.reduce((n, [key]) => n + num(r[key]), 0)),
        shortfall:
          sum.shortfall +
          (num(r.grandTotalShortfall) ||
            num(r.shortfallRPF) + num(r.shortfallRPSF)),
        excess:
          sum.excess +
          (num(r.grandTotalExcess) || num(r.excessRPF) + num(r.excessRPSF)),
        attended: sum.attended + num(r.attended),
        completed: sum.completed + num(r.completed),
        certificates: sum.certificates + num(r.certificateIssued),
        male: sum.male + num(r.male),
        female: sum.female + num(r.female),
      }),
      {
        trainingDays: 0,
        strength: 0,
        selectedZone: 0,
        selectedBattalion: 0,
        selectedRank: 0,
        rpf: 0,
        rpsf: 0,
        shortfall: 0,
        excess: 0,
        attended: 0,
        completed: 0,
        certificates: 0,
        male: 0,
        female: 0,
      },
    );

    const rows = filteredRecords
      .map((r, i) => {
        const rpf =
          num(r.totalFromRPF) ||
          ZONES.reduce((sum, [key]) => sum + num(r[key]), 0);
        const rpsf =
          num(r.totalFromRPSF) ||
          BATTALIONS.reduce((sum, [key]) => sum + num(r[key]), 0);
        const shortfall =
          num(r.grandTotalShortfall) ||
          num(r.shortfallRPF) + num(r.shortfallRPSF);
        const excess =
          num(r.grandTotalExcess) || num(r.excessRPF) + num(r.excessRPSF);

        return `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(r.courseName)}</td>
            <td>${escapeHtml(r.batchName || "-")}</td>
            <td>${escapeHtml(r.reference || "-")}</td>
            <td>${escapeHtml(formatDate(r.fromDate))}</td>
            <td>${escapeHtml(formatDate(r.toDate))}</td>
            ${
              selectedZone
                ? `<td class="num"><strong>${num(r[filterZone])}</strong></td>`
                : ""
            }
            ${
              selectedBattalion
                ? `<td class="num"><strong>${num(r[filterBattalion])}</strong></td>`
                : ""
            }
            ${
              selectedRank
                ? `<td class="num"><strong>${num(r[filterRank])}</strong></td>`
                : ""
            }
            <td class="num">${num(r.trainingDays)}</td>
            <td class="num">${num(r.totalStrength)}</td>
            <td class="num">${rpf}</td>
            <td class="num">${rpsf}</td>
            <td class="num">${rpf + rpsf}</td>
            <td class="num">${shortfall}</td>
            <td class="num">${excess}</td>
            <td class="num">${num(r.attended)}</td>
            <td class="num">${num(r.completed)}</td>
            <td class="num">${num(r.certificateIssued)}</td>
            <td class="num">${num(r.male)}</td>
            <td class="num">${num(r.female)}</td>
            <td>${escapeHtml(r.remarks || "-")}</td>
          </tr>`;
      })
      .join("");

    // Column widths (weights) - auto-normalised to 100%, order must match the table columns
    const colWeights = [
      2.5,
      11,
      6.5,
      7,
      6,
      6,
      ...(selectedZone ? [5] : []),
      ...(selectedBattalion ? [5] : []),
      ...(selectedRank ? [5] : []),
      3.5,
      5,
      4.5,
      4.5,
      5,
      5.5,
      5,
      5.5,
      6,
      6,
      3.5,
      4,
      8.5,
    ];
    const colWeightSum = colWeights.reduce((a, b) => a + b, 0);
    const colGroup = colWeights
      .map(
        (w) => `<col style="width:${((w / colWeightSum) * 100).toFixed(2)}%">`,
      )
      .join("");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Course Proforma Summary</title>
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #111827; font-family: Arial, sans-serif; font-size: 9px; }
            .header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 8px; margin-bottom: 10px; }
            .header h1 { margin: 0; font-size: 17px; letter-spacing: 0.5px; }
            .header p { margin: 4px 0 0; font-size: 10px; }
            .meta { display: flex; justify-content: space-between; margin: 8px 0; font-weight: 700; }
            .filters { margin: 0 0 8px; padding: 6px 8px; border: 1px solid #d1d5db; background: #f3f4f6; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th, td { border: 1px solid #374151; padding: 4px 3px; vertical-align: top; }
            th { background: #e5e7eb; font-size: 7px; text-transform: uppercase; padding: 4px 2px; text-align: center; overflow-wrap: anywhere; }
            td { font-size: 8px; overflow-wrap: anywhere; }
            .num { text-align: right; }
            tbody tr:nth-child(even) { background: #f9fafb; }
            tfoot td { background: #dbeafe; font-weight: 700; }
            .footer { margin-top: 10px; display: flex; justify-content: space-between; }
            .sign { width: 30%; border-top: 1px solid #374151; padding-top: 4px; text-align: center; }
            @media print {
              thead { display: table-header-group; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>COURSE PROFORMA CONSOLIDATED SUMMARY</h1>
            <p>RPSF Training Center, Rajahi Camp, Gorakhpur</p>
          </div>
          <div class="meta">
            <span>Record(s): ${filteredRecords.length}</span>
            <span>Printed on: ${escapeHtml(
              new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            )}</span>
          </div>
          ${
            activeFilters.length
              ? `<div class="filters">Applied filters: ${escapeHtml(activeFilters.join(" | "))}</div>`
              : ""
          }
          <table>
            <colgroup>${colGroup}</colgroup>
            <thead>
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Reference</th>
                <th>From</th>
                <th>To</th>
                ${selectedZone ? `<th>${escapeHtml(selectedZone)} Arrivals</th>` : ""}
                ${selectedBattalion ? `<th>${escapeHtml(selectedBattalion)} Arrivals</th>` : ""}
                ${selectedRank ? `<th>${escapeHtml(selectedRank)} Strength</th>` : ""}
                <th>Days</th>
                <th>Strength</th>
                <th>RPF</th>
                <th>RPSF</th>
                <th>Arrival</th>
                <th>Shortfall</th>
                <th>Excess</th>
                <th>Attended</th>
                <th>Completed</th>
                <th>Certificate</th>
                <th>Male</th>
                <th>Female</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <td colspan="6">TOTAL</td>
                ${selectedZone ? `<td class="num">${totals.selectedZone}</td>` : ""}
                ${selectedBattalion ? `<td class="num">${totals.selectedBattalion}</td>` : ""}
                ${selectedRank ? `<td class="num">${totals.selectedRank}</td>` : ""}
                <td class="num">${totals.trainingDays}</td>
                <td class="num">${totals.strength}</td>
                <td class="num">${totals.rpf}</td>
                <td class="num">${totals.rpsf}</td>
                <td class="num">${totals.rpf + totals.rpsf}</td>
                <td class="num">${totals.shortfall}</td>
                <td class="num">${totals.excess}</td>
                <td class="num">${totals.attended}</td>
                <td class="num">${totals.completed}</td>
                <td class="num">${totals.certificates}</td>
                <td class="num">${totals.male}</td>
                <td class="num">${totals.female}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <div class="footer">
            <div class="sign">Prepared by</div>
            <div class="sign">Checked by</div>
            <div class="sign">Approved by</div>
          </div>
          <script>window.onload = function () { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="table-action"
            onClick={handlePrintSummary}
            disabled={filteredRecords.length === 0}
            style={{ padding: "10px 18px" }}
          >
            Print Summary
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
              }
            }}
            style={{ padding: "10px 24px" }}
          >
            {showForm ? "Close Form" : "Add New Record"}
          </button>
        </div>
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
                  <label style={labelStyle}>Alloted Strength</label>
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
