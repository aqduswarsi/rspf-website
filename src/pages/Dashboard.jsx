import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeroImages, saveHeroImages, resetHeroImages, DEFAULT_HERO_IMAGES } from '../utils/heroImagesStore';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [previewSlide, setPreviewSlide] = useState(0);
  const [toast, setToast] = useState('');
  const loginName = localStorage.getItem('rpsf_login_name') || 'login';

  // Auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('rpsf_login_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Load images
  useEffect(() => {
    setImages(getHeroImages());

    const handleUpdate = (e) => {
      setImages(e.detail);
    };

    window.addEventListener('rpsf_hero_images_updated', handleUpdate);
    return () => window.removeEventListener('rpsf_hero_images_updated', handleUpdate);
  }, []);

  // Auto slide in live preview
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setPreviewSlide(prev => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('rpsf_login_logged_in');
    localStorage.removeItem('rpsf_login_name');
    navigate('/login');
  };

  // Add Image via URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const updated = [...images, newUrl.trim()];
    saveHeroImages(updated);
    setImages(updated);
    setNewUrl('');
    showToast('✅ New hero image URL added successfully!');
  };

  // Add Image via File Upload (Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Please select a valid image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      const updated = [...images, base64Url];
      saveHeroImages(updated);
      setImages(updated);
      showToast('✅ Image uploaded and added to Hero Slider!');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Delete Image
  const handleDelete = (index) => {
    if (images.length <= 1) {
      showToast('⚠️ Hero slider must have at least 1 image!');
      return;
    }
    const updated = images.filter((_, i) => i !== index);
    saveHeroImages(updated);
    setImages(updated);
    if (previewSlide >= updated.length) {
      setPreviewSlide(0);
    }
    showToast('🗑️ Slide deleted.');
  };

  // Move Image Up / Down
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    saveHeroImages(updated);
    setImages(updated);
    showToast('🔄 Slide order updated!');
  };

  // Reset to Default
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to the default 5 RPSF hero images?')) {
      resetHeroImages();
      setImages(DEFAULT_HERO_IMAGES);
      setPreviewSlide(0);
      showToast('✨ Reset to default RPSF hero images!');
    }
  };

  return (
    <div className="login-dashboard page-wrapper">
      {/* Toast Notification */}
      {toast && <div className="login-toast">{toast}</div>}

      <div className="login-container">
        {/* Header */}
        <header className="login-header">
          <div className="login-brand">
            <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="login-logo" />
            <div>
              <h1>RPSF Command Center</h1>
              <p>Hero Slider &amp; Website Content loginistration</p>
            </div>
          </div>
          <div className="login-user-box">
            <div className="login-badge">
              <span className="online-dot" />
              <span>Logged in as: <strong>{loginName}</strong></span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="login-grid">
          {/* Main Controls Panel */}
          <div className="login-main-panel">
            <div className="panel-card">
              <div className="panel-title-bar">
                <h2>🖼️ Hero Slider Images ({images.length})</h2>
                <button onClick={handleReset} className="btn-secondary-sm">
                  🔄 Restore Default Images
                </button>
              </div>

              {/* Add New Image Forms */}
              <div className="add-image-box">
                <h3>➕ Add New Hero Slide Image</h3>

                <div className="add-options-grid">
                  {/* File Upload Form */}
                  <div className="upload-option">
                    <label className="upload-dropzone">
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">Upload Image from PC</span>
                      <small>Click to browse JPEG, PNG, WEBP</small>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="file-input-hidden"
                      />
                    </label>
                  </div>

                  {/* URL Input Form */}
                  <form onSubmit={handleAddUrl} className="url-option">
                    <label htmlFor="image-url-input">🌐 Add via Image URL:</label>
                    <div className="url-input-wrap">
                      <input
                        id="image-url-input"
                        type="url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                      <button type="submit" className="btn-add">Add URL</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Slide Cards Grid */}
              <div className="slides-grid">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`slide-manage-card ${index === previewSlide ? 'preview-active' : ''}`}
                  >
                    <div className="slide-card-header">
                      <span className="slide-num">Slide #{index + 1}</span>
                      {index === previewSlide && <span className="preview-badge">Live Previewing</span>}
                    </div>

                    <div className="slide-img-preview">
                      <img src={img} alt={`Slide ${index + 1}`} />
                    </div>

                    <div className="slide-card-actions">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        className="btn-icon"
                        title="Move Left/Up"
                      >
                        ⬅️
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={index === images.length - 1}
                        className="btn-icon"
                        title="Move Right/Down"
                      >
                        ➡️
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="btn-icon delete"
                        title="Delete Slide"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Preview Panel */}
          <div className="login-side-panel">
            <div className="panel-card sticky-preview">
              <h2>👁️ Live Hero Slider Preview</h2>
              <p className="preview-subtitle">Real-time simulation of Home page Hero section</p>

              {images.length > 0 ? (
                <div className="login-hero-preview">
                  <img
                    src={images[previewSlide]}
                    alt={`Preview Slide ${previewSlide + 1}`}
                    className="login-preview-slide-img"
                  />
                  <div className="login-preview-overlay" />

                  <div className="login-preview-content">
                    <img src="/rpsf-logo.jpg" alt="RPSF" className="login-preview-logo" />
                    <h4>RPSF</h4>
                    <p>RAILWAY PROTECTION SPECIAL FORCE</p>
                  </div>

                  {/* Manual Controls in login Live Preview */}
                  <button
                    className="preview-arrow left"
                    onClick={() => setPreviewSlide((previewSlide - 1 + images.length) % images.length)}
                  >
                    ‹
                  </button>
                  <button
                    className="preview-arrow right"
                    onClick={() => setPreviewSlide((previewSlide + 1) % images.length)}
                  >
                    ›
                  </button>

                  <div className="preview-dots">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`p-dot ${i === previewSlide ? 'active' : ''}`}
                        onClick={() => setPreviewSlide(i)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-preview">No images to display. Add an image!</div>
              )}

              <div className="preview-info-box">
                <p><strong>Total Active Slides:</strong> {images.length}</p>
                <p><strong>Current Active Slide:</strong> #{previewSlide + 1}</p>
                <a href="/" target="_blank" rel="noreferrer" className="btn-view-live">
                  🌐 Open Live Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
