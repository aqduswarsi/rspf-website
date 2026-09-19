import { useState } from "react";
import { useLocation } from "react-router-dom";

const lessonRecords = [
  { title: "Introduction to Direct Selling", subject: "Business Fundamentals", date: "18 Sep 2026" },
  { title: "Building Customer Relationships", subject: "Communication Skills", date: "15 Sep 2026" },
];

const pageContent = {
  "/admin/education/courses": {
    title: "Manage Course",
    description: "Create and maintain the courses available to learners.",
    label: "Course Name",
    placeholder: "Enter course name",
    button: "Save Course",
    success: "Course saved successfully.",
  },
  "/admin/education/subjects": {
    title: "Manage Subject",
    description: "Add subjects that can be used when creating study material.",
    label: "Subject Name",
    placeholder: "Enter subject name",
    button: "Save Subject",
    success: "Subject saved successfully.",
  },
};

export default function EducationManagement() {
  const { pathname } = useLocation();
  const [value, setValue] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [message, setMessage] = useState("");

  if (pathname === "/admin/education/lessons") {
    return (
      <section className="education-page">
        <div className="page-heading">
          <div><p className="eyebrow">Educational Management</p><h2>All Lessons</h2><p>Review the study material currently available to learners.</p></div>
          <span className="record-count">{lessonRecords.length} records</span>
        </div>
        <div className="education-panel">
          <div className="panel-heading"><h3>Lessons Records</h3></div>
          <div className="education-table-wrap">
            <table className="education-table">
              <thead><tr><th>#</th><th>Content Title</th><th>Subject</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>{lessonRecords.map((lesson, index) => (
                <tr key={lesson.title}>
                  <td>{index + 1}</td><td>{lesson.title}</td><td>{lesson.subject}</td><td>{lesson.date}</td>
                  <td><button type="button" className="table-action">Edit</button> <button type="button" className="table-action danger">Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (pathname === "/admin/education/lessons/add") return <LessonForm />;

  const content = pageContent[pathname] || pageContent["/admin/education/courses"];
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    setSavedItems((items) => [...items, value.trim()]);
    setValue("");
    setMessage(content.success);
  };

  return (
    <section className="education-page">
      <div className="page-heading"><div><p className="eyebrow">Educational Management</p><h2>{content.title}</h2><p>{content.description}</p></div></div>
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="education-name">{content.label}</label>
          <input id="education-name" value={value} onChange={(event) => setValue(event.target.value)} placeholder={content.placeholder} required />
          <button type="submit" className="primary">{content.button}</button>
        </form>
        {message && <p className="form-message">{message}</p>}
        {savedItems.length > 0 && <div className="saved-items"><h3>Recently Added</h3>{savedItems.map((item, index) => <div className="saved-item" key={`${item}-${index}`}>{item}</div>)}</div>}
      </div>
    </section>
  );
}

function LessonForm() {
  const [form, setForm] = useState({ title: "", subject: "", content: "" });
  const [message, setMessage] = useState("");
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Lesson saved successfully.");
    setForm({ title: "", subject: "", content: "" });
  };

  return (
    <section className="education-page">
      <div className="page-heading"><div><p className="eyebrow">Educational Management</p><h2>Manage Lessons</h2><p>Add study material without linking it to a class.</p></div></div>
      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <label htmlFor="lesson-title">Content Title</label><input id="lesson-title" value={form.title} onChange={update("title")} placeholder="Enter content title" required />
          <label htmlFor="lesson-subject">Subject</label><input id="lesson-subject" value={form.subject} onChange={update("subject")} placeholder="Enter subject name" required />
          <label htmlFor="lesson-content">Content Description</label><textarea id="lesson-content" rows="7" value={form.content} onChange={update("content")} placeholder="Write study material or paste a resource link" required />
          <button type="submit" className="primary">Save Lesson</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}