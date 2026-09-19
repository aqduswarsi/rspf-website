import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Personnel', value: 75000, suffix: '+' },
  { label: 'Zones Covered', value: 18, suffix: '' },
  { label: 'Arrests (2024)', value: 12000, suffix: '+' },
  { label: 'Children Rescued', value: 87000, suffix: '+' },
];

const services = [
  { icon: 'SECURITY', title: 'Railway Security', desc: 'Protecting passengers and railway property across 18 zones and 7,000+ stations.' },
  { icon: 'WOMEN SAFETY', title: 'Meri Saheli', desc: 'Dedicated women safety initiative ensuring safe travel for female passengers.' },
  { icon: 'CRIME PREVENTION', title: 'Crime Prevention', desc: 'Swift action against theft, trespassing, and anti-social elements on trains.' },
  { icon: 'LOST & FOUND', title: 'Lost & Found', desc: 'Comprehensive lost article tracking system for passengers.' },
  { icon: 'CHILD RESCUE', title: 'Child Rescue', desc: 'Operation NANHE FARISHTE rescuing trafficked children at railway stations.' },
  { icon: 'CYBER CELL', title: 'Cyber Cell', desc: 'Dedicated cyber crime cells in all zones to tackle digital threats.' },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { clearInterval(timer); setCount(target); }
          else setCount(Math.floor(current));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

import { getHeroImages } from '../utils/heroImagesStore';

export default function Home() {
  const [heroImages, setHeroImages] = useState(getHeroImages());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Load and listen to hero images from store
  useEffect(() => {
    setHeroImages(getHeroImages());

    const handleImagesUpdate = (e) => {
      setHeroImages(e.detail);
      setCurrentSlide(0);
    };

    window.addEventListener('rpsf_hero_images_updated', handleImagesUpdate);
    return () => window.removeEventListener('rpsf_hero_images_updated', handleImagesUpdate);
  }, []);

  // Auto sliding timer (pauses when user hovers or interacts)
  useEffect(() => {
    if (isPaused || heroImages.length === 0) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [isPaused, heroImages]);

  const nextSlide = () => {
    if (heroImages.length === 0) return;
    setCurrentSlide((currentSlide + 1) % heroImages.length);
  };

  const prevSlide = () => {
    if (heroImages.length === 0) return;
    setCurrentSlide((currentSlide - 1 + heroImages.length) % heroImages.length);
  };

  // Touch & Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide(); // Swipe Left -> Next Slide
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide(); // Swipe Right -> Prev Slide
    }
  };

  return (
    <div className="home page-wrapper">
      {/* Hero */}
      <section
        className="hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="hero-slider">
          {heroImages.map((img, index) => (
            <div
              key={`${img}-${index}`}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                src={img}
                alt={`RPSF Hero Banner ${index + 1}`}
                className="hero-slide-img"
              />
            </div>
          ))}
        </div>
        <div className="hero-bg">
          <div className="hero-overlay" />
          <div className="hero-pattern" />
        </div>

        {/* Slider Navigation Controls */}
        {heroImages.length > 1 && (
          <>
            <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous Slide">‹</button>
            <button className="slider-arrow next" onClick={nextSlide} aria-label="Next Slide">›</button>

            {/* Slider Dots */}
            <div className="slider-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="hero-content">
          <div className="hero-badge">🇮🇳 Government of India — Ministry of Railways</div>
          <div className="hero-logo-wrap">
            <img src="/rpsf-logo.jpg" alt="RPSF Logo" className="hero-logo" />
          </div>
          <h1 className="hero-title">
            <span className="hero-title-main">RPSF</span>
            <span className="hero-title-sub">RPSF TRAINING CENTER RAJAHI CAMP GORAKHPUR</span>
          </h1>
          <p className="hero-tagline">रेलवे सुरक्षा विशेष बल</p>
          <p className="hero-motto">तपसा शौर्यसन्धानम् — Through Discipline, Valour &amp; Dedication</p>
          <div className="hero-actions">
            <a href="/about" className="btn-primary">Explore RPSF</a>
            <a href="/contact" className="btn-outline">Contact Us</a>
          </div>
          <div className="hero-scroll">
            <div className="scroll-indicator">
              <span />
            </div>
            <small>Scroll Down</small>
          </div>
        </div>
        <div className="hero-gradient-bottom" />
      </section>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-label">NOTICE</div>
        <div className="ticker-track">
          <div className="ticker-content">
            &nbsp;&nbsp;• Admit Card Link for CBT Examination – ASI Promotion 2024 &nbsp;&nbsp;•&nbsp;&nbsp;
            Centralized Selection for ASI (Exe.) – All Zonal Railways – Results Published &nbsp;&nbsp;•&nbsp;&nbsp;
            Operation NANHE FARISHTE: 87,000+ Children Rescued Since Inception &nbsp;&nbsp;•&nbsp;&nbsp;
            New Cyber Crime Cells Operational in All 18 Zones &nbsp;&nbsp;•&nbsp;&nbsp;
            Rail Madad App Updated – Download Now &nbsp;&nbsp;•&nbsp;&nbsp;
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-number">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* About Banner */}
      <section className="about-banner">
        <div className="about-banner-content">
          <div className="about-banner-text">
            <p className="section-eyebrow">WHO WE ARE</p>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Guardians of Indian Railways</h2>
            <div className="divider" style={{ margin: '1rem 0 1.5rem' }} />
            <p>The RPSF TRAINING CENTER RAJAHI CAMP GORAKHPUR (RPSF) is India's elite armed force dedicated to protecting railway passengers, property, and assets. Operating across <strong>18 zonal railways</strong>, 7,000+ stations, and covering India's <strong>67,956 km</strong> railway network.</p>
            <p>Established to ensure the safety and security of railway passengers and property, RPSF personnel serve with unmatched dedication — 24×7, 365 days a year.</p>
            <a href="/about" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Learn More</a>
          </div>
          <div className="about-banner-visual">
            <div className="shield-wrap">
              <img src="/rpsf-logo.jpg" alt="RPSF Shield" className="shield-img" />
              <div className="shield-ring ring-1" />
              <div className="shield-ring ring-2" />
              <div className="shield-ring ring-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>WHAT WE DO</p>
        <h2 className="section-title">Our Services</h2>
        <div className="divider" />
        <p className="section-sub">Comprehensive security solutions across India's vast railway network</p>
        <div className="services-grid">
          {services.map((svc, i) => (
            <div className="service-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="service-icon">{svc.icon}</div>
              <h3>{svc.title}</h3>
              <p>{svc.desc}</p>
              <div className="service-hover-line" />
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="emergency-section">
        <div className="emergency-content">
          <div className="emergency-pulse">!</div>
          <div>
            <h3>Emergency Helpline</h3>
            <p>Available 24×7 across all railway zones</p>
          </div>
          <div className="emergency-num">182</div>
          <a href="tel:182" className="btn-emergency">Call Now</a>
        </div>
      </section>
    </div>
  );
}
