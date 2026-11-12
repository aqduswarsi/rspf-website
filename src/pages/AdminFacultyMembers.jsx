import { useState, useEffect, useMemo } from "react";
import {
  createFacultyMember,
  getAllFacultyMembers,
  updateFacultyMember,
  deleteFacultyMember,
} from "../utils/api"; // 👈 अपनी api.js का सही path डालें

const initialForm = {
  name: "",
  facultyType: "",
  designation: "",
  instructorType: "",
  rank: "",
  subject: "",
  placeOfPosting: "",
  education: "",
  uinNumber: "",
};

const designations = [
  "Principal",
  "Vice Principal",
  "Instructor",
  "Chief Drill Instructor",
  "Head Master",
];

const instructorTypes = [
  "Commando Instructor",
  "IT Instructor",
  "Indoor Instructor",
  "Outdoor Instructor",
];

const facultyTypes = ["Indoor", "Outdoor"];

export default function AdminFacultyMembers() {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // 👈 एडिट ट्रैक करने के लिए
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterFacultyType, setFilterFacultyType] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterInstructorType, setFilterInstructorType] = useState("");

  // 👈 पेज लोड होते ही डेटा फेच करें
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllFacultyMembers();
      setMembers(data);
    } catch (err) {
      setMessage("❌ Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      ...(name === "designation" && value !== "Instructor"
        ? { instructorType: "" }
        : {}),
    }));
    setMessage("");
  };

  const normalizeFacultyPayload = (payload) => {
    const normalized = { ...payload };

    if (normalized.uinNumber && !normalized.uimNumber) {
      normalized.uimNumber = normalized.uinNumber;
    }

    if (normalized.uimNumber && !normalized.uinNumber) {
      normalized.uinNumber = normalized.uimNumber;
    }

    return normalized;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = normalizeFacultyPayload(form);

      if (editingId) {
        // 👈 अपडेट (Edit)
        await updateFacultyMember(editingId, payload);
        setMessage("✅ Faculty member updated successfully.");
      } else {
        // 👈 नया जोड़ें (Add)
        await createFacultyMember(payload);
        setMessage("✅ Faculty member added successfully.");
      }
      setForm(initialForm);
      setEditingId(null);
      loadMembers(); // लिस्ट रिफ्रेश करें
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name || "",
      facultyType: member.facultyType || "",
      designation: member.designation || "",
      instructorType: member.instructorType || "",
      rank: member.rank || "",
      subject: member.subject || "",
      placeOfPosting: member.placeOfPosting || "",
      education: member.education || "",
      uinNumber: member.uinNumber || member.uimNumber || "",
    });
    setEditingId(member._id); // 👈 MongoDB की _id
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await deleteFacultyMember(id);
      loadMembers();
    } catch (err) {
      alert("❌ Failed to delete member.");
    }
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
  };

  const filteredMembers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return members.filter((member) => {
      if (
        query &&
        ![
          member.name,
          member.facultyType,
          member.designation,
          member.instructorType,
          member.rank,
          member.subject,
          member.placeOfPosting,
          member.education,
          member.uinNumber,
          member.uimNumber,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      ) {
        return false;
      }

      if (filterFacultyType && member.facultyType !== filterFacultyType)
        return false;
      if (filterDesignation && member.designation !== filterDesignation)
        return false;
      if (filterInstructorType && member.instructorType !== filterInstructorType)
        return false;

      return true;
    });
  }, [
    members,
    searchText,
    filterFacultyType,
    filterDesignation,
    filterInstructorType,
  ]);

  const facultyDesignations = [
    ...new Set([
      ...designations,
      ...members.map((member) => member.designation).filter(Boolean),
    ]),
  ].sort();
  const facultyInstructorTypes = [
    ...new Set([
      ...instructorTypes,
      ...members.map((member) => member.instructorType).filter(Boolean),
    ]),
  ].sort();
  const hasActiveFilters = Boolean(
    searchText ||
      filterFacultyType ||
      filterDesignation ||
      filterInstructorType,
  );

  const clearFilters = () => {
    setSearchText("");
    setFilterFacultyType("");
    setFilterDesignation("");
    setFilterInstructorType("");
  };

  const filterInputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#FFFFFF",
    border: "1px solid var(--line)",
    borderRadius: "6px",
    color: "var(--ink)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  };
  const filterLabelStyle = {
    color: "var(--muted)",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h2>Faculty Member</h2>
          <p>Add faculty details for indoor and outdoor training.</p>
        </div>
      </div>

      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <label htmlFor="faculty-name">Name</label>
              <input
                id="faculty-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="faculty-type">Faculty Type</label>
              <select
                id="faculty-type"
                name="facultyType"
                value={form.facultyType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label htmlFor="faculty-designation">Designation</label>
              <select
                id="faculty-designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Designation --</option>
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
            {form.designation === "Instructor" && (
              <div>
                <label htmlFor="faculty-instructor-type">Instructor Type</label>
                <select
                  id="faculty-instructor-type"
                  name="instructorType"
                  value={form.instructorType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Instructor Type --</option>
                  {instructorTypes.map((instructorType) => (
                    <option key={instructorType} value={instructorType}>
                      {instructorType}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="faculty-rank">Rank</label>
              <input
                id="faculty-rank"
                name="rank"
                value={form.rank}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="faculty-subject">Subject</label>
              <input
                id="faculty-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="faculty-posting">Place of Posting</label>
              <input
                id="faculty-posting"
                name="placeOfPosting"
                value={form.placeOfPosting}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="faculty-education">Education</label>
              <input
                id="faculty-education"
                name="education"
                value={form.education}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="faculty-uin-number">UIN Number</label>
              <input
                id="faculty-uin-number"
                name="uinNumber"
                value={form.uinNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Faculty Member"
                  : "Add Faculty Member"}
            </button>
            {editingId && (
              <button
                type="button"
                className="table-action"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>

      <div className="education-panel" style={{ marginTop: "20px" }}>
        <div className="panel-heading">
          <h3>
            Faculty Members ({filteredMembers.length}
            {filteredMembers.length !== members.length && ` of ${members.length}`})
          </h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            alignItems: "end",
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div>
            <label htmlFor="faculty-search" style={filterLabelStyle}>
              Search (Name, UIN, Subject, Posting)
            </label>
            <input
              id="faculty-search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type any keyword..."
              aria-label="Search faculty members"
              style={filterInputStyle}
            />
          </div>
          <div>
            <label htmlFor="faculty-type-filter" style={filterLabelStyle}>
              Faculty Type
            </label>
            <select
              id="faculty-type-filter"
              value={filterFacultyType}
              onChange={(e) => setFilterFacultyType(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">All Types</option>
              {facultyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="faculty-designation-filter" style={filterLabelStyle}>
              Designation
            </label>
            <select
              id="faculty-designation-filter"
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">All Designations</option>
              {facultyDesignations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="faculty-instructor-type-filter" style={filterLabelStyle}>
              Instructor Type
            </label>
            <select
              id="faculty-instructor-type-filter"
              value={filterInstructorType}
              onChange={(e) => setFilterInstructorType(e.target.value)}
              style={filterInputStyle}
            >
              <option value="">All Instructor Types</option>
              {facultyInstructorTypes.map((instructorType) => (
                <option key={instructorType} value={instructorType}>
                  {instructorType}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="table-action"
            onClick={clearFilters}
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
        {loading ? (
          <p style={{ padding: "16px 20px" }}>Loading...</p>
        ) : filteredMembers.length ? (
          <div className="education-table-wrap">
            <table className="education-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Designation</th>
                  <th>Rank</th>
                  <th>Subject</th>
                  <th>Place of Posting</th>
                  <th>Education</th>
                  <th>UIN Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id}>
                    {" "}
                    {/* 👈 _id का इस्तेमाल करें */}
                    <td>{member.name}</td>
                    <td>{member.facultyType}</td>
                    <td>
                      {member.designation === "Instructor"
                        ? `${member.designation} - ${member.instructorType}`
                        : member.designation}
                    </td>
                    <td>{member.rank || "—"}</td>
                    <td>{member.subject || "—"}</td>
                    <td>{member.placeOfPosting || "—"}</td>
                    <td>{member.education || "—"}</td>
                    <td>{member.uinNumber ?? member.uimNumber ?? "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(member._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ padding: "16px 20px", color: "var(--muted)" }}>
            {members.length ? "No matching faculty members found." : "No faculty members added yet."}
          </p>
        )}
      </div>
    </section>
  );
}
