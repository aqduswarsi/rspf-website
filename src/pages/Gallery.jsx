import { useState, useEffect } from "react";
import {
  createGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} from "../utils/api";

export default function Gallery() {
  const [form, setForm] = useState({
    images: [],
    title: "",
    description: "",
    category: "General",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [customFolders, setCustomFolders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rpsf_gallery_folders") || "[]");
    } catch {
      return [];
    }
  });

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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (files.some((file) => file.size > 2 * 1024 * 1024)) {
      alert("Each image must be less than 2MB");
      e.target.value = "";
      return;
    }
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          }),
      ),
    ).then((selectedImages) =>
      setForm((current) => ({
        ...current,
        images: [...current.images, ...selectedImages],
      })),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) {
      alert("Please select at least one image");
      return;
    }
    setUploading(true);
    try {
      await Promise.all(
        form.images.map((image, index) =>
          createGalleryImage({
            image,
            title:
              form.images.length === 1
                ? form.title || "Gallery Image"
                : `${form.title || "Gallery Image"} ${index + 1}`,
            description: form.description,
            category: form.category || "General",
          }),
        ),
      );
      alert(`✅ ${form.images.length} image(s) saved to gallery!`);
      setForm({
        images: [],
        title: "",
        description: "",
        category: "General",
      });
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

  const handleCreateFolder = () => {
    const name = window.prompt("Folder name");
    if (!name) return;
    const folderName = name.trim();
    if (!folderName) return;
    if (folders.some((folder) => folder.toLowerCase() === folderName.toLowerCase())) {
      alert("This folder already exists.");
      return;
    }
    const updated = [...customFolders, folderName];
    setCustomFolders(updated);
    localStorage.setItem("rpsf_gallery_folders", JSON.stringify(updated));
    setForm((current) => ({ ...current, category: folderName }));
  };

  const folders = [
    ...new Set([
      "General",
      ...customFolders,
      ...images.map((img) => img.category).filter(Boolean),
    ]),
  ];
  const visibleImages =
    selectedFolder === "All"
      ? images
      : images.filter((img) => (img.category || "General") === selectedFolder);

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
              <label>Folder</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      category: e.target.value,
                    }))
                  }
                  style={{
                    height: "42px",
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(212,175,55,0.25)",
                    background: "var(--card-bg)",
                    color: "var(--ink)",
                  }}
                >
                  {folders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={handleCreateFolder}
                >
                  + Create Folder
                </button>
              </div>
            </div>
            <div className="form-field full-width">
              <label>Photo</label>
              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                multiple
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

            <div className="form-field full-width">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    title: e.target.value,
                  }))
                }
                placeholder="Event or folder title"
                style={{ width: "100%", height: "42px" }}
              />
            </div>

            <div className="form-field full-width">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                placeholder="Add a short description for these photos"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            {form.images.length > 0 && (
              <div className="form-field full-width">
                <label>Selected Photos ({form.images.length})</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 180px))",
                    gap: "12px",
                  }}
                >
                  {form.images.map((image, index) => (
                    <div
                      key={`${index}-${image.slice(-20)}`}
                      style={{
                        position: "relative",
                        padding: "8px",
                        border: "1px solid rgba(212,175,55,0.35)",
                        borderRadius: "10px",
                        background: "var(--card-bg)",
                        boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            images: current.images.filter((_, i) => i !== index),
                          }))
                        }
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#b91c1c",
                          color: "white",
                          cursor: "pointer",
                        }}
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
          <h2>All Images ({visibleImages.length})</h2>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="filter-select"
            aria-label="Filter gallery folder"
          >
            <option value="All">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {folders.map((folder) => {
            const count = images.filter(
              (img) => (img.category || "General") === folder,
            ).length;
            return (
              <button
                type="button"
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  minWidth: "130px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border:
                    selectedFolder === folder
                      ? "2px solid #d4af37"
                      : "1px solid rgba(212,175,55,0.25)",
                  background:
                    selectedFolder === folder
                      ? "rgba(212,175,55,0.12)"
                      : "var(--card-bg)",
                  color: "var(--ink)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <strong>📁 {folder}</strong>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  {count} {count === 1 ? "image" : "images"}
                </div>
              </button>
            );
          })}
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--gold)" }}>
            Loading...
          </p>
        ) : visibleImages.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              padding: "40px",
              fontStyle: "italic",
            }}
          >
            {selectedFolder === "All"
              ? "No images yet. Upload your first image above."
              : `No images in the "${selectedFolder}" folder.`}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {visibleImages.map((img) => (
              <article
                key={img._id}
                style={{
                  overflow: "hidden",
                  borderRadius: "12px",
                  border: "1px solid rgba(212,175,55,0.35)",
                  background: "var(--card-bg)",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.10)",
                }}
              >
                <img
                  src={img.image}
                  alt={img.title || "Gallery"}
                  style={{
                    width: "100%",
                    height: "190px",
                    display: "block",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div style={{ padding: "14px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      marginBottom: "8px",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "rgba(212,175,55,0.12)",
                      color: "#a67c00",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    📁 {img.category || "General"}
                  </div>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "16px",
                      color: "var(--ink)",
                    }}
                  >
                    {img.title || "Gallery Image"}
                  </h3>
                  {img.description && (
                    <p
                      style={{
                        margin: "0 0 12px",
                        minHeight: "38px",
                        fontSize: "13px",
                        lineHeight: 1.45,
                        color: "var(--muted)",
                      }}
                    >
                      {img.description}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(img._id)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "7px",
                      border: "1px solid #ef4444",
                      background: "transparent",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
