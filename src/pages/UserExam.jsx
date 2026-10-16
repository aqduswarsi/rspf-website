import { useState, useEffect, useRef } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import {
  getUserExams,
  getUserExamById,
  submitUserExam,
  submitReattemptRequest,
} from "../utils/api";

const questionTypes = [
  { type: "Fill in the Blank", color: "#15803d" },
  { type: "True / False", color: "#92400e" },
  { type: "MCQ", color: "#1d4ed8" },
  { type: "Written", color: "#7e22ce" },
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  // Reattempt modal
  const [reattemptExam, setReattemptExam] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonSaving, setReasonSaving] = useState(false);
  const [reasonMessage, setReasonMessage] = useState("");

  const timerRef = useRef(null);
  const autoSubmitRef = useRef(false);
  const answersRef = useRef({});
  const selectedExamRef = useRef(null);
  const violationsRef = useRef(0);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    selectedExamRef.current = selectedExam;
  }, [selectedExam]);

  useEffect(() => {
    loadExams();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!selectedExam || result) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            submitAnswers(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [selectedExam, result]);

  // ============ TAB SWITCH DETECTION ============
  useEffect(() => {
    if (!selectedExam || result) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !autoSubmitRef.current) {
        violationsRef.current += 1;
        setViolations(violationsRef.current);

        if (violationsRef.current >= 3) {
          setShowWarning(true);
          setTimeout(() => {
            if (!autoSubmitRef.current) {
              autoSubmitRef.current = true;
              clearInterval(timerRef.current);
              setMessage({
                text: "Exam auto-submitted due to repeated tab switching.",
                type: "error",
              });
              submitAnswers(true);
            }
          }, 2000);
        } else {
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 4000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedExam, result]);

  // ============ BLOCK COPY / PASTE / RIGHT-CLICK ============
  useEffect(() => {
    if (!selectedExam || result) return;

    const prevent = (e) => e.preventDefault();

    const preventKeys = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (["c", "v", "x", "a", "u", "s", "p"].includes(key)) {
          e.preventDefault();
        }
      }
      if (e.key === "F12") e.preventDefault();
    };

    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("keydown", preventKeys);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("keydown", preventKeys);
    };
  }, [selectedExam, result]);

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
      autoSubmitRef.current = false;
      violationsRef.current = 0;
      setViolations(0);
      setShowWarning(false);
      setTimeLeft((data.duration || 30) * 60);
    } catch (err) {
      if (err.message.toLowerCase().includes("already attempt")) {
        const exam = exams.find((e) => e._id === examId);
        if (exam) openReattemptModal(exam);
      } else {
        setMessage({ text: err.message, type: "error" });
      }
    } finally {
      setLoadingExam(false);
    }
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const submitAnswers = async (auto = false) => {
    const exam = selectedExamRef.current;
    const currentAnswers = answersRef.current;
    if (!exam) return;

    try {
      setSubmitting(true);
      setMessage({ text: "", type: "" });
      clearInterval(timerRef.current);

      const answersPayload = exam.questions.map((q) => ({
        questionId: q._id,
        userAnswer: currentAnswers[q._id] || "",
      }));

      const data = await submitUserExam(exam._id, answersPayload);
      setResult(data.data);

      if (auto) {
        setMessage({ text: "Time is up! Exam auto-submitted.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

    const handleSubmit = async () => {
      const exam = selectedExamRef.current;
      const currentAnswers = answersRef.current;
      if (!exam) return;

      const unanswered = exam.questions.filter(
        (q) =>
          !currentAnswers[q._id] || !currentAnswers[q._id].toString().trim(),
      );

      if (unanswered.length > 0) {
        if (
          !window.confirm(
            `${unanswered.length} questions unanswered. Submit anyway?`,
          )
        )
          return;
      } else {
        if (
          !window.confirm("Submit exam? You cannot change answers after this.")
        )
          return;
      }

      await submitAnswers(false);
    };


  const handleBackToExams = () => {
    clearInterval(timerRef.current);
    setSelectedExam(null);
    setAnswers({});
    setResult(null);
    setMessage({ text: "", type: "" });
    setTimeLeft(0);
    autoSubmitRef.current = false;
    violationsRef.current = 0;
    setViolations(0);
    setShowWarning(false);
    loadExams();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "#b91c1c";
    if (timeLeft <= 300) return "#92400e";
    return "var(--navy)";
  };

  // ============ REATTEMPT MODAL ============
  const openReattemptModal = (exam) => {
    setReattemptExam(exam);
    setReason("");
    setReasonMessage("");
  };

  const closeReattemptModal = () => {
    setReattemptExam(null);
    setReason("");
    setReasonMessage("");
  };

  const handleReattemptSubmit = async () => {
    if (!reason.trim()) {
      setReasonMessage("Reason is required");
      return;
    }

    try {
      setReasonSaving(true);
      setReasonMessage("");
      await submitReattemptRequest(reattemptExam._id, reason.trim());
      setReasonMessage(
        "Request submitted successfully. It will be reviewed by the admin.",
      );
      setTimeout(() => {
        closeReattemptModal();
        loadExams();
      }, 1500);
    } catch (err) {
      setReasonMessage(err.message);
    } finally {
      setReasonSaving(false);
    }
  };

  const getExamBadge = (exam) => {
    if (exam.requestStatus === "pending") {
      return {
        text: "Reattempt Pending",
        bg: "#fffbeb",
        color: "#92400e",
        border: "#fde68a",
      };
    }
    if (exam.requestStatus === "approved") {
      return {
        text: "Reattempt Approved",
        bg: "#f0f8f1",
        color: "#15803d",
        border: "#a7ddb2",
      };
    }
    if (exam.attempted) {
      return {
        text: "Attempted",
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
      };
    }
    return {
      text: "Available",
      bg: "#f0f8f1",
      color: "#15803d",
      border: "#a7ddb2",
    };
  };

  const filteredExams = exams.filter((exam) => {
    const query = searchText.trim().toLowerCase();
    if (
      query &&
      ![exam.title, exam.description, exam.step]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    ) {
      return false;
    }
    if (
      filterAvailability &&
      getExamBadge(exam).text !== filterAvailability
    ) {
      return false;
    }
    return true;
  });
  const examAvailabilities = [
    ...new Set(exams.map((exam) => getExamBadge(exam).text)),
  ].sort();
  const hasActiveFilters = searchText || filterAvailability;

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
                borderColor: message.type === "success" ? "#a7ddb2" : "#fecaca",
                color: message.type === "success" ? "#15803d" : "#b91c1c",
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
            <div className="users-page">
              <div className="users-header">
                <h2>Available Exams</h2>
                <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                  {filteredExams.length}
                  {filteredExams.length !== exams.length && ` of ${exams.length}`}{" "}
                  exam{filteredExams.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="exam-types-info">
                <h3>Question Types</h3>
                <div className="question-types-grid">
                  {questionTypes.map((qt) => (
                    <div key={qt.type} className="qtype-card">
                      <span className="qtype-label" style={{ color: qt.color }}>
                        {qt.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {exams.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search exam, description, step..."
                    aria-label="Search available exams"
                    className="search-input"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    aria-label="Filter exams by availability"
                    className="search-input"
                  >
                    <option value="">All Exam Statuses</option>
                    {examAvailabilities.map((availability) => (
                      <option key={availability} value={availability}>
                        {availability}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="table-action"
                    onClick={() => {
                      setSearchText("");
                      setFilterAvailability("");
                    }}
                    disabled={!hasActiveFilters}
                    style={{
                      padding: "10px 16px",
                      cursor: hasActiveFilters ? "pointer" : "not-allowed",
                      opacity: hasActiveFilters ? 1 : 0.5,
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {exams.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No exams available yet.
                </p>
              ) : filteredExams.length === 0 ? (
                <p
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No exams match your filters.
                </p>
              ) : (
                <div className="exam-list-grid">
                  {filteredExams.map((exam) => {
                    const badge = getExamBadge(exam);
                    return (
                      <div key={exam._id} className="exam-list-card">
                        <div className="exam-card-top">
                          <span
                            className="exam-badge"
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {badge.text}
                          </span>
                          <span className="exam-id">{exam.step}</span>
                        </div>
                        <h3 className="exam-title">{exam.title}</h3>
                        <p className="exam-subject">{exam.description}</p>
                        <div className="exam-meta">
                          <span>Duration {exam.duration} min</span>
                          <span>{exam.questionCount} Qs</span>
                          <span>{exam.passPercentage}% Pass</span>
                        </div>

                        {exam.canAttempt ? (
                          <button
                            className="exam-start-btn"
                            onClick={() => startExam(exam._id)}
                          >
                            Start Exam
                          </button>
                        ) : exam.requestStatus === "pending" ? (
                          <button
                            className="exam-start-btn"
                            disabled
                            style={{ cursor: "not-allowed" }}
                          >
                            Request Pending
                          </button>
                        ) : exam.requestStatus === "approved" ? (
                          <button
                            className="exam-start-btn"
                            onClick={() => startExam(exam._id)}
                          >
                            Start Reattempt
                          </button>
                        ) : (
                          <button
                            className="exam-start-btn"
                            onClick={() => openReattemptModal(exam)}
                            style={{
                              background:
                                "linear-gradient(135deg, #78350f, #b45309)",
                            }}
                          >
                            Request Reattempt
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : !result ? (
            <div className="users-page">
              <div className="users-header">
                <button
                  className="btn-reset"
                  onClick={handleBackToExams}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  Back
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: timeLeft <= 60 ? "#FEF2F2" : "#FFFFFF",
                    border: `1px solid ${getTimerColor()}`,
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "11px",
                      letterSpacing: "1px",
                    }}
                  >
                    TIME LEFT
                  </span>
                  <span
                    style={{
                      color: getTimerColor(),
                      fontSize: "20px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      letterSpacing: "2px",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
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
              <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                {selectedExam.courseName} • {selectedExam.questions.length}{" "}
                Questions • {selectedExam.passPercentage}% Pass
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
                          True
                        </button>
                        <button
                          type="button"
                          className={`tf-btn ${answers[q._id] === "False" ? "active" : ""}`}
                          onClick={() => handleAnswerChange(q._id, "False")}
                        >
                          False
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
                            background: "#FFFFFF",
                            border: "1px solid var(--line)",
                            borderRadius: "6px",
                            color: "var(--ink)",
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
                  <p
                    style={{
                      padding: "12px 24px",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.4)",
                      borderRadius: "8px",
                      color: "#f59e0b",
                      fontSize: "13px",
                      display: "inline-block",
                      margin: "0 0 16px",
                    }}
                  >
                    The exam will also auto-submit when the timer ends.
                  </p>
                  <div>
                    <button
                      className="btn-copy"
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{ padding: "14px 40px", fontSize: "15px" }}
                    >
                      {submitting ? "Submitting..." : "Submit Exam"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                <div style={{ fontSize: "72px", marginBottom: "16px" }}>
                  &#10003;
                </div>
                <h2
                  style={{
                    color: "var(--gold)",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "2px",
                    fontSize: "26px",
                    margin: "0 0 12px",
                  }}
                >
                  Exam Submitted Successfully
                </h2>
                <p
                  style={{
                    color: "var(--ink)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    margin: "0 0 8px",
                  }}
                >
                  Your exam has been submitted successfully.
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    margin: "0 0 30px",
                  }}
                >
                  Your result will be available after admin review.
                </p>

                <button
                  className="btn-copy"
                  onClick={handleBackToExams}
                  style={{ padding: "14px 40px", fontSize: "15px" }}
                >
                  Back to Exams
                </button>
              </div>
            </div>
          )}

          {/* ============ REATTEMPT MODAL ============ */}
          {reattemptExam && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}
              onClick={closeReattemptModal}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--line)",
                  borderRadius: "16px",
                  padding: "28px",
                  maxWidth: "540px",
                  width: "100%",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  style={{
                    color: "var(--navy)",
                    margin: "0 0 8px",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "2px",
                  }}
                >
                  Request Reattempt
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    margin: "0 0 20px",
                  }}
                >
                  {reattemptExam.title}
                </p>

                <p
                  style={{
                    color: "var(--ink)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  You have already attempted this exam. To request another
                  attempt, please provide a valid reason. Your request will be
                  reviewed by the admin.
                </p>

                <label
                  style={{
                    color: "var(--navy)",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  REASON
                </label>
                <textarea
                  rows="4"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setReasonMessage("");
                  }}
                  placeholder="Enter your reason..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#FFFFFF",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    color: "var(--ink)",
                    fontSize: "14px",
                    fontFamily: "'Outfit', sans-serif",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />

                {reasonMessage && (
                  <p
                    style={{
                      marginTop: "12px",
                      fontSize: "13px",
                      color: reasonMessage.toLowerCase().includes("submitted")
                        ? "#15803D"
                        : "#B91C1C",
                    }}
                  >
                    {reasonMessage}
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
                    onClick={closeReattemptModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="primary"
                    onClick={handleReattemptSubmit}
                    disabled={reasonSaving}
                    style={{ padding: "10px 24px" }}
                  >
                    {reasonSaving ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============ WARNING BANNER ============ */}
          {showWarning && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  violations >= 3
                    ? "rgba(239,68,68,0.98)"
                    : "rgba(245,158,11,0.95)",
                color: "white",
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                zIndex: 2000,
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                maxWidth: "90%",
                textAlign: "center",
              }}
            >
              {violations >= 3
                ? "Tab switch limit exceeded. Submitting your exam..."
                : `Warning ${violations}/3 — Tab switching is not allowed. Your exam will auto-submit after 3 violations.`}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .exam-types-info {
          margin-bottom: 24px;
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 12px;
        }
        .exam-types-info h3 {
          margin: 0 0 16px;
          color: var(--navy);
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
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 8px;
          font-size: 13px;
          transition: all 0.2s;
        }
        .qtype-card:hover {
          border-color: var(--signal);
          background: #FCEDE5;
        }
        .qtype-label { font-weight: 500; }

        .exam-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .exam-list-card {
          padding: 20px;
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .exam-list-card:hover {
          border-color: var(--signal);
          box-shadow: 0 4px 12px rgba(11,37,69,0.08);
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
        }
        .exam-id {
          color: var(--muted);
          font-size: 12px;
          font-family: 'Courier New', monospace;
        }
        .exam-title {
          margin: 0 0 6px;
          color: var(--navy);
          font-size: 16px;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
        }
        .exam-subject {
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 12px;
        }
        .exam-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
          font-size: 12px;
          color: var(--muted);
        }
        .exam-meta span {
          padding: 4px 8px;
          background: var(--paper);
          border-radius: 4px;
        }
        .exam-start-btn {
          width: 100%;
          padding: 11px;
          background: var(--signal);
          color: #FFFFFF;
          border: 1px solid var(--signal);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1px;
          transition: all 0.3s;
        }
        .exam-start-btn:hover:not(:disabled) {
          background: #C94D0A;
          color: #FFFFFF;
        }
        .exam-start-btn:disabled {
          background: var(--paper);
          border-color: var(--line);
          color: var(--muted);
        }

        .exam-questions-preview {
          padding: 20px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid rgba(212,175,55,0.15);
        }
        .question-preview-card {
          padding: 18px;
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-left: 3px solid var(--signal);
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
          color: var(--navy);
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
          color: var(--ink);
          margin: 0 0 14px;
          line-height: 1.6;
          font-size: 14px;
          white-space: pre-wrap;
        }

        .q-fill-blank input,
        .q-fill-blank textarea {
          width: 100%;
          max-width: 400px;
          padding: 12px 14px;
          background: #FFFFFF;
          border: 1px solid var(--line);
          border-radius: 6px;
          color: var(--ink);
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        .q-fill-blank textarea { max-width: 100%; resize: vertical; }
        .q-fill-blank input:focus,
        .q-fill-blank textarea:focus {
          border-color: var(--navy);
          box-shadow: 0 0 0 3px rgba(11,37,69,0.12);
        }
        .q-fill-blank input::placeholder,
        .q-fill-blank textarea::placeholder {
          color: var(--muted);
        }

        .q-tf { display: flex; gap: 12px; flex-wrap: wrap; }
        .tf-btn {
          padding: 10px 24px;
          background: #FFFFFF;
          border: 1px solid var(--line);
          color: var(--ink);
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .tf-btn:hover {
          border-color: var(--signal);
          color: var(--signal);
        }
        .tf-btn.active {
          background: #FCEDE5;
          border-color: var(--signal);
          color: var(--navy);
        }
      `}</style>
    </div>
  );
}
