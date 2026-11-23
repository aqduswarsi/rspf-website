import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  getAllCourses,
  getAllSubjects,
  translateText,
} from "../utils/api";

const QUESTION_TYPES = ["MCQ", "Fill in the Blank", "True / False", "Written"];

export default function ManageQuestion() {
  const [form, setForm] = useState({
    question: "",
    questionHindi: "",
    type: "MCQ",
    options: ["", "", "", ""],
    optionsHindi: ["", "", "", ""],
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
  const [translating, setTranslating] = useState(false);
  const [translatingOptions, setTranslatingOptions] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);

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

  const handleOptionHindiChange = (index, value) => {
    const newOptions = [...form.optionsHindi];
    newOptions[index] = value;
    setForm({ ...form, optionsHindi: newOptions });
  };

  const handleTranslateQuestion = async () => {
    if (!form.question.trim()) {
      setMessage("English question is required to translate");
      return;
    }
    try {
      setTranslating(true);
      setMessage("");
      const hindi = await translateText(form.question);
      setForm((prev) => ({ ...prev, questionHindi: hindi }));
      setMessage("Question translated to Hindi");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleTranslateOptions = async () => {
    const validOptions = form.options.filter((o) => o.trim());
    if (validOptions.length < 2) {
      setMessage("Fill at least 2 English options first");
      return;
    }
    try {
      setTranslatingOptions(true);
      setMessage("");
      const translated = await Promise.all(
        form.options.map(async (opt) => {
          if (!opt.trim()) return "";
          return await translateText(opt);
        }),
      );
      setForm((prev) => ({ ...prev, optionsHindi: translated }));
      setMessage("Options translated to Hindi");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setTranslatingOptions(false);
    }
  };

  const resetForm = () => {
    setForm({
      question: "",
      questionHindi: "",
      type: "MCQ",
      options: ["", "", "", ""],
      optionsHindi: ["", "", "", ""],
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
      questionHindi: form.questionHindi.trim(),
      type: form.type,
      options: form.type === "MCQ" ? form.options.filter((o) => o.trim()) : [],
      optionsHindi:
        form.type === "MCQ" ? form.optionsHindi.filter((o) => o.trim()) : [],
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
      questionHindi: q.questionHindi || "",
      type: q.type || "MCQ",
      options:
        q.type === "MCQ" && q.options?.length
          ? [...q.options, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
      optionsHindi:
        q.type === "MCQ" && q.optionsHindi?.length
          ? [...q.optionsHindi, "", "", "", ""].slice(0, 4)
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

  const handleQuestionExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkFileName(file.name);
    setBulkRows([]);
    setMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!data.length) {
          setMessage("Excel file is empty");
          return;
        }

        const rows = data.map((row, index) => {
          const headers = Object.keys(row).reduce((result, key) => {
            result[key.toLowerCase().replace(/[^a-z0-9]/g, "")] = key;
            return result;
          }, {});
          const get = (...names) => {
            const key = names
              .map((name) =>
                headers[
                  name.toLowerCase().replace(/[^a-z0-9]/g, "")
                ],
              )
              .find(Boolean);
            return key ? String(row[key] ?? "").trim() : "";
          };

          const courseValue = get("course", "coursename", "courseid");
          const subjectValue = get("subject", "subjectname", "subjectid");
          const course = courses.find(
            (item) =>
              item._id === courseValue ||
              item.name?.toLowerCase() === courseValue.toLowerCase(),
          );
          const subject = subjects.find(
            (item) =>
              item._id === subjectValue ||
              item.name?.toLowerCase() === subjectValue.toLowerCase(),
          );

          const typeValue = get("type", "questiontype");
          let type = "MCQ";
          if (/true|false/i.test(typeValue)) type = "True / False";
          else if (/fill/i.test(typeValue)) type = "Fill in the Blank";
          else if (/written/i.test(typeValue)) type = "Written";

          const options = [
            get("optiona", "option1", "a"),
            get("optionb", "option2", "b"),
            get("optionc", "option3", "c"),
            get("optiond", "option4", "d"),
          ].filter(Boolean);
          const optionsHindi = [
            get("optionahindi", "optionhindia"),
            get("optionbhindi", "optionhindib"),
            get("optionchindi", "optionhindic"),
            get("optiondhindi", "optionhindid"),
          ];

          let correctAnswer = get("correctanswer", "answer");
          if (type === "True / False") {
            correctAnswer = /^t|true/i.test(correctAnswer) ? "True" : "False";
          } else if (type === "MCQ") {
            const letterMatch = correctAnswer.match(/^[abcd]$/i);
            if (letterMatch) {
              correctAnswer = letterMatch[0].toUpperCase();
            } else {
              const optionIndex = options.findIndex(
                (option) =>
                  option.toLowerCase() === correctAnswer.toLowerCase(),
              );
              correctAnswer =
                optionIndex >= 0
                  ? String.fromCharCode(65 + optionIndex)
                  : "";
            }
          }

          const errors = [];
          if (!get("question", "questionenglish")) errors.push("Question required");
          if (!course) errors.push("Course not found");
          if (!subject) errors.push("Subject not found");
          if (type === "MCQ" && options.length < 2) errors.push("At least 2 options required");
          if (type === "MCQ" && !correctAnswer) errors.push("Valid correct answer required");
          if (type === "Fill in the Blank" && !correctAnswer) errors.push("Correct answer required");

          return {
            _rowNumber: index + 2,
            question: get("question", "questionenglish"),
            questionHindi: get("questionhindi"),
            type,
            options,
            optionsHindi: optionsHindi.length ? optionsHindi : ["", "", "", ""],
            correctAnswer,
            courseId: course?._id || "",
            subjectId: subject?._id || "",
            courseName: course?.name || courseValue,
            subjectName: subject?.name || subjectValue,
            _error: errors.join(", "),
          };
        });

        setBulkRows(rows);
        setMessage(`${rows.length} question rows detected. Verify and import.`);
      } catch (err) {
        setMessage(`Failed to read Excel: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadQuestionTemplate = () => {
    const sample = [
      {
        Course: courses[0]?.name || "Course Name",
        Subject: subjects[0]?.name || "Subject Name",
        Question: "What is the full form of RPSF?",
        QuestionHindi: "RPSF का पूर्ण रूप क्या है?",
        Type: "MCQ",
        OptionA: "Railway Protection Special Force",
        OptionB: "Rapid Police Security Force",
        OptionC: "Reserve Police Special Force",
        OptionD: "Regional Protection Security Force",
        CorrectAnswer: "A",
        OptionAHindi: "",
        OptionBHindi: "",
        OptionCHindi: "",
        OptionDHindi: "",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sample);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
    XLSX.writeFile(workbook, "questions-import-template.xlsx");
  };

  const handleBulkQuestionImport = async () => {
    const validRows = bulkRows.filter((row) => !row._error);
    if (!validRows.length) {
      setMessage("No valid questions to import");
      return;
    }

    setBulkSaving(true);
    setMessage("");
    let successCount = 0;
    const failed = [];

    for (const row of validRows) {
      try {
        await createQuestion({
          question: row.question,
          questionHindi: row.questionHindi,
          type: row.type,
          options: row.type === "MCQ" ? row.options : [],
          optionsHindi:
            row.type === "MCQ"
              ? row.optionsHindi.slice(0, row.options.length)
              : [],
          correctAnswer:
            row.type === "Written" ? "" : row.correctAnswer,
          courseId: row.courseId,
          subjectId: row.subjectId,
        });
        successCount += 1;
      } catch (err) {
        failed.push(`Row ${row._rowNumber}: ${err.message}`);
      }
    }

    setBulkSaving(false);
    setBulkRows([]);
    setBulkFileName("");
    setShowBulkUpload(false);
    loadQuestions();
    setMessage(
      failed.length
        ? `✅ ${successCount} imported, ❌ ${failed.length} failed.`
        : `✅ ${successCount} questions imported successfully.`,
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
        <button
          type="button"
          className="table-action"
          onClick={() => setShowBulkUpload((current) => !current)}
        >
          {showBulkUpload ? "Close Excel Upload" : "Upload Excel Questions"}
        </button>
      </div>

      {showBulkUpload && (
        <div className="education-panel" style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: 0 }}>Bulk Upload Questions</h3>
            <button
              type="button"
              className="table-action"
              onClick={downloadQuestionTemplate}
            >
              Download Excel Template
            </button>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleQuestionExcelUpload}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          />
          {bulkFileName && (
            <p style={{ fontSize: "13px", fontWeight: 700 }}>
              {bulkFileName} — {bulkRows.length} rows detected
            </p>
          )}
          {bulkRows.length > 0 && (
            <>
              <div className="education-table-wrap" style={{ marginBottom: "12px" }}>
                <table className="education-table">
                  <thead>
                    <tr>
                      <th>Excel Row</th>
                      <th>Course</th>
                      <th>Subject</th>
                      <th>Question</th>
                      <th>Type</th>
                      <th>Correct Answer</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row) => (
                      <tr key={row._rowNumber}>
                        <td>{row._rowNumber}</td>
                        <td>{row.courseName || "-"}</td>
                        <td>{row.subjectName || "-"}</td>
                        <td>{row.question || "-"}</td>
                        <td>{row.type}</td>
                        <td>{row.correctAnswer || "-"}</td>
                        <td style={{ color: row._error ? "#b91c1c" : "#15803d" }}>
                          {row._error || "Ready"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="primary"
                disabled={bulkSaving}
                onClick={handleBulkQuestionImport}
              >
                {bulkSaving
                  ? "Importing..."
                  : `Import ${bulkRows.filter((row) => !row._error).length} Valid Questions`}
              </button>
            </>
          )}
        </div>
      )}

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

          <label>Enter Your Question (English)</label>
          <textarea
            name="question"
            rows="3"
            value={form.question}
            onChange={handleChange}
            placeholder="Enter question in English"
            required
          />
          <div style={{ marginTop: "6px", marginBottom: "8px" }}>
            <button
              type="button"
              onClick={handleTranslateQuestion}
              disabled={translating || !form.question.trim()}
              style={{
                padding: "6px 14px",
                background: "#FFF7ED",
                color: "#C2410C",
                border: "1px solid #FDBA74",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: translating ? "wait" : "pointer",
              }}
            >
              {translating ? "Translating..." : "Auto-Translate to Hindi"}
            </button>
          </div>

          <label>Enter Your Question (Hindi)</label>
          <textarea
            name="questionHindi"
            rows="3"
            value={form.questionHindi}
            onChange={handleChange}
            placeholder="Enter the question in Hindi (optional)"
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label style={{ margin: 0 }}>
                  Options (Select correct one)
                </label>
                <button
                  type="button"
                  onClick={handleTranslateOptions}
                  disabled={translatingOptions}
                  style={{
                    padding: "6px 14px",
                    background: "#FFF7ED",
                    color: "#C2410C",
                    border: "1px solid #FDBA74",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: translatingOptions ? "wait" : "pointer",
                  }}
                >
                  {translatingOptions ? "Translating..." : "Translate Options"}
                </button>
              </div>
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
                    placeholder={`Option ${String.fromCharCode(65 + idx)} (English)`}
                  />
                  <input
                    value={form.optionsHindi[idx] || ""}
                    onChange={(e) =>
                      handleOptionHindiChange(idx, e.target.value)
                    }
                    placeholder={`Option ${String.fromCharCode(65 + idx)} (Hindi)`}
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
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
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
            <p style={{ padding: "20px", color: "var(--muted)" }}>
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
                    <td style={{ maxWidth: "400px" }}>
                      <div>{q.question}</div>
                      {q.questionHindi && (
                        <div
                          style={{
                            color: "var(--muted)",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {q.questionHindi}
                        </div>
                      )}
                    </td>
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
