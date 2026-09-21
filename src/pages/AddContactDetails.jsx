import { useState } from "react";

const initialData = {
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
};

export default function AddContactDetails() {
  const [form, setForm] = useState(initialData);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Contact details saved successfully.");
  };

  return (
    <div className="admin-page-panel">
      <div className="admin-page-header">
        <h2>Add Contact Details</h2>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-row-two">
          <div className="form-row-wide">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-row-wide">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="form-row-wide">
          <label>Address</label>
          <textarea
            name="address"
            rows="4"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter office address"
          />
        </div>

        <div className="form-row-wide">
          <label>WhatsApp / Contact</label>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="Enter WhatsApp or alternate contact"
          />
        </div>

        {message && <p className="admin-form-success">{message}</p>}

        <button type="submit" className="admin-primary-btn">
          Save Contact Details
        </button>
      </form>
    </div>
  );
}
