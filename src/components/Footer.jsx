import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <img src="/rpsf-logo.jpg" alt="RPSF" className="footer-logo" />
            <h3>RPSF</h3>
            <p>RAILWAY PROTECTION SPECIAL FORCE</p>
            <p className="footer-motto">तपसा शौर्यसन्धानम्</p>
            <div className="footer-socials">
              <a href="https://twitter.com/rpf_india" target="_blank" rel="noreferrer" aria-label="Twitter">𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">📸</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About RPSF</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/login">Employee Portal</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Lost &amp; Found</a></li>
              <li><a href="#">Meri Saheli</a></li>
              <li><a href="#">Rail Madad</a></li>
              <li><a href="#">RTI Portal</a></li>
            </ul>
          </div>

          {/* Emergency */}
          <div className="footer-col">
            <h4>Emergency</h4>
            <div className="emergency-box">
              <div className="emergency-number">
                <span className="em-icon">🚨</span>
                <div>
                  <strong>Helpline</strong>
                  <span>182</span>
                </div>
              </div>
              <div className="emergency-number">
                <span className="em-icon">📞</span>
                <div>
                  <strong>HQ Delhi</strong>
                  <span>011-23387510</span>
                </div>
              </div>
              <div className="emergency-number">
                <span className="em-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <span>RPSF@gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 RAILWAY PROTECTION SPECIAL FORCE (RPSF) | Government of India</p>
          <p>Ministry of Railways | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
