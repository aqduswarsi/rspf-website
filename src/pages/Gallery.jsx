import { useState, useEffect } from "react";
import {
  createGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} from "../utils/api";

export default function Gallery() {
  const [form, setForm] = useState({
    image: "",
    title: "",
    category: "General",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await getAllGalleryImages();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    if (!form.image) {
      alert("Please select an image");
      return;
    }
    setUploading(true);
    try {
      await createGalleryImage({
        image: form.image,
        title: form.title || "Gallery Image",
        category: form.category || "General",
      });
      alert("✅ Image saved to gallery!");
      setForm({ image: "", title: "", category: "General" });
      // reset file input
      document.getElementById("gallery-file-input").value = "";
      loadImages();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      loadImages();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="form-page bio-form-page">
      <div className="bio-form-header">
        <h2>Manage Gallery</h2>
        <p>Upload and manage RPSF gallery photos</p>
      </div>

      {/* ============ Upload Form ============ */}
      <form onSubmit={handleSubmit} className="bio-form">
        <div className="bio-section">
          <h3>Photo</h3>

          <div className="bio-grid">
            <div className="form-field full-width">
              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  padding: "10px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  borderRadius: "8px",
                  color: "white",
                  width: "100%",
                  cursor: "pointer",
                }}
              />
            </div>

            {form.image && (
              <div className="form-field full-width">
                <label>Preview:</label>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    border: "2px solid rgba(212,175,55,0.4)",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bio-form-actions">
          <button type="submit" className="primary" disabled={uploading}>
            {uploading ? "Saving..." : "Save Gallery"}
          </button>
        </div>
      </form>

      {/* ============ All Images ============ */}
      <div className="users-page" style={{ marginTop: "30px" }}>
        <div className="users-header">
          <h2>All Images ({images.length})</h2>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--gold)" }}>
            Loading...
          </p>
        ) : images.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              padding: "40px",
              fontStyle: "italic",
            }}
          >
            No images yet. Upload your first image above.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Image</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img, i) => (
                  <tr key={img._id}>
                    <td>{i + 1}</td>
                    <td>
                      <img
                        src={img.image}
                        alt={img.title || "Gallery"}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid rgba(212,175,55,0.3)",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML =
                            "<span style='color:#ef4444;font-size:11px'>Broken image</span>";
                        }}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(img._id)}
                        style={{
                          background: "transparent",
                          color: "#ef4444",
                          border: "none",
                          fontSize: "14px",
                          cursor: "pointer",
                          padding: "6px 12px",
                          textDecoration: "underline",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
