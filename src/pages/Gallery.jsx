import { useState, useEffect } from "react";
import {
  createGalleryImage,
  getAllGalleryImages,
  getGalleryFolders,
  createGalleryFolder,
  updateGalleryFolder,
  deleteGalleryFolder,
  updateGalleryImage,
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
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const [imageData, folderData] = await Promise.all([
        getAllGalleryImages(),
        getGalleryFolders(),
      ]);
      setImages(imageData);
      setFolders(folderData);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }

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
      await loadImages();
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
      await loadImages();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleCreateFolder = async () => {
    const name = window.prompt("Folder name");
    if (!name) return;
    const folderName = name.trim();
    if (!folderName) return;
    const description = window.prompt("Folder description (optional)") || "";
    try {
      const { data } = await createGalleryFolder({
        name: folderName,
        description,
      });
      await loadImages();
      setForm((current) => ({ ...current, category: data.name }));
      setSelectedFolder(data._id);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleRenameFolder = async (folder) => {
    const name = window.prompt("Folder name", folder.name);
    if (name === null) return;
    const updatedName = name.trim();
    if (!updatedName) {
      alert("Folder name cannot be empty.");
      return;
    }
    const description =
      window.prompt("Folder description", folder.description || "") ??
      folder.description;
    try {
      await updateGalleryFolder(folder._id, {
        name: updatedName,
        description,
      });
      await loadImages();
      setForm((current) =>
        current.category === folder.name
          ? { ...current, category: updatedName }
          : current,
      );
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleDeleteFolder = async (folder) => {
    const count = images.filter((image) => image.category === folder.name).length;
    if (
      !window.confirm(
        `Delete "${folder.name}" and all ${count} image(s) inside it? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await deleteGalleryFolder(folder._id);
      setSelectedFolder("All");
      setForm((current) =>
        current.category === folder.name
          ? { ...current, category: "General" }
          : current,
      );
      await loadImages();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleToggleFolderPublish = async (folder) => {
    try {
      await updateGalleryFolder(folder._id, {
        isPublished: !folder.isPublished,
      });
      await loadImages();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const handleToggleImagePublish = async (image) => {
    try {
      const result = await updateGalleryImage(image._id, {
        isPublished: !image.isPublished,
      });
      setImages((current) =>
        current.map((item) =>
          item._id === image._id ? result.data : item,
        ),
      );
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const activeFolder = folders.find((folder) => folder._id === selectedFolder);
  const visibleImages = activeFolder
    ? images.filter((image) => image.category === activeFolder.name)
    : images;

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
                    <option key={folder._id} value={folder.name}>
                      {folder.name}
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
          <h2>
            {activeFolder
              ? `${activeFolder.name} (${visibleImages.length})`
              : `Gallery Folders (${folders.length})`}
          </h2>
          {activeFolder && (
            <button
              type="button"
              className="table-action"
              onClick={() => setSelectedFolder("All")}
            >
              ← All Folders
            </button>
          )}
        </div>

        {error ? (
          <p style={{ color: "#b91c1c", padding: "16px" }}>{error}</p>
        ) : loading ? (
          <p style={{ textAlign: "center", color: "var(--gold)" }}>
            Loading...
          </p>
        ) : !activeFolder && folders.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {folders.map((folder) => {
              const count = images.filter(
                (image) => image.category === folder.name,
              ).length;
              return (
                <article
                  key={folder._id}
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border: "1px solid rgba(212,175,55,0.35)",
                    background: "var(--card-bg)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFolder(folder._id)}
                    style={{
                      width: "100%",
                      padding: 0,
                      border: 0,
                      background: "transparent",
                      color: "var(--ink)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <strong style={{ fontSize: "18px" }}>📁 {folder.name}</strong>
                    <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--muted)" }}>
                      {folder.description || "No description"}
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "12px" }}>
                      {count} {count === 1 ? "image" : "images"} ·{" "}
                      {folder.isPublished ? "Published" : "Not published"}
                    </div>
                  </button>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "14px",
                    }}
                  >
                    <button type="button" className="table-action" onClick={() => handleRenameFolder(folder)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="table-action"
                      onClick={() => handleToggleFolderPublish(folder)}
                    >
                      {folder.isPublished ? "Unpublish Folder" : "Publish Folder"}
                    </button>
                    <button
                      type="button"
                      className="table-action danger"
                      onClick={() => handleDeleteFolder(folder)}
                    >
                      Delete Folder
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : !activeFolder || visibleImages.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              padding: "40px",
              fontStyle: "italic",
            }}
          >
            {activeFolder
              ? `No images in the "${activeFolder.name}" folder.`
              : "No gallery folders yet. Create a folder above."}
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
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    {!activeFolder?.isPublished && (
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => handleToggleImagePublish(img)}
                      >
                        {img.isPublished ? "Unpublish Photo" : "Publish Photo"}
                      </button>
                    )}
                    <span
                      style={{
                        alignSelf: "center",
                        fontSize: "12px",
                        color: img.isPublished || activeFolder?.isPublished
                          ? "#15803d"
                          : "var(--muted)",
                      }}
                    >
                      {activeFolder?.isPublished
                        ? "Visible via published folder"
                        : img.isPublished
                          ? "Visible to users"
                        : "Admin only"}
                    </span>
                  </div>
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
