import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('rpsf_login_logged_in') === 'true');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="nav-title">RPSF</span>
            <span className="nav-subtitle">RAILWAY PROTECTION SPECIAL FORCE</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
                <span className="nav-link-underline" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Single Right CTA Button */}
        <Link to={isLoggedIn ? '/login' : '/login'} className="nav-cta">
          {isLoggedIn ? (
            <><span>⚙️</span> Dashboard</>
          ) : (
            <><span>🔐</span> Login</>
          )}
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to={isLoggedIn ? '/login' : '/login'}
          className={`mobile-link ${location.pathname === '/login' || location.pathname === '/login' ? 'active' : ''}`}
        >
          {isLoggedIn ? 'Dashboard' : 'Login'}
        </Link>
      </div>
    </nav>
  );
}
