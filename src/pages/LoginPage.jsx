import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Zap, Eye, Cpu, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const floatingIcons = ['⚡', '🔬', '🧲', '💡', '🌊', '⚛️', '🔭', '📐', '🔋', '🧪', '🌈', '📡'];

export default function LoginPage() {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('12');
  const { login } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim(), studentClass);
      navigate('/home');
    }
  };

  return (
    <div style={styles.page}>
      {/* Floating particles */}
      <div style={styles.particles}>
        {floatingIcons.map((icon, i) => (
          <span
            key={i}
            style={{
              ...styles.particle,
              left: `${8 + (i * 7.5) % 85}%`,
              top: `${10 + (i * 13) % 75}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + (i % 3) * 2}s`,
              fontSize: `${1.2 + (i % 3) * 0.5}rem`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* Grid background */}
      <div style={styles.grid} />

      {/* Language toggle */}
      <button onClick={toggleLang} style={styles.langBtn}>
        🌐 {lang === 'en' ? 'தமிழ்' : 'English'}
      </button>

      {/* Main card */}
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <Atom size={40} strokeWidth={1.5} />
          </div>
          <h1 style={styles.title}>{t('login.title')}</h1>
          <p style={styles.subtitle}>{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('login.namePlaceholder')}</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('login.namePlaceholder')}
              required
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('login.classLabel')}</label>
            <select
              style={styles.select}
              value={studentClass}
              onChange={e => setStudentClass(e.target.value)}
            >
              <option value="12">Class 12</option>
            </select>
          </div>

          <button type="submit" style={styles.loginBtn}>
            {t('login.loginBtn')}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.features}>
          <div style={styles.feature}>
            <Zap size={18} color="#4f8cff" />
            <span>10 Interactive Experiments</span>
          </div>
          <div style={styles.feature}>
            <Eye size={18} color="#7c5cff" />
            <span>Real-time Simulations</span>
          </div>
          <div style={styles.feature}>
            <Cpu size={18} color="#00d4ff" />
            <span>AI Lab Assistant</span>
          </div>
        </div>

        <p style={styles.quote}>{t('login.quote')}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #060a1e 0%, #0a0e27 30%, #151b4a 60%, #0d1333 100%)',
    position: 'relative', overflow: 'hidden', padding: 20,
  },
  particles: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
  },
  particle: {
    position: 'absolute', opacity: 0.15,
    animation: 'float 5s ease-in-out infinite',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `radial-gradient(rgba(79,140,255,0.06) 1px, transparent 1px)`,
    backgroundSize: '40px 40px', pointerEvents: 'none',
  },
  langBtn: {
    position: 'absolute', top: 20, right: 20, zIndex: 10,
    padding: '8px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    width: '100%', maxWidth: 440, padding: '40px 36px',
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(30px)',
    borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(79,140,255,0.08)',
    position: 'relative', zIndex: 1,
    animation: 'fadeInUp 0.8s ease',
  },
  logoSection: {
    textAlign: 'center', marginBottom: 32,
  },
  logoCircle: {
    width: 80, height: 80, borderRadius: 20, margin: '0 auto 16px',
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
    boxShadow: '0 0 30px rgba(79,140,255,0.3)',
    animation: 'float 3s ease-in-out infinite',
  },
  title: {
    fontSize: '1.6rem', fontWeight: 800, marginBottom: 6,
    background: 'linear-gradient(135deg, #4f8cff, #00d4ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)',
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 18,
  },
  inputGroup: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  label: {
    fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
  },
  input: {
    padding: '14px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
  },
  select: {
    padding: '14px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
    appearance: 'none',
  },
  loginBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px 24px', borderRadius: 12, marginTop: 8,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    color: '#fff', fontSize: '1rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 0 20px rgba(79,140,255,0.3)',
    transition: 'all 0.3s',
  },
  features: {
    display: 'flex', justifyContent: 'center', gap: 20,
    marginTop: 28, flexWrap: 'wrap',
  },
  feature: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)',
  },
  quote: {
    marginTop: 24, fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)',
    textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5,
  },
};
