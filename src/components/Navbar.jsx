import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About RPSF" },
    { to: "/contact", label: "Contact Us" },
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <img src="/rpsf-logo.jpg" alt="RPSF" className="nav-logo" />
          <div className="nav-brand-text">
            <span className="nav-title">RPSF</span>
            <span className="nav-subtitle">Security Force</span>
          </div>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              {link.label}
              <span className="nav-link-underline" />
            </NavLink>
          ))}
        </nav>

        <Link to="/login" className="nav-cta" onClick={closeMenu}>
          Employee Portal
        </Link>

        <button
          type="button"
          className={`hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/login" className="mobile-link" onClick={closeMenu}>
          Employee Portal
        </Link>
      </div>
    </header>
  );
}
