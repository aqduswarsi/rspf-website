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
    pdfUrl: "",
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

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Max 5MB PDF allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, pdfUrl: reader.result }));
      setMessage("");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePdf = () => {
    setForm((prev) => ({ ...prev, pdfUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.courseId || !form.subjectId) {
      setMessage("Course and Subject are required");
      return;
    }

    if (!form.title.trim() && !form.content.trim() && !form.pdfUrl) {
      setMessage("At least one of Title, Description, or PDF is required");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      pdfUrl: form.pdfUrl || "",
      courseId: form.courseId,
      subjectId: form.subjectId,
    };

    try {
      if (editingId) {
        await updateLesson(editingId, payload);
        setMessage("Lesson updated successfully.");
      } else {
        await createLesson(payload);
        setMessage("Lesson saved successfully.");
      }
      resetForm();
      loadLessons();
    } catch (err) {
      setMessage(err.message);
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
      pdfUrl: lesson.pdfUrl || "",
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
    setForm({
      title: "",
      content: "",
      pdfUrl: "",
      courseId: "",
      subjectId: "",
    });
    setFilteredSubjects([]);
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title || "untitled"}"?`)) return;
    try {
      await deleteLesson(id);
      loadLessons();
    } catch (err) {
      alert(err.message);
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

          <label htmlFor="lesson-title">Content Title (optional)</label>
          <input
            id="lesson-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter content title"
          />

          <label htmlFor="lesson-content">
            Content Description or Link (optional)
          </label>
          <textarea
            id="lesson-content"
            name="content"
            rows="7"
            value={form.content}
            onChange={handleChange}
            placeholder="Write study material or paste a resource link"
          />

          <label>PDF File (optional — Max 5MB)</label>
          {form.pdfUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                background: "#f0f8f1",
                border: "1px solid #a7ddb2",
                borderRadius: "8px",
              }}
            >
              <span
                style={{ color: "#15803d", fontSize: "13px", fontWeight: 600 }}
              >
                PDF uploaded successfully
              </span>
              <button
                type="button"
                onClick={handleRemovePdf}
                style={{
                  padding: "6px 14px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Remove PDF
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{
                padding: "10px",
                background: "#FFFFFF",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                width: "100%",
                fontSize: "13px",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            />
          )}

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
            <p style={{ padding: "20px", color: "var(--muted)" }}>
              No lessons yet.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Content Title</th>
                  <th>Subject</th>
                  <th>PDF</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson._id}>
                    <td>{index + 1}</td>
                    <td>{lesson.title || "-"}</td>
                    <td>{lesson.subjectId?.name || "-"}</td>
                    <td>
                      {lesson.pdfUrl ? (
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            background: "#f0f8f1",
                            color: "#15803d",
                            border: "1px solid #a7ddb2",
                            fontWeight: 600,
                          }}
                        >
                          Uploaded
                        </span>
                      ) : (
                        <span
                          style={{ color: "var(--muted)", fontSize: "12px" }}
                        >
                          -
                        </span>
                      )}
                    </td>
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
