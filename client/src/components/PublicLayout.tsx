import { createContext, FormEvent, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { api } from '../api';
import { defaultSettings, Settings } from '../types';
import { IconFacebook, IconMail, IconMenu, IconPhone, IconPin, IconSearch, Mark } from './ui';

const SettingsContext = createContext<Settings>(defaultSettings);
export function useSettings() {
  return useContext(SettingsContext);
}

const aboutLinks = [
  { to: '/about', label: 'Our story' },
  { to: '/about#bearers', label: 'Office bearers' },
  { to: '/club-house', label: 'Club house' },
];

const projectLinks = [
  { to: '/projects', label: 'All projects' },
  { to: '/projects?category=Vision', label: 'Vision' },
  { to: '/projects?category=Youth', label: 'Youth' },
  { to: '/projects?category=Health', label: 'Health' },
  { to: '/projects?category=Community', label: 'Community' },
];

function Menu({ label, links }: { label: string; links: { to: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`menu ${open ? 'open' : ''}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="nav-link" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {label}
        <span aria-hidden="true">▾</span>
      </button>
      <div className="menu-panel">
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function PublicLayout() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    api<Settings>('/api/settings').then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-lock', open);
    return () => document.body.classList.remove('nav-lock');
  }, [open]);

  const phones = [settings.phone, settings.phoneAlt].filter(Boolean).join(' / ');

  return (
    <SettingsContext.Provider value={settings}>
      <a className="skip" href="#content">Skip to content</a>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="top-links">
            {phones ? (
              <a className="top-link" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
                <IconPhone /> {phones}
              </a>
            ) : null}
            {settings.email ? (
              <a className="top-link" href={`mailto:${settings.email}`}>
                <IconMail /> {settings.email}
              </a>
            ) : null}
            {settings.address ? (
              <span className="top-link">
                <IconPin /> {settings.address}
              </span>
            ) : null}
          </div>
          <div className="top-actions">
            {settings.facebook ? (
              <a className="icon-btn" href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <IconFacebook />
              </a>
            ) : null}
            <button className="icon-btn" aria-label="Search the site" onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <Mark />
            <span>
              <strong>Lions Club of Nugegoda</strong>
              <em>{settings.tagline || 'We Serve'}</em>
            </span>
          </Link>
          <button className="nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
            <IconMenu open={open} />
          </button>
          <nav className={`nav ${open ? 'open' : ''}`}>
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <Menu label="About us" links={aboutLinks} />
            <Menu label="Projects" links={projectLinks} />
            <NavLink to="/club-house" onClick={() => setOpen(false)}>Club house</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)}>Contact us</NavLink>
          </nav>
        </div>
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <p className="footer-name">Lions Club of Nugegoda</p>
            <p>{settings.footerBlurb}</p>
          </div>
          <div>
            <p className="footer-label">Visit</p>
            <p>{settings.address}</p>
            {settings.meetingWhen ? <p>{settings.meetingWhen}</p> : <p>Meeting dates are announced by the secretary.</p>}
          </div>
          <div>
            <p className="footer-label">Explore</p>
            <Link to="/projects">Projects</Link>
            <Link to="/newsletters">Newsletters</Link>
            <Link to="/donations">Donations</Link>
            <Link to="/about">About the club</Link>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            {phones ? <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{phones}</a> : null}
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            <Link to="/admin">Club admin</Link>
          </div>
        </div>
        <div className="fine">
          <span>© {new Date().getFullYear()} Lions Club of Nugegoda</span>
          <span>A member club of Lions Clubs International</span>
        </div>
      </footer>
      {searchOpen ? <SearchDialog onClose={() => setSearchOpen(false)} /> : null}
    </SettingsContext.Provider>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: { title: string; slug: string; summary: string }[]; newsletters: { title: string; slug: string; summary: string }[] }>({
    projects: [],
    newsletters: [],
  });

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ projects: [], newsletters: [] });
      return;
    }
    const handle = window.setTimeout(() => {
      api<typeof results>(`/api/search?q=${encodeURIComponent(query.trim())}`).then(setResults).catch(() => {});
    }, 220);
    return () => window.clearTimeout(handle);
  }, [query]);

  function submit(event: FormEvent) {
    event.preventDefault();
  }

  const empty = query.trim().length >= 2 && results.projects.length === 0 && results.newsletters.length === 0;

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-label="Search" onClick={(event) => event.stopPropagation()}>
        <form onSubmit={submit}>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects and newsletters" aria-label="Search" />
        </form>
        <div className="search-results">
          {results.projects.map((item) => (
            <Link key={item.slug} to={`/projects/${item.slug}`} onClick={onClose}>
              <small>Project</small>
              <strong>{item.title}</strong>
            </Link>
          ))}
          {results.newsletters.map((item) => (
            <Link key={item.slug} to={`/newsletters/${item.slug}`} onClick={onClose}>
              <small>Newsletter</small>
              <strong>{item.title}</strong>
            </Link>
          ))}
          {empty ? <p className="muted">Nothing matched that search.</p> : null}
        </div>
      </div>
    </div>
  );
}
