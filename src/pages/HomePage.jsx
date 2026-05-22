import { useState } from 'react';
import { FlaskConical, Zap, Eye, Cpu, Trophy, Clock, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { experiments } from '../data/experiments';
import ExperimentCard from '../components/ExperimentCard';

export default function HomePage() {
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getCompletedCount, progress } = useProgress();

  const filtered = filter === 'all' ? experiments : experiments.filter(e => e.category === filter);
  const completed = getCompletedCount();
  const totalMinutes = Math.round((progress.totalTime || 0) / 60);

  const categories = [
    { key: 'all', label: t('home.allExpts'), icon: <FlaskConical size={14} /> },
    { key: 'electricity', label: t('home.electricity'), icon: <Zap size={14} /> },
    { key: 'optics', label: t('home.optics'), icon: <Eye size={14} /> },
    { key: 'electronics', label: t('home.electronics'), icon: <Cpu size={14} /> },
  ];

  return (
    <div style={styles.page}>
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <div>
            <h1 style={styles.welcomeText}>
              {t('home.welcome')}, <span style={styles.userName}>{user?.name}</span> 👋
            </h1>
            <p style={styles.bannerDesc}>{t('home.subtitle')}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { icon: <Target size={18} />, value: experiments.length, label: t('home.stats.total'), color: '#4f8cff' },
            { icon: <Trophy size={18} />, value: completed, label: t('home.stats.completed'), color: '#00e676' },
            { icon: <Clock size={18} />, value: `${totalMinutes}m`, label: t('home.stats.timeSpent'), color: '#ffab00' },
            { icon: <Zap size={18} />, value: completed > 0 ? Math.round((completed / experiments.length) * 100) + '%' : '0%', label: t('home.stats.avgScore'), color: '#7c5cff' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: s.color + '15', color: s.color }}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{t('home.title')}</h2>
        <div style={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              style={{
                ...styles.filterBtn,
                ...(filter === cat.key ? styles.filterActive : {}),
              }}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experiment Grid */}
      <div style={styles.grid}>
        {filtered.map((exp, i) => (
          <ExperimentCard key={exp.id} experiment={exp} index={i} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '88px 24px 40px', maxWidth: 1400, margin: '0 auto',
    animation: 'fadeIn 0.5s ease',
  },
  banner: {
    background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(124,92,255,0.05))',
    borderRadius: 20, padding: '32px 28px 0', marginBottom: 32,
    border: '1px solid rgba(79,140,255,0.1)',
  },
  bannerContent: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: 6,
  },
  userName: {
    background: 'linear-gradient(135deg, #4f8cff, #00d4ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  bannerDesc: {
    fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
    padding: '0 0 24px',
  },
  statCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '14px 8px', borderRadius: 14,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: '1.3rem', fontWeight: 800, color: '#fff',
  },
  statLabel: {
    fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 2,
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20, flexWrap: 'wrap', gap: 12,
  },
  sectionTitle: {
    fontSize: '1.3rem', fontWeight: 700,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  filters: {
    display: 'flex', gap: 6,
  },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '7px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
  },
  filterActive: {
    background: 'rgba(79,140,255,0.15)', borderColor: 'rgba(79,140,255,0.3)',
    color: '#4f8cff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 18,
  },
};
