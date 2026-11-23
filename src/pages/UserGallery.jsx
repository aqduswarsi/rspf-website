import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublishedGalleryImages } from "../utils/api";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";

export default function UserGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("rpsf_user_token")) {
      navigate("/login");
      return;
    }

    getPublishedGalleryImages()
      .then(setImages)
      .catch((err) => setError(err.message || "Failed to load gallery"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const folders = useMemo(() => {
    const grouped = new Map();
    images.forEach((image) => {
      const name = image.category || "General";
      if (!grouped.has(name)) {
        grouped.set(name, {
          name,
          description: image.folderDescription || "",
          images: [],
        });
      }
      grouped.get(name).images.push(image);
    });
    return [...grouped.values()];
  }, [images]);

  const folder = folders.find((item) => item.name === selectedFolder);
  const shownImages = folder?.images || [];

  useEffect(() => {
    if (!selectedImage) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImage]);

  return (
    <div className="admin-layout">
      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="admin-content">
          <section className="education-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Member Gallery</p>
            <h2>{folder ? folder.name : "Gallery"}</h2>
            <p>
              {folder?.description ||
                "Photos shared by the RPSF Training Centre."}
            </p>
          </div>
          {folder && (
            <button
              type="button"
              className="table-action"
              onClick={() => setSelectedFolder("")}
            >
              ← All Folders
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading gallery...</p>
        ) : error ? (
          <p style={{ color: "#b91c1c" }}>{error}</p>
        ) : !folder && folders.length === 0 ? (
          <div className="education-panel">
            Gallery photos will appear here when published by the admin.
          </div>
        ) : !folder ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {folders.map((item) => (
              <button
                type="button"
                key={item.name}
                onClick={() => setSelectedFolder(item.name)}
                className="education-panel"
                style={{
                  padding: "20px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--ink)",
                }}
              >
                <strong style={{ fontSize: "18px" }}>📁 {item.name}</strong>
                <p style={{ margin: "8px 0", color: "var(--muted)" }}>
                  {item.description || " "}
                </p>
                <span>{item.images.length} photos</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {shownImages.map((image) => (
              <article
                key={image._id}
                className="education-panel"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    cursor: "zoom-in",
                  }}
                  aria-label={`Open ${image.title || "gallery image"}`}
                >
                  <img
                    src={image.image}
                    alt={image.title || folder.name}
                    style={{
                      width: "100%",
                      height: "210px",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </button>
                <div style={{ padding: "14px" }}>
                  <h3 style={{ margin: "0 0 6px" }}>
                    {image.title || "Gallery Image"}
                  </h3>
                  {image.description && (
                    <p style={{ margin: 0, color: "var(--muted)" }}>
                      {image.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
          </section>
        </main>
      </div>
      {selectedImage && (
        <div
          role="presentation"
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(0,0,0,0.92)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title || "Gallery image preview"}
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image preview"
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                zIndex: 1,
                width: "40px",
                height: "40px",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: "50%",
                background: "#111827",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title || "Gallery image"}
              style={{
                display: "block",
                maxWidth: "min(95vw, 1400px)",
                maxHeight: "82vh",
                objectFit: "contain",
                borderRadius: "6px",
              }}
            />
            {(selectedImage.title || selectedImage.description) && (
              <div style={{ padding: "12px", color: "white", textAlign: "center" }}>
                {selectedImage.title && <strong>{selectedImage.title}</strong>}
                {selectedImage.description && (
                  <p style={{ margin: "4px 0 0", color: "#d1d5db" }}>
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
