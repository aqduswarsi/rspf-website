import { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

const exams = [
  {
    id: 1,
    title: "STEP 01 — Origin and Concept",
    subject: "Direct Selling Basics",
    duration: "30 minutes",
    totalQuestions: 5,
    passingMarks: 50,
    questions: [
      {
        id: 1,
        type: "Fill in the Blank",
        question: "Direct selling mein product ______ ko becha jata hai.",
        answer: "customer",
      },
      {
        id: 2,
        type: "True/False",
        question: "Direct selling mein middleman hota hai.",
        answer: "False",
      },
      {
        id: 3,
        type: "Fill in the Blank",
        question: "Direct selling mein ______ aur customer direct milte hain.",
        answer: "seller",
      },
      {
        id: 4,
        type: "True/False",
        question: "Direct selling mein product ka price fixed hota hai.",
        answer: "True",
      },
      {
        id: 5,
        type: "Fill in the Blank",
        question: "Direct selling ka doosra naam ______ selling hai.",
        answer: "network",
      },
    ],
    status: "available",
  },
];

const questionTypes = [
  { type: "Fill in the Blank", icon: "✏️", color: "#22c55e" },
  { type: "True/False", icon: "✓", color: "#f59e0b" },
];

export default function UserExam() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const startExam = (exam) => {
    setSelectedExam(exam);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = () => {
    const unanswered = selectedExam.questions.filter((q) => !answers[q.id]);
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
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedExam.questions.forEach((q) => {
      const userAns = (answers[q.id] || "").toString().trim().toLowerCase();
      const correctAns = (q.answer || "").toString().trim().toLowerCase();
      if (userAns === correctAns) correct++;
    });
    return correct;
  };

  const handleBackToExams = () => {
    setSelectedExam(null);
    setAnswers({});
    setShowResults(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          {!selectedExam ? (
            /* ================= EXAM LIST ================= */
            <div className="users-page">
              <div className="users-header">
                <h2>Available Exams</h2>
                <span
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}
                >
                  {exams.length} exam{exams.length > 1 ? "s" : ""}
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

              <div className="exam-list-grid">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-list-card">
                    <div className="exam-card-top">
                      <span className="exam-badge">Available</span>
                      <span className="exam-id">#{exam.id}</span>
                    </div>
                    <h3 className="exam-title">{exam.title}</h3>
                    <p className="exam-subject">{exam.subject}</p>
                    <div className="exam-meta">
                      <span>⏱️ {exam.duration}</span>
                      <span>📝 {exam.totalQuestions} Qs</span>
                      <span>🎯 {exam.passingMarks}% Pass</span>
                    </div>
                    <button
                      className="exam-start-btn"
                      onClick={() => startExam(exam)}
                    >
                      Start Exam →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !showResults ? (
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
                  {selectedExam.duration} • {selectedExam.passingMarks}% Pass
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
                {selectedExam.subject} • {selectedExam.questions.length}{" "}
                Questions
              </p>

              <div className="exam-questions-preview">
                {selectedExam.questions.map((q, i) => (
                  <div key={q.id} className="question-preview-card">
                    <div className="q-preview-header">
                      <span className="q-num">Q{i + 1}</span>
                      <span
                        className="q-type-badge"
                        style={{
                          background: `${questionTypes.find((t) => t.type === q.type)?.color}22`,
                          color: questionTypes.find((t) => t.type === q.type)
                            ?.color,
                          border: `1px solid ${questionTypes.find((t) => t.type === q.type)?.color}55`,
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
                          value={answers[q.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(q.id, e.target.value)
                          }
                        />
                      </div>
                    )}

                    {q.type === "True/False" && (
                      <div className="q-tf">
                        <button
                          type="button"
                          className={`tf-btn ${answers[q.id] === "True" ? "active" : ""}`}
                          onClick={() => handleAnswerChange(q.id, "True")}
                        >
                          ✓ True
                        </button>
                        <button
                          type="button"
                          className={`tf-btn ${answers[q.id] === "False" ? "active" : ""}`}
                          onClick={() => handleAnswerChange(q.id, "False")}
                        >
                          ✗ False
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                  <button
                    className="btn-copy"
                    onClick={handleSubmit}
                    style={{ padding: "14px 40px", fontSize: "15px" }}
                  >
                    📤 Submit Exam
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= RESULTS ================= */
            <div className="users-page">
              <div className="users-header">
                <button
                  className="btn-reset"
                  onClick={handleBackToExams}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  ← Back to Exams
                </button>
              </div>

              <div className="result-summary">
                <div className="result-icon">
                  {calculateScore() / selectedExam.questions.length >= 0.5
                    ? "🎉"
                    : "😔"}
                </div>
                <h3>
                  {calculateScore() / selectedExam.questions.length >= 0.5
                    ? "Congratulations! You Passed!"
                    : "Better Luck Next Time"}
                </h3>
                <div className="result-score">
                  <span className="score-value">{calculateScore()}</span>
                  <span className="score-divider">/</span>
                  <span className="score-total">
                    {selectedExam.questions.length}
                  </span>
                </div>
                <p className="score-percent">
                  {Math.round(
                    (calculateScore() / selectedExam.questions.length) * 100,
                  )}
                  %
                </p>
              </div>

              <h3
                style={{
                  color: "var(--gold)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "1.5px",
                  margin: "30px 0 16px",
                }}
              >
                📋 Answer Review
              </h3>

              {selectedExam.questions.map((q, i) => {
                const userAns = (answers[q.id] || "")
                  .toString()
                  .trim()
                  .toLowerCase();
                const correctAns = (q.answer || "")
                  .toString()
                  .trim()
                  .toLowerCase();
                const isCorrect = userAns === correctAns;

                return (
                  <div
                    key={q.id}
                    className={`question-preview-card ${isCorrect ? "correct" : "wrong"}`}
                  >
                    <div className="q-preview-header">
                      <span className="q-num">Q{i + 1}</span>
                      <span
                        className={`result-badge ${isCorrect ? "correct" : "wrong"}`}
                      >
                        {isCorrect ? "✓ Correct" : "✗ Wrong"}
                      </span>
                    </div>
                    <p className="q-text">{q.question}</p>
                    <div className="answer-review">
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        <span
                          style={{ color: isCorrect ? "#4ade80" : "#ef4444" }}
                        >
                          {answers[q.id] || "(Not answered)"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <strong>Correct Answer:</strong>{" "}
                          <span style={{ color: "#4ade80" }}>{q.answer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn-reset"
                  onClick={handleRetry}
                  style={{ padding: "14px 40px", fontSize: "15px" }}
                >
                  🔄 Retry Exam
                </button>
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
        .question-preview-card.correct {
          border-left-color: #4ade80;
          background: rgba(74,222,128,0.05);
        }
        .question-preview-card.wrong {
          border-left-color: #ef4444;
          background: rgba(239,68,68,0.05);
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

        .q-fill-blank input {
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
        }
        .q-fill-blank input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
        }
        .q-fill-blank input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .q-tf { display: flex; gap: 12px; }
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

        /* Result Summary */
        .result-summary {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, rgba(139,0,0,0.15), rgba(212,175,55,0.05));
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .result-icon {
          font-size: 60px;
          margin-bottom: 12px;
        }
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
        .score-divider {
          font-size: 40px;
          color: rgba(255,255,255,0.3);
        }
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

        .result-badge {
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 700;
        }
        .result-badge.correct {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.4);
        }
        .result-badge.wrong {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.4);
        }

        .answer-review {
          margin-top: 12px;
          padding: 12px;
          background: rgba(0,0,0,0.3);
          border-radius: 6px;
        }
        .answer-review p {
          margin: 6px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }
        .answer-review strong {
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
