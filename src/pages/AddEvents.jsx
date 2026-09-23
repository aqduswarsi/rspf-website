import { useState, useEffect } from "react";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
} from "../utils/api";

export default function AddEvents() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Event Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        alert("✅ Event updated successfully!");
      } else {
        await createEvent(form);
        alert("✅ Event added successfully!");
      }
      setForm({ title: "", description: "", date: "" });
      setEditingId(null);
      loadEvents();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
    });
    setEditingId(event._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    try {
      await deleteEvent(id);
      alert("🗑️ Event deleted");
      loadEvents();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", date: "" });
    setEditingId(null);
  };

  return (
    <div className="form-page bio-form-page">
      <div className="bio-form-header">
        <h2>{editingId ? "Edit Event" : "Manage Events"}</h2>
        <p>RPSF Events</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bio-form">
        <div className="bio-section">
          <h3>{editingId ? "Update Event" : "Add New Event"}</h3>
          <div className="bio-grid">
            <div className="form-field">
              <label>Event Name *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event name"
                required
              />
            </div>
            <div className="form-field">
              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>
            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="bio-form-actions">
          {editingId && (
            <button type="button" className="btn-reset" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="primary" disabled={submitting}>
            {submitting
              ? "Saving..."
              : editingId
                ? "Update Event"
                : "Save Event"}
          </button>
        </div>
      </form>

      {/* Events List */}
      <div className="users-page" style={{ marginTop: "30px" }}>
        <div className="users-header">
          <h2>All Events ({events.length})</h2>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--gold)" }}>
            Loading...
          </p>
        ) : (
          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    <td>{e.title}</td>
                    <td>{e.description || "-"}</td>
                    <td>{e.date || "-"}</td>
                    <td className="action-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(e)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleDelete(e._id, e.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No events added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
