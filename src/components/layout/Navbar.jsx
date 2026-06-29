// src/components/layout/Navbar.jsx

import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../../styles/navbar.css';

const LOGO = 'https://petals1023fm.com/wp-content/uploads/2024/09/petals_logo_copy-removebg-preview.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/management', label: 'Management' },
  { to: '/oaps', label: 'OAPs' },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navClass = `navbar ${isHome ? (scrolled ? 'scrolled' : 'top') : 'solid'}`;

  return (
    <>
      <nav className={navClass}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src={LOGO} alt="Petals 102.3 FM" />
          </Link>

          <div className="navbar-links">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <a
            href="https://radio.fmmaria.com:8070/radio.mp3"
            target="_blank"
            rel="noreferrer"
            className="navbar-live"
          >
            <span className="live-dot" />
            Live
          </a>

          <button
            className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? 'active' : ''}
            end={to === '/'}
          >
            {label}
          </NavLink>
        ))}
        <a
          href="https://radio.fmmaria.com:8070/radio.mp3"
          target="_blank"
          rel="noreferrer"
          className="mobile-live"
        >
          🔴 Listen Live Now
        </a>
      </div>
    </>
  );
}