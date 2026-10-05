import { useState, useEffect } from "react";
import {
  createExam,
  getAdminExams,
  getAdminExamById,
  updateExam,
  deleteExam,
  attachQuestionsToExam,
  getAllCourses,
  getAllSubjects,
  getAllQuestions,
} from "../utils/api";

export default function ManageExam() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    subjectId: "",
    duration: 30,
    passPercentage: 50,
  });
  const [courses, setCourses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Attach Modal state
  const [attachExam, setAttachExam] = useState(null); // exam object
  const [attachQuestions, setAttachQuestions] = useState([]); // questions for that subject
  const [selectedQIds, setSelectedQIds] = useState([]);
  const [loadingAttach, setLoadingAttach] = useState(false);
  const [attachMessage, setAttachMessage] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coursesData, subjectsData, examsData] = await Promise.all([
        getAllCourses(),
        getAllSubjects(),
        getAdminExams(),
      ]);
      setCourses(coursesData);
      setAllSubjects(subjectsData);
      setExams(examsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    try {
      const data = await getAdminExams();
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== FORM HANDLERS ====================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (courseId) => {
    setForm({ ...form, courseId, subjectId: "" });
    setFilteredSubjects(
      allSubjects.filter((s) => (s.courseId?._id || s.courseId) === courseId),
    );
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      courseId: "",
      subjectId: "",
      duration: 30,
      passPercentage: 50,
    });
    setFilteredSubjects([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.courseId || !form.subjectId) {
      setMessage("❌ Title, Course and Subject are required");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      courseId: form.courseId,
      subjectId: form.subjectId,
      duration: Number(form.duration) || 30,
      passPercentage: Number(form.passPercentage) || 50,
    };

    try {
      if (editingId) {
        await updateExam(editingId, payload);
        setMessage("✅ Exam updated successfully.");
      } else {
        await createExam(payload);
        setMessage("✅ Exam created successfully.");
      }
      resetForm();
      loadExams();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (exam) => {
    const cid = exam.courseId?._id || exam.courseId;
    const sid = exam.subjectId?._id || exam.subjectId;

    setForm({
      title: exam.title || "",
      description: exam.description || "",
      courseId: cid || "",
      subjectId: sid || "",
      duration: exam.duration || 30,
      passPercentage: exam.passPercentage || 50,
    });
    setFilteredSubjects(
      allSubjects.filter((s) => (s.courseId?._id || s.courseId) === cid),
    );
    setEditingId(exam._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      loadExams();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ==================== ATTACH MODAL ====================

  const openAttachModal = async (exam) => {
    try {
      setLoadingAttach(true);
      setAttachMessage("");
      setAttachExam(exam);

      // Fresh exam data lo
      const fullExam = await getAdminExamById(exam._id);

      // Already attached question IDs
      const alreadyAttached = (fullExam.questionIds || []).map((q) =>
        typeof q === "string" ? q : q._id,
      );
      setSelectedQIds(alreadyAttached);

      // Us exam ke subject ke questions lo
      const subjectId = fullExam.subjectId?._id || fullExam.subjectId;
      const courseId = fullExam.courseId?._id || fullExam.courseId;

      const qs = await getAllQuestions({ courseId, subjectId });
      setAttachQuestions(qs);
    } catch (err) {
      setAttachMessage("❌ " + err.message);
    } finally {
      setLoadingAttach(false);
    }
  };

  const closeAttachModal = () => {
    setAttachExam(null);
    setAttachQuestions([]);
    setSelectedQIds([]);
    setAttachMessage("");
  };

  const toggleQuestion = (qId) => {
    if (selectedQIds.includes(qId)) {
      setSelectedQIds(selectedQIds.filter((id) => id !== qId));
    } else {
      setSelectedQIds([...selectedQIds, qId]);
    }
  };

  const handleSaveAttach = async () => {
    if (selectedQIds.length === 0) {
      setAttachMessage("❌ Select at least 1 question");
      return;
    }

    try {
      setLoadingAttach(true);
      setAttachMessage("");
      await attachQuestionsToExam(attachExam._id, selectedQIds);
      setAttachMessage("✅ Questions attached successfully!");
      setTimeout(() => {
        closeAttachModal();
        loadExams();
      }, 1200);
    } catch (err) {
      setAttachMessage("❌ " + err.message);
    } finally {
      setLoadingAttach(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Exam Management</p>
          <h2>{editingId ? "Edit Exam" : "Create Exam"}</h2>
          <p>Create exams and attach questions from same subject.</p>
        </div>
      </div>

      {/* ============ FORM ============ */}
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label>Exam Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., STEP 01 — Origin and Concept"
            required
          />

          <label>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g., Direct Selling Basics"
          />

          <label>Select Course</label>
          <select
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

          <label>Select Subject</label>
          <select
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

          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            min="1"
            placeholder="30"
          />

          <label>Pass Percentage (%)</label>
          <input
            type="number"
            name="passPercentage"
            value={form.passPercentage}
            onChange={handleChange}
            min="1"
            max="100"
            placeholder="50"
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Exam" : "Create Exam"}
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

      {/* ============ TABLE ============ */}
      <div className="education-panel" style={{ marginTop: "20px" }}>
        <div className="panel-heading">
          <h3>All Exams ({exams.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : exams.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No exams found.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Duration</th>
                  <th>Questions</th>
                  <th>Pass %</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e, index) => (
                  <tr key={e._id}>
                    <td>{index + 1}</td>
                    <td style={{ maxWidth: "220px", color: "var(--gold)" }}>
                      {e.title}
                    </td>
                    <td>{e.courseId?.name || "-"}</td>
                    <td>{e.subjectId?.name || "-"}</td>
                    <td>{e.duration} min</td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "rgba(74,222,128,0.15)",
                          color: "#4ade80",
                          border: "1px solid rgba(74,222,128,0.4)",
                        }}
                      >
                        {e.questionCount || e.questionIds?.length || 0} Qs
                      </span>
                    </td>
                    <td>{e.passPercentage}%</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => openAttachModal(e)}
                      >
                        Attach
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(e)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(e._id)}
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

      {/* ============ ATTACH MODAL ============ */}
      {attachExam && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "40px 20px",
            overflowY: "auto",
          }}
          onClick={closeAttachModal}
        >
          <div
            style={{
              background: "var(--dark-bg)",
              border: "1px solid rgba(212,175,55,0.4)",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: "var(--gold)",
                    margin: 0,
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  Attach Questions
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                  }}
                >
                  {attachExam.title}
                </p>
              </div>
              <button
                onClick={closeAttachModal}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "var(--gold)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Subject info bar */}
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(139,0,0,0.15)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: "10px",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "11px",
                  letterSpacing: "1px",
                }}
              >
                SUBJECT (LOCKED)
              </p>
              <p style={{ margin: 0, color: "var(--gold)", fontWeight: 600 }}>
                {attachExam.subjectId?.name}
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                ⚠️ Sirf isi subject ke questions attach ho sakte hain
              </p>
            </div>

            {loadingAttach ? (
              <p
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--gold)",
                }}
              >
                Loading questions...
              </p>
            ) : attachQuestions.length === 0 ? (
              <p
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Is subject me koi question nahi mila. Pehle Manage Question se
                banao.
              </p>
            ) : (
              <>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "12px",
                    marginBottom: "12px",
                  }}
                >
                  {selectedQIds.length} selected • {attachQuestions.length}{" "}
                  total
                </p>

                {attachQuestions.map((q) => {
                  const checked = selectedQIds.includes(q._id);
                  return (
                    <label
                      key={q._id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        padding: "12px 14px",
                        background: checked
                          ? "rgba(74,222,128,0.08)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          checked
                            ? "rgba(74,222,128,0.4)"
                            : "rgba(212,175,55,0.15)"
                        }`,
                        borderRadius: "8px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleQuestion(q._id)}
                        style={{ marginTop: "3px", accentColor: "#4ade80" }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: "0 0 6px",
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "13.5px",
                            lineHeight: 1.5,
                          }}
                        >
                          {q.question}
                        </p>
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "rgba(60,141,188,0.15)",
                            color: "#60a5fa",
                            border: "1px solid rgba(60,141,188,0.4)",
                          }}
                        >
                          {q.type}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </>
            )}

            {attachMessage && (
              <p
                style={{
                  marginTop: "16px",
                  color: attachMessage.includes("✅") ? "#4ade80" : "#ef4444",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                {attachMessage}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="table-action"
                onClick={closeAttachModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary"
                onClick={handleSaveAttach}
                disabled={loadingAttach}
                style={{ padding: "10px 24px" }}
              >
                {loadingAttach
                  ? "Saving..."
                  : `Attach ${selectedQIds.length} Question${selectedQIds.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
