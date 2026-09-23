import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import { getUserProfile, updateUserProfile } from "../utils/api";

const initialForm = {
  photo: "",
  nameEnglish: "",
  nameHindi: "",
  fatherNameEnglish: "",
  fatherNameHindi: "",
  motherNameEnglish: "",
  motherNameHindi: "",
  mobileNumber: "",
  alternateMobile: "",
  mobileWhatsapp: "",
  alternateWhatsapp: "",
  email: "",
  presentAddress: "",
  presentPinCode: "",
  permanentAddress: "",
  permanentPinCode: "",
  state: "",
  bloodGroup: "",
  religion: "",
  category: "",
  caste: "",
};

export default function UserProfileUpdate() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rpsf_user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const load = async () => {
    try {
      const data = await getUserProfile();
      setForm({
        photo: data.photo || "",
        nameEnglish: data.nameEnglish || "",
        nameHindi: data.nameHindi || "",
        fatherNameEnglish: data.fatherNameEnglish || "",
        fatherNameHindi: data.fatherNameHindi || "",
        motherNameEnglish: data.motherNameEnglish || "",
        motherNameHindi: data.motherNameHindi || "",
        mobileNumber: data.mobileNumber || "",
        alternateMobile: data.alternateMobile || "",
        mobileWhatsapp: data.mobileWhatsapp || "",
        alternateWhatsapp: data.alternateWhatsapp || "",
        email: data.email || "",
        presentAddress: data.presentAddress || "",
        presentPinCode: data.presentPinCode || "",
        permanentAddress: data.permanentAddress || "",
        permanentPinCode: data.permanentPinCode || "",
        state: data.state || "",
        bloodGroup: data.bloodGroup || "",
        religion: data.religion || "",
        category: data.category || "",
        caste: data.caste || "",
      });
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setMessage({ text: "", type: "" });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Please select a valid image", type: "error" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "Image size should be less than 2MB", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({ ...form, photo: event.target.result });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = { ...form };
      await updateUserProfile(payload);
      setMessage({ text: "✅ Profile updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "❌ " + err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all changes?")) {
      load();
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="admin-main">
          <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="admin-content">
            <div
              style={{
                padding: "80px",
                textAlign: "center",
                color: "var(--gold)",
              }}
            >
              Loading...
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <UserTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="admin-content">
          <div className="form-page bio-form-page">
            <div className="bio-form-header">
              <h2>UPDATE PROFILE</h2>
              <p>Keep your personal information up to date</p>
            </div>

            <form onSubmit={handleSubmit} className="bio-form">
              {/* ==================== PHOTO ==================== */}
              <div className="bio-section photo-upload-section">
                <h3>Profile Photo</h3>
                <div className="photo-upload-wrap">
                  {form.photo ? (
                    <div className="photo-preview-box">
                      <img
                        src={form.photo}
                        alt="Profile"
                        className="photo-preview"
                      />
                    </div>
                  ) : (
                    <label className="photo-dropzone">
                      <div className="photo-drop-icon">📷</div>
                      <span className="photo-drop-text">Upload Photo</span>
                      <small>JPG, PNG — Max 2MB</small>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        hidden
                      />
                    </label>
                  )}
                  <div className="photo-info">
                    <p>
                      <strong>Change Photo</strong>
                    </p>
                    <ul>
                      <li>Passport size photo</li>
                      <li>Recent, clear, front-facing</li>
                      <li>Max file size: 2MB</li>
                    </ul>
                    {form.photo && (
                      <label
                        className="btn-reset"
                        style={{
                          display: "inline-block",
                          marginTop: "12px",
                          padding: "8px 16px",
                          cursor: "pointer",
                          borderRadius: "8px",
                        }}
                      >
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* ==================== NAME & PARENTS ==================== */}
              <div className="bio-section">
                <h3>Name &amp; Parents</h3>
                <div className="bio-grid">
                  <div className="form-field">
                    <label>Name (English)</label>
                    <input
                      name="nameEnglish"
                      value={form.nameEnglish}
                      onChange={handleChange}
                      placeholder="Full name in English"
                    />
                  </div>
                  <div className="form-field">
                    <label>Name (हिंदी)</label>
                    <input
                      name="nameHindi"
                      value={form.nameHindi}
                      onChange={handleChange}
                      placeholder="हिंदी में नाम"
                    />
                  </div>
                  <div className="form-field">
                    <label>Father's Name (English)</label>
                    <input
                      name="fatherNameEnglish"
                      value={form.fatherNameEnglish}
                      onChange={handleChange}
                      placeholder="Father's name"
                    />
                  </div>
                  <div className="form-field">
                    <label>Father's Name (हिंदी)</label>
                    <input
                      name="fatherNameHindi"
                      value={form.fatherNameHindi}
                      onChange={handleChange}
                      placeholder="पिता का नाम"
                    />
                  </div>
                  <div className="form-field">
                    <label>Mother's Name (English)</label>
                    <input
                      name="motherNameEnglish"
                      value={form.motherNameEnglish}
                      onChange={handleChange}
                      placeholder="Mother's name"
                    />
                  </div>
                  <div className="form-field">
                    <label>Mother's Name (हिंदी)</label>
                    <input
                      name="motherNameHindi"
                      value={form.motherNameHindi}
                      onChange={handleChange}
                      placeholder="माता का नाम"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== CONTACT ==================== */}
              <div className="bio-section">
                <h3>Contact Information</h3>
                <div className="bio-grid">
                  <div className="form-field">
                    <label>Mobile Number</label>
                    <input
                      name="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <div className="whatsapp-radio">
                      <span>WhatsApp:</span>
                      <label className="inline-check">
                        <input
                          type="radio"
                          name="mobileWhatsapp"
                          value="Y"
                          checked={form.mobileWhatsapp === "Y"}
                          onChange={handleChange}
                        />{" "}
                        Y
                      </label>
                      <label className="inline-check">
                        <input
                          type="radio"
                          name="mobileWhatsapp"
                          value="N"
                          checked={form.mobileWhatsapp === "N"}
                          onChange={handleChange}
                        />{" "}
                        N
                      </label>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Alternate Mobile</label>
                    <input
                      name="alternateMobile"
                      value={form.alternateMobile}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <div className="whatsapp-radio">
                      <span>WhatsApp:</span>
                      <label className="inline-check">
                        <input
                          type="radio"
                          name="alternateWhatsapp"
                          value="Y"
                          checked={form.alternateWhatsapp === "Y"}
                          onChange={handleChange}
                        />{" "}
                        Y
                      </label>
                      <label className="inline-check">
                        <input
                          type="radio"
                          name="alternateWhatsapp"
                          value="N"
                          checked={form.alternateWhatsapp === "N"}
                          onChange={handleChange}
                        />{" "}
                        N
                      </label>
                    </div>
                  </div>
                  <div className="form-field full-width">
                    <label>Email ID</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== ADDRESS ==================== */}
              <div className="bio-section">
                <h3>Address</h3>
                <div className="bio-grid">
                  <div className="form-field full-width">
                    <label>Present Address</label>
                    <textarea
                      name="presentAddress"
                      value={form.presentAddress}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Current address..."
                    />
                  </div>
                  <div className="form-field">
                    <label>Present Pin Code</label>
                    <input
                      name="presentPinCode"
                      value={form.presentPinCode}
                      onChange={handleChange}
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Permanent Address</label>
                    <textarea
                      name="permanentAddress"
                      value={form.permanentAddress}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Permanent address..."
                    />
                  </div>
                  <div className="form-field">
                    <label>Permanent Pin Code</label>
                    <input
                      name="permanentPinCode"
                      value={form.permanentPinCode}
                      onChange={handleChange}
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                  </div>
                  <div className="form-field">
                    <label>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>

              {/* ==================== CATEGORY ==================== */}
              <div className="bio-section">
                <h3>Other Details</h3>
                <div className="bio-grid">
                  <div className="form-field">
                    <label>Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Religion</label>
                    <input
                      name="religion"
                      value={form.religion}
                      onChange={handleChange}
                      placeholder="Religion"
                    />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>General</option>
                      <option>OBC</option>
                      <option>SC</option>
                      <option>ST</option>
                      <option>EWS</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Caste</label>
                    <input
                      name="caste"
                      value={form.caste}
                      onChange={handleChange}
                      placeholder="Caste"
                    />
                  </div>
                </div>
              </div>

              {message.text && (
                <div
                  className="form-error"
                  style={{
                    background:
                      message.type === "success"
                        ? "rgba(74,222,128,0.15)"
                        : "rgba(239,68,68,0.15)",
                    borderColor:
                      message.type === "success" ? "#4ade80" : "#ef4444",
                    color: message.type === "success" ? "#4ade80" : "#ef4444",
                  }}
                >
                  {message.text}
                </div>
              )}

              <div className="bio-form-actions">
                <button
                  type="button"
                  className="btn-reset"
                  onClick={handleReset}
                  disabled={saving}
                >
                  Reset
                </button>
                <button type="submit" className="primary" disabled={saving}>
                  {saving ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
