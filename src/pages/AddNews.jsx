import { useState, useEffect } from "react";
import { createNews, getAllNews, deleteNews, updateNews } from "../utils/api";

export default function AddNews() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: "",
    image: "",
    category: "General",
  });
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getAllNews();
      setNewsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, image: ev.target.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      alert("Title and content required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateNews(editingId, form);
        alert("✅ News updated!");
      } else {
        await createNews(form);
        alert("✅ News published!");
      }
      setForm({
        title: "",
        content: "",
        date: "",
        image: "",
        category: "General",
      });
      setEditingId(null);
      loadNews();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (news) => {
    setForm({
      title: news.title || "",
      content: news.content || "",
      date: news.date || "",
      image: news.image || "",
      category: news.category || "General",
    });
    setEditingId(news._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete news "${title}"?`)) return;
    try {
      await deleteNews(id);
      loadNews();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleCancel = () => {
    setForm({
      title: "",
      content: "",
      date: "",
      image: "",
      category: "General",
    });
    setEditingId(null);
  };

  return (
    <div className="form-page bio-form-page">
      <div className="bio-form-header">
        <h2>{editingId ? "Edit News" : "Add News"}</h2>
        <p>
          {editingId
            ? "Update existing news"
            : "Publish RPSF news and announcements"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bio-form">
        <div className="bio-section">
          <h3>News Details</h3>
          <div className="bio-grid">
            <div className="form-field full-width">
              <label>News Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter news title"
                required
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
            <div className="form-field">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>General</option>
                <option>Announcement</option>
                <option>Notice</option>
                <option>Update</option>
              </select>
            </div>
            <div className="form-field full-width">
              <label>Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="6"
                placeholder="Write news content..."
                required
              />
            </div>
            <div className="form-field full-width">
              <label>News Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="News"
                  style={{
                    marginTop: "10px",
                    maxWidth: "200px",
                    borderRadius: "8px",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                />
              )}
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
                ? "Update News"
                : "Publish News"}
          </button>
        </div>
      </form>

      <div className="users-page" style={{ marginTop: "30px" }}>
        <div className="users-header">
          <h2>All News ({newsList.length})</h2>
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newsList.map((n, i) => (
                  <tr key={n._id}>
                    <td>{i + 1}</td>
                    <td>
                      {n.image ? (
                        <img
                          src={n.image}
                          alt={n.title}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid rgba(212,175,55,0.3)",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "11px",
                          }}
                        >
                          No image
                        </span>
                      )}
                    </td>
                    <td>{n.title}</td>
                    <td>{n.category}</td>
                    <td>{n.date || "-"}</td>
                    <td className="action-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(n)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleDelete(n._id, n.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {newsList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      No news published yet
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
