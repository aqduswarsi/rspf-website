import { useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("कृपया valid image चुनें");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImages([...images, ev.target.result]);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (!url.trim()) return;
    setImages([...images, url.trim()]);
    setUrl("");
  };

  const handleDelete = (i) => {
    if (!window.confirm("Delete this image?")) return;
    setImages(images.filter((_, idx) => idx !== i));
  };

  return (
    <div className="gallery-page">
      <h2>Gallery</h2>

      <div className="add-image-box">
        <label className="upload-btn">
          Upload Image
          <input type="file" accept="image/*" onChange={handleUpload} hidden />
        </label>
        <div className="url-add">
          <input
            placeholder="https://example.com/photo.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleAddUrl}>Add URL</button>
        </div>
      </div>

      <div className="gallery-grid">
        {images.map((img, i) => (
          <div key={i} className="gallery-item">
            <img src={img} alt={`Gallery ${i + 1}`} />
            <button className="btn-delete" onClick={() => handleDelete(i)}>
              Delete
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="empty-msg">No images yet. Upload or add URL above.</p>
        )}
      </div>
    </div>
  );
}
