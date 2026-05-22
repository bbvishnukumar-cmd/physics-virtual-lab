import { BarChart3, Trophy, Clock, Target, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { experiments, categoryColors } from '../data/experiments';

export default function ProgressPage() {
  const { t, lang } = useLanguage();
  const { progress, getExperimentProgress, getCompletedCount } = useProgress();
  const completed = getCompletedCount();
  const total = experiments.length;
  const pct = Math.round((completed / total) * 100);
  const totalMins = Math.round((progress.totalTime || 0) / 60);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}><BarChart3 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{t('progress.title')}</h1>
        <p style={s.subtitle}>{t('progress.subtitle')}</p>
      </div>

      {/* Overview cards */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.ringWrap}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" strokeWidth="6"
                strokeDasharray={`${pct * 2.64} ${264 - pct * 2.64}`} strokeDashoffset="66"
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
              <defs><linearGradient id="grad"><stop offset="0%" stopColor="#4f8cff" /><stop offset="100%" stopColor="#7c5cff" /></linearGradient></defs>
              <text x="50" y="48" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Inter">{pct}%</text>
              <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="Inter">{t('progress.overall')}</text>
            </svg>
          </div>
        </div>
        {[
          { icon: <Target size={22} />, value: `${completed}/${total}`, label: t('progress.exptsCompleted'), color: '#4f8cff' },
          { icon: <Clock size={22} />, value: `${totalMins} ${t('progress.minutes')}`, label: t('progress.totalTime'), color: '#ffab00' },
          { icon: <Trophy size={22} />, value: progress.examScores.length > 0 ? Math.max(...progress.examScores.map(s => s.score)) + '%' : '—', label: t('progress.bestScore'), color: '#00e676' },
        ].map((stat, i) => (
          <div key={i} style={s.statSmall}>
            <div style={{ ...s.statIcon, background: stat.color + '15', color: stat.color }}>{stat.icon}</div>
            <div style={s.statValue}>{stat.value}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Experiment list */}
      <h2 style={s.sectionTitle}>Experiment Status</h2>
      <div style={s.expList}>
        {experiments.map((exp, i) => {
          const prog = getExperimentProgress(exp.id);
          const cat = categoryColors[exp.category];
          const status = prog.completed ? 'completed' : prog.started ? 'inProgress' : 'notStarted';
          const statusConfig = {
            completed: { icon: <CheckCircle size={16} />, color: '#00e676', label: t('progress.completed') },
            inProgress: { icon: <PlayCircle size={16} />, color: '#ffab00', label: t('progress.inProgress') },
            notStarted: { icon: <Circle size={16} />, color: 'rgba(255,255,255,0.2)', label: t('progress.notStarted') },
          }[status];

          return (
            <div key={exp.id} style={{ ...s.expCard, animationDelay: `${i * 0.05}s` }}>
              <div style={s.expLeft}>
                <span style={{ fontSize: '1.4rem' }}>{exp.icon}</span>
                <div>
                  <h4 style={s.expTitle}>{lang === 'ta' ? exp.titleTamil : exp.title}</h4>
                  <span style={{ ...s.catBadge, background: cat.bg, color: cat.color }}>{lang === 'ta' ? cat.labelTamil : cat.label}</span>
                </div>
              </div>
              <div style={s.expRight}>
                {prog.timeSpent > 0 && <span style={s.time}>{Math.round(prog.timeSpent / 60)} {t('progress.minutes')}</span>}
                <div style={{ ...s.statusBadge, background: statusConfig.color + '15', color: statusConfig.color }}>
                  {statusConfig.icon} {statusConfig.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '88px 24px 40px', maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.5s ease' },
  header: { marginBottom: 28 },
  title: { fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, #4f8cff, #7c5cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 },
  subtitle: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 14, marginBottom: 32 },
  statCard: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' },
  ringWrap: {},
  statSmall: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' },
  statIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 2 },
  statLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 14 },
  expList: { display: 'flex', flexDirection: 'column', gap: 8 },
  expCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', animation: 'fadeInUp 0.5s ease backwards' },
  expLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  expTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 3 },
  catBadge: { padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' },
  expRight: { display: 'flex', alignItems: 'center', gap: 12 },
  time: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600 },
};
