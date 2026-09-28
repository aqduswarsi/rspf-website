import { useState, useEffect } from "react";
import { getContactDetails, updateContactDetails } from "../utils/api";

export default function AddContactDetails() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const data = await getContactDetails();
      setForm({
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        whatsapp: data.whatsapp || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateContactDetails(form);
      setMessage("✅ Contact details saved successfully!");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="education-page">
        <p
          style={{ padding: "40px", textAlign: "center", color: "var(--gold)" }}
        >
          Loading...
        </p>
      </section>
    );
  }

  return (
    <section className="education-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Add Contact Details</h2>
          <p>Manage RPSF contact information shown on the website.</p>
        </div>
      </div>

      <div className="education-panel education-form-panel">
        <form onSubmit={handleSubmit} className="education-form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label htmlFor="contact-phone">Phone</label>
              <input
                id="contact-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <label htmlFor="contact-address">Address</label>
          <textarea
            id="contact-address"
            name="address"
            rows="4"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter office address"
          />

          <label htmlFor="contact-whatsapp">WhatsApp / Contact</label>
          <input
            id="contact-whatsapp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="Enter WhatsApp or alternate contact"
          />

          <div style={{ marginTop: "10px" }}>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Contact Details"}
            </button>
          </div>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}
