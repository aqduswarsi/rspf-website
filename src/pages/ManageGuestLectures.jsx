import { useState, useEffect, useMemo } from "react";
import {
  createGuestLecture,
  getAllGuestLectures,
  updateGuestLecture,
  deleteGuestLecture,
  getAllCourses,
  getAllSubjects, // 👈 1. Subjects fetch karne ke liye import kiya
} from "../utils/api";

export default function ManageGuestLectures() {
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]); // 👈 2. Subjects state banayi
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // 🔍 Search & Filter States
  const [searchText, setSearchText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const [printAllMode, setPrintAllMode] = useState(false);
  const [printSingleData, setPrintSingleData] = useState(null);

  // Form State
  const [form, setForm] = useState({
    date: "",
    guestName: "",
    designation: "",
    placeOfPosting: "",
    course: "",
    status: "In Service",
    employeeType: "Railway Emp",
    subject: "", // Ab ye dropdown se select hoga
    startTime: "",
    endTime: "",
    signOfLecturer: "",
    signOfPTC: "",
    remark: "Paid",
    guestHonorarium: "",
  });

  useEffect(() => {
    loadData();
    loadCourses();
    loadSubjects(); // 👈 3. Page load hote hi subjects fetch karo
  }, []);

  const loadData = async () => {
    try {
      const data = await getAllGuestLectures();
      setLectures(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  };

  // 👈 4. Subjects fetch karne ka function
  const loadSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      date: "",
      guestName: "",
      designation: "",
      placeOfPosting: "",
      course: "",
      status: "In Service",
      employeeType: "Railway Emp",
      subject: "",
      startTime: "",
      endTime: "",
      signOfLecturer: "",
      signOfPTC: "",
      remark: "Paid",
      guestHonorarium: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.guestName || !form.date || !form.subject) {
      return setMessage("❌ Date, Name and Subject are required");
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateGuestLecture(editingId, form);
        setMessage("✅ Record updated successfully!");
      } else {
        await createGuestLecture(form);
        setMessage("✅ Record added successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      date: item.date ? item.date.split("T")[0] : "",
      guestName: item.guestName || "",
      designation: item.designation || "",
      placeOfPosting: item.placeOfPosting || "",
      course: item.course || "",
      status: item.status || "In Service",
      employeeType: item.employeeType || "Railway Emp",
      subject: item.subject || "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      signOfLecturer: item.signOfLecturer || "",
      signOfPTC: item.signOfPTC || "",
      remark: item.remark || "Paid",
      guestHonorarium: item.guestHonorarium || "",
    });
    setEditingId(item._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteGuestLecture(id);
      loadData();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ============ FILTER LOGIC ============
  const filteredLectures = useMemo(() => {
    return lectures.filter((item) => {
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const fields = [
          item.guestName,
          item.subject,
          item.designation,
          item.placeOfPosting,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        if (!fields.some((f) => f.includes(q))) return false;
      }

      if (filterCourse && item.course !== filterCourse) return false;

      const itemDate = item.date ? String(item.date).slice(0, 10) : "";
      if (filterFromDate && (!itemDate || itemDate < filterFromDate))
        return false;
      if (filterToDate && (!itemDate || itemDate > filterToDate)) return false;

      return true;
    });
  }, [lectures, searchText, filterCourse, filterFromDate, filterToDate]);

  const hasActiveFilters =
    searchText || filterCourse || filterFromDate || filterToDate;

  const clearFilters = () => {
    setSearchText("");
    setFilterCourse("");
    setFilterFromDate("");
    setFilterToDate("");
  };

  // ============ PRINT HANDLERS ============
  const handlePrintAll = () => {
    if (filteredLectures.length === 0) {
      setMessage("No records to print");
      return;
    }
    setPrintAllMode(true);
    setTimeout(() => {
      window.print();
      setPrintAllMode(false);
    }, 500);
  };

  const handlePrintSingle = (item) => {
    setPrintSingleData(item);
    setTimeout(() => {
      window.print();
      setPrintSingleData(null);
    }, 500);
  };

  // 👈 5. Filtered Subjects (Agar Course select hai to uske subjects dikhao)
  const filteredSubjects = useMemo(() => {
    if (!form.course) return subjects; // Agar course nahi chuna, to sab dikhao
    const selectedCourse = courses.find((c) => c.name === form.course);
    if (!selectedCourse) return subjects;

    return subjects.filter((s) => {
      const sCourseId = s.courseId?._id || s.courseId;
      return sCourseId === selectedCourse._id;
    });
  }, [subjects, courses, form.course]);

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h2>{editingId ? "Edit Guest Lecture" : "Add Guest Lecture"}</h2>
          <p>Manage daily guest lectures and signatures.</p>
        </div>
        <button
          type="button"
          className="primary"
          onClick={handlePrintAll}
          style={{
            padding: "10px 20px",
            background: "var(--navy)",
            color: "white",
          }}
        >
          Print ({filteredLectures.length})
        </button>
      </div>

      {/* FORM */}
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Name of Guest</label>
              <input
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                placeholder="e.g., A.K. Pathak"
                required
              />
            </div>
            <div>
              <label>Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="e.g., DR. PREMSJIT YADAV"
                required
              />
            </div>
            <div>
              <label>Place of Posting</label>
              <input
                name="placeOfPosting"
                value={form.placeOfPosting}
                onChange={handleChange}
                placeholder="e.g., GKP"
                required
              />
            </div>

            <div>
              <label>Course</label>
              <select
                name="course"
                value={form.course}
                onChange={(e) => {
                  // Course change hone par subject reset kar do
                  setForm({ ...form, course: e.target.value, subject: "" });
                }}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="In Service">In Service</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div>
              <label>Employee Type</label>
              <select
                name="employeeType"
                value={form.employeeType}
                onChange={handleChange}
              >
                <option value="Railway Emp">Railway Emp</option>
                <option value="Non-Railway Emp">Non-Railway Emp</option>
              </select>
            </div>

            {/* 👈 6. Subject Dropdown me badla */}
            <div>
              <label>Subject / Topic</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Subject --</option>
                {filteredSubjects.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", gridColumn: "span 2" }}>
              <div style={{ flex: 1 }}>
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label>Sign of Lecturer</label>
              <input
                name="signOfLecturer"
                value={form.signOfLecturer}
                onChange={handleChange}
                placeholder="Sign or Name"
              />
            </div>
            <div>
              <label>Sign of PTC / VPTC</label>
              <input
                name="signOfPTC"
                value={form.signOfPTC}
                onChange={handleChange}
                placeholder="Sign or Name"
              />
            </div>

            <div>
              <label>Remark</label>
              <select name="remark" value={form.remark} onChange={handleChange}>
                <option value="Paid">Paid</option>
                <option value="Non-Paid">Non-Paid</option>
              </select>
            </div>

            <div>
              <label>Guest Honorarium</label>
              <input
                name="guestHonorarium"
                value={form.guestHonorarium}
                onChange={handleChange}
                placeholder="e.g., ₹1000"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Record"
                  : "Save Record"}
            </button>
            {editingId && (
              <button
                type="button"
                className="table-action"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>

      {/* TABLE & FILTERS */}
      <div className="education-panel" style={{ marginTop: "20px" }}>
        <div className="panel-heading">
          <h3>
            All Guest Lectures ({filteredLectures.length}
            {filteredLectures.length !== lectures.length &&
              ` of ${lectures.length}`}
            )
          </h3>
        </div>

        {/* 🔍 FILTERS */}
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
            <label>Search (Name, Subject, Place)</label>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type to search..."
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
          </div>
          <div>
            <label>Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>From Date</label>
            <input
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
          </div>
          <div>
            <label>To Date</label>
            <input
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            />
          </div>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            style={{
              padding: "8px 16px",
              background: hasActiveFilters ? "#FEF2F2" : "#f3f4f6",
              color: hasActiveFilters ? "#B91C1C" : "#9ca3af",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              cursor: hasActiveFilters ? "pointer" : "not-allowed",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : lectures.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records found.
            </p>
          ) : filteredLectures.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records match your filters.
            </p>
          ) : (
            <table className="education-table" style={{ fontSize: "13px" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Guest Name</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Honorarium</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLectures.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td style={{ color: "var(--gold)" }}>{item.guestName}</td>
                    <td>{item.course || "-"}</td>
                    <td>{item.subject}</td>
                    <td>{item.guestHonorarium || "-"}</td>
                    <td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background:
                            item.remark === "Paid" ? "#e0f2fe" : "#fee2e2",
                          color: item.remark === "Paid" ? "#0369a1" : "#b91c1c",
                        }}
                      >
                        {item.remark}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handlePrintSingle(item)}
                        style={{
                          background: "#f0f8f1",
                          color: "#15803D",
                          border: "1px solid #a7ddb2",
                        }}
                      >
                        Print
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(item._id)}
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

      {/* ==================== PRINT AREA ==================== */}
      {(printAllMode || printSingleData) && (
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
          {printAllMode ? (
            filteredLectures.map((item) => (
              <div
                key={item._id}
                style={{ pageBreakAfter: "always", marginBottom: "20px" }}
              >
                <GuestLecturePrintView data={item} />
              </div>
            ))
          ) : (
            <GuestLecturePrintView data={printSingleData} />
          )}
        </div>
      )}

      <style>{`
        @page { size: A4 portrait; margin: 15mm; }
        @media print {
          body * { visibility: hidden; }
          .print-all-area, .print-all-area * { visibility: visible; }
          .print-all-area { position: absolute; top: 0; left: 0; width: 100%; }
          .print-all-area > div { page-break-after: always; }
          .print-all-area > div:last-child { page-break-after: auto; }
        }
      `}</style>
    </section>
  );
}

// =========================================================
//           GUEST LECTURE PRINT PREVIEW COMPONENT
// =========================================================
function GuestLecturePrintView({ data }) {
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#000",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          borderBottom: "2px solid #000",
          paddingBottom: "10px",
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            fontSize: "24px",
            textTransform: "uppercase",
          }}
        >
          RPSF Training Centre
        </h2>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "normal" }}>
          Rajahi Camp, Gorakhpur
        </h3>
        <h4
          style={{
            margin: "10px 0 0",
            fontSize: "16px",
            textDecoration: "underline",
          }}
        >
          Guest Lecture Record
        </h4>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
                width: "30%",
              }}
            >
              Date
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {formatDate(data.date)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Name of Guest
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.guestName}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Designation
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.designation}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Place of Posting
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.placeOfPosting}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Course
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.course || "-"}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Subject / Topic
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.subject}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Time
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.startTime} to {data.endTime}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Status
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.status} ({data.employeeType})
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Remark
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.remark}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                fontWeight: "bold",
              }}
            >
              Guest Honorarium
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              {data.guestHonorarium || "-"}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "60px",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", width: "200px" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: "5px",
              marginTop: "40px",
            }}
          >
            <strong>Sign of Lecturer</strong>
            <br />
            <span style={{ fontSize: "12px" }}>
              {data.signOfLecturer || data.guestName}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "center", width: "200px" }}>
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: "5px",
              marginTop: "40px",
            }}
          >
            <strong>Sign of PTC / VPTC</strong>
            <br />
            <span style={{ fontSize: "12px" }}>{data.signOfPTC}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
