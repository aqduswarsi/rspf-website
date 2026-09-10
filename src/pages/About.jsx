import './About.css';

const timeline = [
  { year: '1957', event: 'Watch & Ward force established under Indian Railways.' },
  { year: '1985', event: 'Renamed to Railway Protection Force (RPF) under RPF Act 1957.' },
  { year: '2003', event: 'Granted armed force status under Indian Railways Act.' },
  { year: '2018', event: 'RPSF (Railway Protection Special Force) expanded operations.' },
  { year: '2022', event: 'Operation NANHE FARISHTE rescues 80,000+ children.' },
  { year: '2024', event: 'RPSF modernised with cyber cells, FRS and geo-fencing technology.' },
];

const leadership = [
  { name: 'Director General', badge: 'DG / RPSF', initials: 'DG' },
  { name: 'Addl. Director General (Ops)', badge: 'ADG / Operations', initials: 'ADG' },
  { name: 'Inspector General (HQ)', badge: 'IG / HQ', initials: 'IG' },
];

const zones = ['NR', 'NCR', 'NER', 'NFR', 'NWR', 'CR', 'WR', 'WCR', 'SR', 'SCR', 'SER', 'SECR', 'SWR', 'ER', 'ECR', 'ECOR', 'Metro', 'RPSF'];

export default function About() {
  return (
    <div className="about-page page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="page-hero-logo" />
          <h1>About <span>RPSF</span></h1>
          <p>RAILWAY PROTECTION SPECIAL FORCE — Guardians of India's Iron Roads</p>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span>About</span>
          </nav>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="mv-section">
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To protect and safeguard railway passengers, railway property, and assets of Indian Railways through disciplined, efficient, and responsive security services across all 18 railway zones.</p>
          </div>
          <div className="mv-card featured">
            <div className="mv-icon">🦅</div>
            <h3>Our Vision</h3>
            <p>To become India's most trusted and technologically advanced railway security force — ensuring every passenger travels safely, confidently, and comfortably across the world's 4th largest railway network.</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">⚖️</div>
            <h3>Core Values</h3>
            <ul className="values-list">
              <li>🔸 Integrity &amp; Honesty</li>
              <li>🔸 Discipline &amp; Duty</li>
              <li>🔸 Courage &amp; Valor</li>
              <li>🔸 Service to Nation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="timeline-section">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>OUR JOURNEY</p>
        <h2 className="section-title">History of the Force</h2>
        <div className="divider" />
        <div className="timeline">
          {timeline.map((item, i) => (
            <div className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`} key={i}>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-year">{item.year}</span>
                <p>{item.event}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
      </section>

      {/* Leadership */}
      <section className="leadership-section">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>COMMAND STRUCTURE</p>
        <h2 className="section-title">Senior Leadership</h2>
        <div className="divider" />
        <div className="leadership-grid">
          {leadership.map((l, i) => (
            <div className="leader-card" key={i}>
              <div className="leader-avatar">
                <span>{l.initials}</span>
              </div>
              <div className="leader-badge">{l.badge}</div>
              <h4>{l.name}</h4>
              <p>RAILWAY PROTECTION SPECIAL FORCE</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zonal Network */}
      <section className="zones-section">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>NETWORK</p>
        <h2 className="section-title">Zonal Coverage</h2>
        <div className="divider" />
        <p className="section-sub">RPSF operates across all 18 Indian Railway zones</p>
        <div className="zones-grid">
          {zones.map((z, i) => (
            <div className="zone-tag" key={i}>{z}</div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>MILESTONES</p>
        <h2 className="section-title">Notable Achievements</h2>
        <div className="divider" />
        <div className="achievements-grid">
          {[
            { icon: '👶', title: '87,000+', sub: 'Children Rescued', desc: 'Operation NANHE FARISHTE has rescued over 87,000 trafficked children from railway stations.' },
            { icon: '💰', title: '₹500 Cr+', sub: 'Property Recovered', desc: 'Stolen railway and passenger property worth ₹500 crores recovered in 2023-24.' },
            { icon: '🔒', title: '1.2L+', sub: 'Arrests (2024)', desc: 'Over 1.2 lakh persons arrested for various offences on Indian Railways in 2024.' },
            { icon: '👩', title: '3,000+', sub: 'Women Escorted', desc: 'Meri Saheli initiative has escorted thousands of solo women travellers safely.' },
          ].map((a, i) => (
            <div className="achievement-card" key={i}>
              <div className="ach-icon">{a.icon}</div>
              <h3>{a.title}</h3>
              <h4>{a.sub}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
