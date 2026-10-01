import { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getUserExams, getUserExamById, submitUserExam } from "../utils/api";

const questionTypes = [
  { type: "Fill in the Blank", icon: "✏️", color: "#22c55e" },
  { type: "True / False", icon: "✓", color: "#f59e0b" },
  { type: "MCQ", icon: "◉", color: "#3b82f6" },
  { type: "Written", icon: "✍️", color: "#a855f7" },
];

export default function UserExam() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await getUserExams();
      setExams(data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startExam = async (examId) => {
    try {
      setLoadingExam(true);
      setMessage({ text: "", type: "" });
      const data = await getUserExamById(examId);
      setSelectedExam(data);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoadingExam(false);
    }
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async () => {
    const unanswered = selectedExam.questions.filter(
      (q) => !answers[q._id] || !answers[q._id].toString().trim(),
    );

    if (unanswered.length > 0) {
      if (
        !window.confirm(
          `${unanswered.length} questions unanswered. Submit anyway?`,
        )
      )
        return;
    } else {
      if (!window.confirm("Submit exam? You cannot change answers after this."))
        return;
    }

    try {
      setSubmitting(true);
      setMessage({ text: "", type: "" });

      const answersPayload = selectedExam.questions.map((q) => ({
        questionId: q._id,
        userAnswer: answers[q._id] || "",
      }));

      const data = await submitUserExam(selectedExam._id, answersPayload);
      setResult(data.data);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToExams = () => {
    setSelectedExam(null);
    setAnswers({});
    setResult(null);
    setMessage({ text: "", type: "" });
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  // ---------- helpers ----------
  const isPassed = result && result.status === "Pass";
  const isPending = result && result.status === "pending";

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          {message.text && (
            <div
              className="form-error"
              style={{
                marginBottom: "16px",
                background:
                  message.type === "success"
                    ? "rgba(74,222,128,0.15)"
                    : "rgba(239,68,68,0.15)",
                borderColor: message.type === "success" ? "#4ade80" : "#ef4444",
                color: message.type === "success" ? "#4ade80" : "#ef4444",
              }}
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "var(--gold)",
              }}
            >
              Loading exams...
            </div>
          ) : loadingExam ? (
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "var(--gold)",
              }}
            >
              Loading exam...
            </div>
          ) : !selectedExam ? (
            /* ================= EXAM LIST ================= */
            <div className="users-page">
              <div className="users-header">
                <h2>Available Exams</h2>
                <span
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
                >
                  {exams.length} exam{exams.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="exam-types-info">
                <h3>Question Types</h3>
                <div className="question-types-grid">
                  {questionTypes.map((qt) => (
                    <div key={qt.type} className="qtype-card">
                      <span className="qtype-icon" style={{ color: qt.color }}>
                        {qt.icon}
                      </span>
                      <span className="qtype-label">{qt.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {exams.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No exams available yet.
                </p>
              ) : (
                <div className="exam-list-grid">
                  {exams.map((exam) => (
                    <div key={exam._id} className="exam-list-card">
                      <div className="exam-card-top">
                        <span className="exam-badge">Available</span>
                        <span className="exam-id">{exam.step}</span>
                      </div>
                      <h3 className="exam-title">{exam.title}</h3>
                      <p className="exam-subject">{exam.description}</p>
                      <div className="exam-meta">
                        <span>⏱️ {exam.duration} min</span>
                        <span>📝 {exam.questionCount} Qs</span>
                        <span>🎯 {exam.passPercentage}% Pass</span>
                      </div>
                      <button
                        className="exam-start-btn"
                        onClick={() => startExam(exam._id)}
                      >
                        Start Exam →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !result ? (
            /* ================= EXAM VIEW ================= */
            <div className="users-page">
              <div className="users-header">
                <button
                  className="btn-reset"
                  onClick={handleBackToExams}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  ← Back
                </button>
                <span
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
                >
                  {selectedExam.duration} min • {selectedExam.passPercentage}%
                  Pass
                </span>
              </div>

              <h2
                style={{
                  color: "var(--gold)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "2px",
                  marginTop: "0",
                }}
              >
                {selectedExam.title}
              </h2>
              <p
                style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}
              >
                {selectedExam.courseName} • {selectedExam.questions.length}{" "}
                Questions
              </p>

              <div className="exam-questions-preview">
                {selectedExam.questions.map((q, i) => (
                  <div key={q._id} className="question-preview-card">
                    <div className="q-preview-header">
                      <span className="q-num">Q{i + 1}</span>
                      <span
                        className="q-type-badge"
                        style={{
                          background: `${questionTypes.find((t) => t.type === q.type)?.color || "#888"}22`,
                          color:
                            questionTypes.find((t) => t.type === q.type)
                              ?.color || "#888",
                          border: `1px solid ${questionTypes.find((t) => t.type === q.type)?.color || "#888"}55`,
                        }}
                      >
                        {q.type}
                      </span>
                    </div>

                    <p className="q-text">{q.question}</p>

                    {q.type === "Fill in the Blank" && (
                      <div className="q-fill-blank">
                        <input
                          type="text"
                          placeholder="Type your answer here..."
                          value={answers[q._id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(q._id, e.target.value)
                          }
                        />
                      </div>
                    )}

                    {q.type === "True / False" && (
                      <div className="q-tf">
                        <button
                          type="button"
                          className={`tf-btn ${answers[q._id] === "True" ? "active" : ""}`}
                          onClick={() => handleAnswerChange(q._id, "True")}
                        >
                          ✓ True
                        </button>
                        <button
                          type="button"
                          className={`tf-btn ${answers[q._id] === "False" ? "active" : ""}`}
                          onClick={() => handleAnswerChange(q._id, "False")}
                        >
                          ✗ False
                        </button>
                      </div>
                    )}

                    {q.type === "MCQ" && (
                      <div className="q-tf" style={{ flexWrap: "wrap" }}>
                        {(q.options || []).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`tf-btn ${answers[q._id] === opt ? "active" : ""}`}
                            onClick={() => handleAnswerChange(q._id, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {q.type === "Written" && (
                      <div className="q-fill-blank">
                        <textarea
                          rows="4"
                          placeholder="Type your answer here..."
                          value={answers[q._id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(q._id, e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(168,85,247,0.4)",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
                            fontFamily: "'Outfit', sans-serif",
                            outline: "none",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                  <button
                    className="btn-copy"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ padding: "14px 40px", fontSize: "15px" }}
                  >
                    {submitting ? "Submitting..." : "📤 Submit Exam"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= SUBMITTED ================= */
            <div className="users-page">
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background:
                    "linear-gradient(135deg, rgba(139,0,0,0.15), rgba(212,175,55,0.05))",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "12px",
                  maxWidth: "600px",
                  margin: "40px auto",
                }}
              >
                <div style={{ fontSize: "72px", marginBottom: "16px" }}>✅</div>
                <h2
                  style={{
                    color: "var(--gold)",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "2px",
                    fontSize: "26px",
                    margin: "0 0 12px",
                  }}
                >
                  Exam Submitted Successfully!
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: "0 0 8px",
                  }}
                >
                  Aapka exam successfully submit ho gaya hai.
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    margin: "0 0 30px",
                  }}
                >
                  Result admin review ke baad available hoga.
                </p>

                <button
                  className="btn-copy"
                  onClick={handleBackToExams}
                  style={{ padding: "14px 40px", fontSize: "15px" }}
                >
                  ← Back to Exams
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .exam-types-info {
          margin-bottom: 24px;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 12px;
        }
        .exam-types-info h3 {
          margin: 0 0 16px;
          color: var(--gold);
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .question-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        .qtype-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          transition: all 0.2s;
        }
        .qtype-card:hover {
          border-color: rgba(212,175,55,0.4);
          background: rgba(139,0,0,0.15);
        }
        .qtype-icon { font-size: 20px; }
        .qtype-label { font-weight: 500; }

        .exam-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .exam-list-card {
          padding: 20px;
          background: linear-gradient(135deg, rgba(139,0,0,0.15), rgba(212,175,55,0.04));
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .exam-list-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212,175,55,0.5);
          box-shadow: 0 10px 30px rgba(139,0,0,0.3);
        }
        .exam-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .exam-badge {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 700;
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.3);
        }
        .exam-id {
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          font-family: 'Courier New', monospace;
        }
        .exam-title {
          margin: 0 0 6px;
          color: var(--gold);
          font-size: 16px;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
        }
        .exam-subject {
          margin: 0 0 16px;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
        }
        .exam-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
        .exam-meta span {
          padding: 4px 8px;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
        }
        .exam-start-btn {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, var(--maroon), var(--maroon-light));
          color: var(--gold);
          border: 1px solid rgba(212,175,55,0.35);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1px;
          transition: all 0.3s;
        }
        .exam-start-btn:hover {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold));
          color: var(--dark-bg);
        }

        .exam-questions-preview {
          padding: 20px;
          background: rgba(0,0,0,0.25);
          border-radius: 12px;
          border: 1px solid rgba(212,175,55,0.15);
        }
        .question-preview-card {
          padding: 18px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.12);
          border-left: 3px solid var(--gold);
          border-radius: 8px;
          margin-bottom: 14px;
          transition: all 0.3s;
        }
        .q-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .q-num {
          color: var(--gold);
          font-weight: 700;
          font-size: 14px;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
        }
        .q-type-badge {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: 700;
        }
        .q-text {
          color: rgba(255,255,255,0.9);
          margin: 0 0 14px;
          line-height: 1.6;
          font-size: 14px;
        }

        .q-fill-blank input,
        .q-fill-blank textarea {
          width: 100%;
          max-width: 400px;
          padding: 12px 14px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(34,197,94,0.4);
          border-radius: 6px;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .q-fill-blank textarea { max-width: 100%; resize: vertical; }
        .q-fill-blank input:focus,
        .q-fill-blank textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
        }
        .q-fill-blank input::placeholder,
        .q-fill-blank textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .q-tf { display: flex; gap: 12px; flex-wrap: wrap; }
        .tf-btn {
          padding: 10px 24px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(245,158,11,0.3);
          color: rgba(255,255,255,0.6);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .tf-btn:hover {
          border-color: rgba(245,158,11,0.6);
          color: rgba(245,158,11,0.9);
        }
        .tf-btn.active {
          background: rgba(245,158,11,0.2);
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .result-summary {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, rgba(139,0,0,0.15), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .result-icon { font-size: 60px; margin-bottom: 12px; }
        .result-summary h3 {
          color: var(--gold);
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 2px;
          font-size: 22px;
          margin: 0 0 20px;
        }
        .result-score {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 6px;
          margin: 16px 0;
        }
        .score-value {
          font-size: 64px;
          font-weight: 800;
          color: var(--gold);
          font-family: 'Rajdhani', sans-serif;
          line-height: 1;
        }
        .score-divider { font-size: 40px; color: rgba(255,255,255,0.3); }
        .score-total {
          font-size: 40px;
          color: rgba(255,255,255,0.5);
          font-family: 'Rajdhani', sans-serif;
        }
        .score-percent {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
