import { useState, useEffect } from "react";
import {
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
  getAllCourses,
  getAllSubjects,
} from "../utils/api";

export default function ManageLessons() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    courseId: "",
    subjectId: "",
  });
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coursesData, subjectsData, lessonsData] = await Promise.all([
        getAllCourses(),
        getAllSubjects(),
        getAllLessons(),
      ]);
      setCourses(coursesData);
      setSubjects(subjectsData);
      setLessons(lessonsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      const data = await getAllLessons();
      setLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseChange = (courseId) => {
    setForm({ ...form, courseId, subjectId: "" });
    const filtered = subjects.filter(
      (s) => (s.courseId?._id || s.courseId) === courseId,
    );
    setFilteredSubjects(filtered);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.content.trim() ||
      !form.courseId ||
      !form.subjectId
    ) {
      setMessage("❌ All fields are required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await updateLesson(editingId, form);
        setMessage("✅ Lesson updated successfully.");
      } else {
        await createLesson(
          form.title.trim(),
          form.content,
          form.courseId,
          form.subjectId,
        );
        setMessage("✅ Lesson saved successfully.");
      }
      resetForm();
      loadLessons();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lesson) => {
    const cid = lesson.courseId?._id || lesson.courseId;
    const sid = lesson.subjectId?._id || lesson.subjectId;

    setForm({
      title: lesson.title || "",
      content: lesson.content || "",
      courseId: cid,
      subjectId: sid,
    });
    setFilteredSubjects(
      subjects.filter((s) => (s.courseId?._id || s.courseId) === cid),
    );
    setEditingId(lesson._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ title: "", content: "", courseId: "", subjectId: "" });
    setFilteredSubjects([]);
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      await deleteLesson(id);
      loadLessons();
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
          <h2>{editingId ? "Edit Lesson" : "Manage Lessons"}</h2>
          <p>Add study material for courses and subjects.</p>
        </div>
      </div>

      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="lesson-course">Select Course</label>
          <select
            id="lesson-course"
            value={form.courseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <label htmlFor="lesson-subject">Select Subject</label>
          <select
            id="lesson-subject"
            name="subjectId"
            value={form.subjectId}
            onChange={handleChange}
            disabled={!form.courseId}
            required
          >
            <option value="">-- Select Subject --</option>
            {filteredSubjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <label htmlFor="lesson-title">Content Title</label>
          <input
            id="lesson-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter content title"
            required
          />

          <label htmlFor="lesson-content">Content Description</label>
          <textarea
            id="lesson-content"
            name="content"
            rows="7"
            value={form.content}
            onChange={handleChange}
            placeholder="Write study material or paste a resource link"
            required
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Lesson"
                  : "Save Lesson"}
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

      <div className="education-panel" style={{ marginTop: "24px" }}>
        <div className="panel-heading">
          <h3>All Lessons</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : lessons.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No lessons yet.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Content Title</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson._id}>
                    <td>{index + 1}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.subjectId?.name || "-"}</td>
                    <td>{formatDate(lesson.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(lesson)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(lesson._id, lesson.title)}
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
