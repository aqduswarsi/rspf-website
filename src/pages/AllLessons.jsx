import { useState, useEffect } from "react";
import { getAllLessons, deleteLesson, getAllCourses } from "../utils/api";

export default function AllLessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourseId, setFilterCourseId] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [lessonsData, coursesData] = await Promise.all([
        getAllLessons(),
        getAllCourses(),
      ]);
      setLessons(lessonsData);
      setCourses(coursesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId) => {
    try {
      const data = await getAllLessons(courseId || undefined);
      setLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const cid = e.target.value;
    setFilterCourseId(cid);
    loadLessons(cid);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      await deleteLesson(id);
      loadLessons(filterCourseId);
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
          <h2>All Lessons</h2>
          <p>Review the study material currently available to learners.</p>
        </div>
        <span className="record-count">
          {lessons.length} {lessons.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Filter */}
      <div
        className="education-panel education-form-panel"
        style={{ marginBottom: "20px" }}
      >
        <label
          htmlFor="filter-course"
          style={{
            color: "var(--gold)",
            fontSize: "13px",
            letterSpacing: "1px",
            marginBottom: "8px",
            display: "block",
          }}
        >
          Filter By Course
        </label>
        <select
          id="filter-course"
          value={filterCourseId}
          onChange={handleFilterChange}
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="education-panel">
        <div className="panel-heading">
          <h3>Lessons Records</h3>
        </div>
        <div className="education-table-wrap">
          {loading ? (
            <p style={{ padding: "20px", color: "var(--gold)" }}>Loading...</p>
          ) : lessons.length === 0 ? (
            <p style={{ padding: "20px", color: "rgba(255,255,255,0.5)" }}>
              No lessons found.
            </p>
          ) : (
            <table className="education-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Content Title</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson._id}>
                    <td>{index + 1}</td>
                    <td>{lesson.courseId?.name || "-"}</td>
                    <td>{lesson.subjectId?.name || "-"}</td>
                    <td>{lesson.title}</td>
                    <td>{formatDate(lesson.createdAt)}</td>
                    <td>
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
