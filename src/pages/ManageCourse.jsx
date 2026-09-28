import { useState, useEffect } from "react";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../utils/api";

export default function ManageCourse() {
  const [name, setName] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateCourse(editingId, name.trim());
        setMessage("✅ Course updated successfully.");
      } else {
        await createCourse(name.trim());
        setMessage("✅ Course saved successfully.");
      }
      setName("");
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setName(course.name);
    setEditingId(course._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setName("");
    setEditingId(null);
    setMessage("");
  };

  const handleDelete = async (id, courseName) => {
    if (!window.confirm(`Delete course "${courseName}"?`)) return;
    try {
      await deleteCourse(id);
      loadCourses();
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
          <h2>{editingId ? "Edit Course" : "Manage Course"}</h2>
          <p>Create and maintain the courses available to learners.</p>
        </div>
        <span className="record-count">
          {courses.length} {courses.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Form */}
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="course-name">Course Name</label>
          <input
            id="course-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
            required
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Course"
                  : "Save Course"}
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
          <h3>All Courses</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : courses.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No courses yet. Add your first course above.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course._id}>
                    <td>{index + 1}</td>
                    <td>{course.name}</td>
                    <td>{formatDate(course.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(course._id, course.name)}
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
