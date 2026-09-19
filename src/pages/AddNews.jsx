import { useState } from "react";

export default function AddNews() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [newsList, setNewsList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNewsList([...newsList, form]);
    alert("News added!");
    // TODO: API call — POST /api/admin/news
    setForm({ title: "", content: "" });
  };

  return (
    <div className="form-page">
      <h2>Add News</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>News Title</label>
        <input
          placeholder="Enter news title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <label>News Content</label>
        <textarea
          placeholder="Enter news content..."
          rows="6"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <button type="submit" className="primary">
          Publish News
        </button>
      </form>

      {newsList.length > 0 && (
        <div className="list-preview">
          <h3>Published News</h3>
          {newsList.map((n, i) => (
            <div key={i} className="list-item">
              <strong>{n.title}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
