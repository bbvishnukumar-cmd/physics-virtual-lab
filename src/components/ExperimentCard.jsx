import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { categoryColors } from '../data/experiments';

export default function ExperimentCard({ experiment, index }) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { getExperimentProgress } = useProgress();
  const progress = getExperimentProgress(experiment.id);
  const cat = categoryColors[experiment.category];

  return (
    <div
      style={{ ...styles.card, animationDelay: `${index * 0.06}s` }}
      onClick={() => navigate(`/experiment/${experiment.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
        e.currentTarget.style.borderColor = cat.color + '50';
        e.currentTarget.style.boxShadow = `0 0 30px ${cat.color}20`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {progress.completed && (
        <div style={styles.completedBadge}><CheckCircle size={14} /> {t('home.completed')}</div>
      )}

      <div style={{ ...styles.iconWrap, background: cat.bg }}>
        <span style={{ fontSize: '2rem' }}>{experiment.icon}</span>
      </div>

      <div style={{ ...styles.category, background: cat.bg, color: cat.color }}>
        {lang === 'ta' ? cat.labelTamil : cat.label}
      </div>

      <h3 style={styles.title}>
        {lang === 'ta' ? experiment.titleTamil : experiment.title}
      </h3>

      <p style={styles.desc}>
        {lang === 'ta' ? (experiment.descriptionTamil || experiment.description) : experiment.description}
      </p>

      <div style={styles.footer}>
        <span style={{ ...styles.diffBadge, color: experiment.difficulty === 'Hard' ? '#ff5252' : experiment.difficulty === 'Medium' ? '#ffab00' : '#00e676' }}>
          {experiment.difficulty}
        </span>
        <button style={styles.startBtn}>
          <Play size={14} />
          {t('home.startExpt')}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: 'relative', padding: 24, borderRadius: 16,
    background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex', flexDirection: 'column', gap: 12,
    animation: 'fadeInUp 0.5s ease backwards',
  },
  completedBadge: {
    position: 'absolute', top: 12, right: 12,
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 20,
    background: 'rgba(0,230,118,0.12)', color: '#00e676',
    fontSize: '0.7rem', fontWeight: 600,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  category: {
    alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 20,
    fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  title: {
    fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.3,
  },
  desc: {
    fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
    flex: 1,
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 4,
  },
  diffBadge: {
    fontSize: '0.72rem', fontWeight: 600,
  },
  startBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 8,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    color: '#fff', fontSize: '0.78rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
  },
};
