import { useState, useEffect } from "react";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  getAllCourses,
} from "../utils/api";

export default function ManageSubject() {
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coursesData, subjectsData] = await Promise.all([
        getAllCourses(),
        getAllSubjects(),
      ]);
      setCourses(coursesData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !courseId) {
      setMessage("❌ Subject name and course required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateSubject(editingId, name.trim(), courseId);
        setMessage("✅ Subject updated successfully.");
      } else {
        await createSubject(name.trim(), courseId);
        setMessage("✅ Subject saved successfully.");
      }
      setName("");
      setCourseId("");
      setEditingId(null);
      loadSubjects();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject) => {
    setName(subject.name);
    setCourseId(subject.courseId?._id || subject.courseId);
    setEditingId(subject._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setName("");
    setCourseId("");
    setEditingId(null);
    setMessage("");
  };

  const handleDelete = async (id, subjectName) => {
    if (!window.confirm(`Delete subject "${subjectName}"?`)) return;
    try {
      await deleteSubject(id);
      loadSubjects();
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

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Educational Management</p>
          <h2>{editingId ? "Edit Subject" : "Manage Subject"}</h2>
          <p>Add subjects that can be used when creating study material.</p>
        </div>
        <span className="record-count">
          {subjects.length} {subjects.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Form */}
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="subject-course">Select Course</label>
          <select
            id="subject-course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <label htmlFor="subject-name">Subject Name</label>
          <input
            id="subject-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name"
            required
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Subject"
                  : "Save Subject"}
            </button>
            {editingId && (
              <button
                type="button"
                className="table-action"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>

      {/* Table */}
      <div className="education-panel" style={{ marginTop: "24px" }}>
        <div className="panel-heading">
          <h3>All Subjects</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : subjects.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No subjects yet. Add your first subject above.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={subject._id}>
                    <td>{index + 1}</td>
                    <td>{subject.courseId?.name || "-"}</td>
                    <td>{subject.name}</td>
                    <td>{formatDate(subject.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(subject)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(subject._id, subject.name)}
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
