import { useState, useEffect } from "react";
import {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  getAllCourses,
  getAllSubjects,
} from "../utils/api";

const QUESTION_TYPES = ["MCQ", "Fill in the Blank", "True / False", "Written"];

export default function ManageQuestion() {
  const [form, setForm] = useState({
    question: "",
    type: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    courseId: "",
    subjectId: "",
  });
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Filters
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSubjects, setFilterSubjects] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [coursesData, subjectsData, questionsData] = await Promise.all([
        getAllCourses(),
        getAllSubjects(),
        getAllQuestions(),
      ]);
      setCourses(coursesData);
      setSubjects(subjectsData);
      setQuestions(questionsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      const filters = {};
      if (filterCourseId) filters.courseId = filterCourseId;
      if (filterSubjectId) filters.subjectId = filterSubjectId;
      if (filterType) filters.type = filterType;
      const data = await getAllQuestions(filters);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading) loadQuestions();
  }, [filterCourseId, filterSubjectId, filterType]);

  // Form course change
  const handleCourseChange = (courseId) => {
    setForm({ ...form, courseId, subjectId: "" });
    setFilteredSubjects(
      subjects.filter((s) => (s.courseId?._id || s.courseId) === courseId),
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const resetForm = () => {
    setForm({
      question: "",
      type: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      courseId: "",
      subjectId: "",
    });
    setFilteredSubjects([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.courseId || !form.subjectId) {
      setMessage("❌ Question, Course and Subject are required");
      return;
    }

    if (form.type === "MCQ") {
      const validOptions = form.options.filter((o) => o.trim());
      if (validOptions.length < 2) {
        setMessage("❌ MCQ requires at least 2 options");
        return;
      }
      if (!form.correctAnswer) {
        setMessage("❌ Please select correct answer");
        return;
      }
    } else if (form.type === "Fill in the Blank") {
      if (!form.correctAnswer.trim()) {
        setMessage("❌ Correct answer is required");
        return;
      }
    } else if (form.type === "True / False") {
      if (!form.correctAnswer) {
        setMessage("❌ Select True or False");
        return;
      }
    }

    setSaving(true);
    setMessage("");

    const payload = {
      question: form.question.trim(),
      type: form.type,
      options: form.type === "MCQ" ? form.options.filter((o) => o.trim()) : [],
      correctAnswer:
        form.type === "Written"
          ? ""
          : form.type === "Fill in the Blank"
            ? form.correctAnswer.trim()
            : form.correctAnswer,
      courseId: form.courseId,
      subjectId: form.subjectId,
    };

    try {
      if (editingId) {
        await updateQuestion(editingId, payload);
        setMessage("✅ Question updated successfully.");
      } else {
        await createQuestion(payload);
        setMessage("✅ Question saved successfully.");
      }
      resetForm();
      loadQuestions();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q) => {
    const cid = q.courseId?._id || q.courseId;
    const sid = q.subjectId?._id || q.subjectId;

    setForm({
      question: q.question || "",
      type: q.type || "MCQ",
      options:
        q.type === "MCQ" && q.options?.length
          ? [...q.options, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
      correctAnswer: q.correctAnswer || "",
      courseId: cid,
      subjectId: sid,
    });
    setFilteredSubjects(
      subjects.filter((s) => (s.courseId?._id || s.courseId) === cid),
    );
    setEditingId(q._id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteQuestion(id);
      loadQuestions();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // Filter handlers
  const handleFilterCourseChange = (cid) => {
    setFilterCourseId(cid);
    setFilterSubjectId("");
    setFilterSubjects(
      subjects.filter((s) => (s.courseId?._id || s.courseId) === cid),
    );
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
          <p className="eyebrow">Exam Management</p>
          <h2>{editingId ? "Edit Question" : "Add Question"}</h2>
          <p>Create exam questions for courses and subjects.</p>
        </div>
      </div>

      {/* Form */}
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
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

          <label>Enter Your Question</label>
          <textarea
            name="question"
            rows="3"
            value={form.question}
            onChange={handleChange}
            placeholder="Enter question"
            required
          />

          <label>Question Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            {QUESTION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          {/* MCQ Options */}
          {form.type === "MCQ" && (
            <>
              <label>Options (Select correct one)</label>
              {form.options.map((opt, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={String.fromCharCode(65 + idx)}
                    checked={
                      form.correctAnswer === String.fromCharCode(65 + idx)
                    }
                    onChange={handleChange}
                    style={{ width: "auto", margin: 0 }}
                  />
                  <input
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  />
                </div>
              ))}
            </>
          )}

          {/* Fill in the Blank */}
          {form.type === "Fill in the Blank" && (
            <>
              <label>Correct Answer</label>
              <input
                name="correctAnswer"
                value={form.correctAnswer}
                onChange={handleChange}
                placeholder="Enter correct answer"
                required
              />
            </>
          )}

          {/* True / False */}
          {form.type === "True / False" && (
            <>
              <label>Correct Answer</label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value="True"
                    checked={form.correctAnswer === "True"}
                    onChange={handleChange}
                    style={{ width: "auto", margin: 0 }}
                  />
                  True
                </label>
                <label
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value="False"
                    checked={form.correctAnswer === "False"}
                    onChange={handleChange}
                    style={{ width: "auto", margin: 0 }}
                  />
                  False
                </label>
              </div>
            </>
          )}

          {form.type === "Written" && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              ℹ️ Written questions will be manually reviewed by admin.
            </p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Question"
                  : "Save Question"}
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

      {/* Filters */}
      <div
        className="education-panel"
        style={{ marginTop: "24px", padding: "16px 20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Filter By Course
            </label>
            <select
              value={filterCourseId}
              onChange={(e) => handleFilterCourseChange(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Filter By Subject
            </label>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              disabled={!filterCourseId}
            >
              <option value="">All Subjects</option>
              {filterSubjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Filter By Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {QUESTION_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="education-panel" style={{ marginTop: "20px" }}>
        <div className="panel-heading">
          <h3>All Questions ({questions.length})</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : questions.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No questions found.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <tr key={q._id}>
                    <td>{index + 1}</td>
                    <td>{q.courseId?.name || "-"}</td>
                    <td>{q.subjectId?.name || "-"}</td>
                    <td style={{ maxWidth: "400px" }}>{q.question}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "rgba(60,141,188,0.15)",
                          color: "#60a5fa",
                          border: "1px solid rgba(60,141,188,0.4)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.type}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(q._id)}
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
