import { useState } from "react";
import { useLocation } from "react-router-dom";

const classes = [
  "STEP 01 Origin and Concept Diploma in Direct Selling (Astra Shastra)",
  "STEP 02 Basic Diploma in Product Knowledge",
];

const subjects = ["Acquisition of Intellectual Knowledge", "Earning money", "Skill Acquisition"];

const questions = [
  { className: classes[0], subject: subjects[0], question: "The current education system has become a hub for creating unemployment.", type: "True False" },
  { className: classes[0], subject: subjects[0], question: "There is a 100% guarantee of a job after obtaining higher education.", type: "True False" },
];

const results = [
  { id: "33893449", name: "POOJA", sponsor: "32825325", mobile: "9336726146", address: "VILLAGE POST KACHANARWA PS KONE", className: classes[0], date: "27-Jun-2026", category: "Silver" },
  { id: "37270974", name: "JEETAN", sponsor: "32825325", mobile: "9118382581", address: "VILLAGE POST KACHANARWA PS KONE", className: classes[0], date: "11-Jul-2026", category: "Silver" },
];

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="exam-field">
      <span>{label}</span>
      <select value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function ExamManagement() {
  const { pathname } = useLocation();

  if (pathname === "/admin/exam/non-printed") return <ResultList title="Non Printed Result" showRows={false} />;
  if (pathname === "/admin/exam/printed") return <ResultList title="Printed Result" showRows />;
  if (pathname === "/admin/exam/results") return <ManageResult />;
  return <ManageQuestion />;
}

function ManageQuestion() {
  const [form, setForm] = useState({ className: "", subject: "", question: "", type: "" });
  const [message, setMessage] = useState("");
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const saveQuestion = (event) => {
    event.preventDefault();
    setMessage("Question saved successfully.");
    setForm({ className: "", subject: "", question: "", type: "" });
  };

  return (
    <section className="exam-page">
      <div className="exam-title-bar">Add Question</div>
      <form className="exam-question-form" onSubmit={saveQuestion}>
        <div className="exam-form-grid">
          <SelectField label="Select Class" value={form.className} onChange={update("className")} options={classes} placeholder="Choose Class" />
          <SelectField label="Select Subject" value={form.subject} onChange={update("subject")} options={subjects} placeholder="Choose Subject" />
        </div>
        <label className="exam-field full-width"><span>Enter Your Question</span><input value={form.question} onChange={update("question")} placeholder="Enter Question" required /></label>
        <SelectField label="Question Type" value={form.type} onChange={update("type")} options={["True False", "Multiple Choice"]} placeholder="Select Type" />
        <button className="exam-save" type="submit">Save Question</button>
        {message && <p className="exam-message">{message}</p>}
      </form>
      <h2 className="exam-section-title">All Questions</h2>
      <div className="exam-filter-grid">
        <SelectField label="Filter By Class" options={classes} placeholder="All Classes" />
        <SelectField label="Filter By Subject" options={subjects} placeholder="All Subjects" />
      </div>
      <div className="exam-table-wrap"><table className="exam-table"><thead><tr><th>#</th><th>Class</th><th>Subject</th><th>Question</th><th>Type</th><th>View</th><th>Action</th></tr></thead><tbody>{questions.map((item, index) => <tr key={item.question}><td>{index + 1}</td><td>{item.className}</td><td>{item.subject}</td><td>{item.question}</td><td><span className="question-type">{item.type}</span></td><td><button className="view-button" type="button">View</button></td><td><button className="edit-button" type="button">Edit</button><button className="delete-button" type="button">Delete</button></td></tr>)}</tbody></table></div>
    </section>
  );
}

function ManageResult() {
  const [message, setMessage] = useState("");
  return (
    <section className="exam-page">
      <div className="exam-title-bar">Manage Result</div>
      <div className="exam-result-form">
        <SelectField label="Select Class" options={classes} placeholder="Choose Class" />
        <SelectField label="Select User" options={results.map((result) => `${result.name} - ${result.id}`)} placeholder="Choose User" />
        <label className="exam-field"><span>Score</span><input type="number" min="0" placeholder="Enter score" /></label>
        <button type="button" className="exam-save" onClick={() => setMessage("Result saved successfully.")}>Save Result</button>
        {message && <p className="exam-message">{message}</p>}
      </div>
    </section>
  );
}

function ResultList({ title, showRows }) {
  return (
    <section className="exam-page result-page">
      <div className="result-heading"><h2>{title}</h2><span>All Records</span></div>
      <div className="result-panel"><h3>Result Records</h3><div className="exam-table-wrap"><table className="exam-table result-table"><thead><tr><th>#</th><th>Id No</th><th>Name</th><th>Sponsor Code</th><th>Mobile No</th><th>Address</th><th>Class</th><th>Date</th><th>Category</th><th>Action</th></tr></thead><tbody>{showRows && results.map((result, index) => <tr key={result.id}><td>{index + 1}</td><td>{result.id}</td><td>{result.name}</td><td>{result.sponsor}</td><td>{result.mobile}</td><td>{result.address}</td><td>{result.className}</td><td>{result.date}</td><td>{result.category}</td><td><button className="view-button" type="button">View</button></td></tr>)}</tbody></table></div></div>
    </section>
  );
}