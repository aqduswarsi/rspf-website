import { useState } from "react";

export default function AddEvents() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [events, setEvents] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, form]);
    alert("Event added!");
    // TODO: API call — POST /api/admin/events
    setForm({ title: "", date: "", location: "", description: "" });
  };

  return (
    <div className="form-page">
      <h2>Add Events</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Event Title</label>
        <input
          placeholder="Enter event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <label>Location</label>
        <input
          placeholder="Enter location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <label>Description</label>
        <textarea
          placeholder="Enter event description..."
          rows="4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button type="submit" className="primary">
          Add Event
        </button>
      </form>

      {events.length > 0 && (
        <div className="list-preview">
          <h3>Recent Events</h3>
          {events.map((ev, i) => (
            <div key={i} className="list-item">
              <strong>{ev.title}</strong> — {ev.date} @ {ev.location}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
