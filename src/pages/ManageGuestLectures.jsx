import { useState, useEffect } from "react";
import {
  createGuestLecture,
  getAllGuestLectures,
  updateGuestLecture,
  deleteGuestLecture,
} from "../utils/api";

export default function ManageGuestLectures() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    date: "",
    guestName: "",
    designation: "",
    placeOfPosting: "",
    status: "In Service",
    employeeType: "Railway Emp",
    subject: "",
    startTime: "",
    endTime: "",
    signOfLecturer: "",
    signOfPTC: "",
    remark: "Paid",
  });

  useEffect(() => {
    loadData();
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      date: "",
      guestName: "",
      designation: "",
      placeOfPosting: "",
      status: "In Service",
      employeeType: "Railway Emp",
      subject: "",
      startTime: "",
      endTime: "",
      signOfLecturer: "",
      signOfPTC: "",
      remark: "Paid",
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
      status: item.status || "In Service",
      employeeType: item.employeeType || "Railway Emp",
      subject: item.subject || "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      signOfLecturer: item.signOfLecturer || "",
      signOfPTC: item.signOfPTC || "",
      remark: item.remark || "Paid",
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

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h2>{editingId ? "Edit Guest Lecture" : "Add Guest Lecture"}</h2>
          <p>Manage daily guest lectures and signatures.</p>
        </div>
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

            <div>
              <label>Subject / Topic</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g., First Aid"
                required
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
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
              <label>Sign of PTC / UPTC</label>
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

      {/* TABLE */}
      <div className="education-panel" style={{ marginTop: "20px" }}>
        <div className="panel-heading">
          <h3>All Guest Lectures ({lectures.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : lectures.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No records found.
            </p>
          ) : (
            <table className="education-table" style={{ fontSize: "13px" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Guest Name</th>
                  <th>Designation</th>
                  <th>Place</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Subject</th>
                  <th>Time</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lectures.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td style={{ color: "var(--gold)" }}>{item.guestName}</td>
                    <td>{item.designation}</td>
                    <td>{item.placeOfPosting}</td>
                    <td>{item.status}</td>
                    <td>{item.employeeType}</td>
                    <td>{item.subject}</td>
                    <td>
                      {item.startTime} - {item.endTime}
                    </td>
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
    </section>
  );
}
    