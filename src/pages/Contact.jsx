import { useState } from 'react';

const offices = [
  { zone: 'Headquarters', address: 'Security Directorate, Rail Bhavan, New Delhi – 110001', phone: '011-23387510', email: 'dg-rpf@gov.in' },
  { zone: 'Northern Railway', address: 'Baroda House, New Delhi – 110001', phone: '011-23386868', email: 'nr-rpf@gov.in' },
  { zone: 'Western Railway', address: 'Churchgate, Mumbai – 400020', phone: '022-22086868', email: 'wr-rpf@gov.in' },
  { zone: 'Southern Railway', address: 'Park Town, Chennai – 600003', phone: '044-25354868', email: 'sr-rpf@gov.in' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="contact-page page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="page-hero-logo" />
          <h1>Contact <span>RPSF</span></h1>
          <p>Get in touch with RPSF TRAINING CENTER RAJAHI CAMP GORAKHPUR</p>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span>Contact</span>
          </nav>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="quick-contact">
        <div className="quick-grid">
          <a href="tel:182" className="quick-card emergency-card">
            <div className="qc-icon">EMERGENCY</div>
            <h4>Emergency</h4>
            <span>182</span>
            <p>24×7 Railway Helpline</p>
          </a>
          <div className="quick-card">
            <div className="qc-icon">PHONE</div>
            <h4>Headquarters</h4>
            <span>011-23387510</span>
            <p>New Delhi HQ</p>
          </div>
          <div className="quick-card">
            <div className="qc-icon">EMAIL</div>
            <h4>Email</h4>
            <span>RPSF@gov.in</span>
            <p>Official Email</p>
          </div>
          <div className="quick-card">
            <div className="qc-icon">HOURS</div>
            <h4>Working Hours</h4>
            <span>24 × 7</span>
            <p>Always Available</p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        {/* Form */}
        <div className="contact-form-wrap">
          <p className="section-eyebrow">REACH OUT</p>
          <h2 className="section-title" style={{ textAlign: 'left' }}>Send a Message</h2>
          <div className="divider" style={{ margin: '1rem 0 2rem' }} />

          {submitted ? (
            <div className="success-box">
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting RPSF. Our team will respond within 2-3 working days.</p>
              <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">Full Name *</label>
                  <input id="c-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">Email Address *</label>
                  <input id="c-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number</label>
                  <input id="c-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-subject">Subject *</label>
                  <select id="c-subject" name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a subject</option>
                    <option>Lost &amp; Found Complaint</option>
                    <option>Safety Concern</option>
                    <option>RTI Request</option>
                    <option>Feedback / Suggestion</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-message">Message *</label>
                <textarea id="c-message" name="message" value={form.message} onChange={handleChange} placeholder="Describe your concern in detail..." rows={5} required />
              </div>
              <button type="submit" className={`contact-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? <span className="spinner" /> : <>Submit Message</>}
              </button>
            </form>
          )}
        </div>

        {/* Map / Info */}
        <div className="contact-info-wrap">
          <p className="section-eyebrow">FIND US</p>
          <h2 className="section-title" style={{ textAlign: 'left' }}>Office Locations</h2>
          <div className="divider" style={{ margin: '1rem 0 2rem' }} />

          <div className="offices-list">
            {offices.map((o, i) => (
              <div className="office-card" key={i}>
                <div className="office-card-header">
                  <span className="office-zone-badge">{o.zone}</span>
                </div>
                <p className="office-address">{o.address}</p>
                <div className="office-contacts">
                  <a href={`tel:${o.phone}`} className="office-contact-link">{o.phone}</a>
                  <a href={`mailto:${o.email}`} className="office-contact-link">{o.email}</a>
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="contact-social">
            <h4>Follow RPSF</h4>
            <div className="social-links">
              <a href="https://twitter.com/rpf_india" target="_blank" rel="noreferrer" className="social-btn twitter">𝕏 Twitter</a>
              <a href="https://www.facebook.com/people/RPF-INDIA/100064795897796" target="_blank" rel="noreferrer" className="social-btn facebook">f Facebook</a>
              <a href="https://www.instagram.com/rpf_india_official/" target="_blank" rel="noreferrer" className="social-btn instagram">Instagram</a>
              <a href="https://www.youtube.com/channel/UCBbWf0kco2N5v9R_6eeuSOA" target="_blank" rel="noreferrer" className="social-btn youtube">▶ YouTube</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
