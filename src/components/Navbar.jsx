import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Clock, LogOut, Menu, X, Globe, Atom } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/home', icon: <Home size={18} />, label: t('nav.home') },
    { to: '/manual', icon: <BookOpen size={18} />, label: t('nav.labManual') },
    { to: '/progress', icon: <BarChart3 size={18} />, label: t('nav.progress') },
    { to: '/exam', icon: <Clock size={18} />, label: t('nav.examMode') },
  ];

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/home" style={styles.logo}>
          <div style={styles.logoIcon}><Atom size={22} /></div>
          <span style={styles.logoText}>Physics Virtual Lab</span>
        </Link>

        <div style={{ ...styles.links, ...(menuOpen ? styles.linksOpen : {}) }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.link,
                ...(location.pathname === link.to ? styles.linkActive : {})
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div style={styles.actions}>
          <button onClick={toggleLang} style={styles.langBtn} title="Toggle Language">
            <Globe size={16} />
            <span>{t('nav.language')}</span>
          </button>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
            <span style={styles.userName}>{user.name}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={16} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(6, 10, 30, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: 1400, margin: '0 auto', padding: '0 24px',
    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', color: '#fff',
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 15px rgba(79,140,255,0.3)',
  },
  logoText: {
    fontSize: '1.1rem', fontWeight: 700,
    background: 'linear-gradient(135deg, #4f8cff, #00d4ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex', gap: 4, alignItems: 'center',
  },
  linksOpen: {},
  link: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
    borderRadius: 10, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
    fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
  },
  linkActive: {
    background: 'rgba(79,140,255,0.15)', color: '#4f8cff',
  },
  actions: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  langBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
    borderRadius: 8, background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.2s',
  },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: 8,
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c5cff, #4f8cff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
  },
  userName: {
    fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)',
  },
  logoutBtn: {
    padding: 8, borderRadius: 8, background: 'transparent',
    color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex',
    transition: 'all 0.2s', border: 'none',
  },
  menuBtn: {
    display: 'none', padding: 8, borderRadius: 8, background: 'transparent',
    color: '#fff', cursor: 'pointer', border: 'none',
  },
};
