import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { experiments } from '../data/experiments';

export default function ExamModePage() {
  const { t } = useLanguage();
  const { addExamScore } = useProgress();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup | running | finished
  const [timeLimit, setTimeLimit] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedExpt, setSelectedExpt] = useState(null);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  const startExam = () => {
    const randomIndex = Math.floor(Math.random() * experiments.length);
    setSelectedExpt(experiments[randomIndex]);
    setTimeLeft(timeLimit * 60);
    setPhase('running');
  };

  useEffect(() => {
    if (phase === 'running' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (phase === 'running' && timeLeft <= 0) {
      finishExam();
    }
  }, [phase, timeLeft]);

  const finishExam = () => {
    clearTimeout(timerRef.current);
    const elapsed = timeLimit * 60 - timeLeft;
    const s = Math.max(0, Math.round(100 - (elapsed / (timeLimit * 60)) * 30));
    setScore(s);
    addExamScore(s, selectedExpt?.id, elapsed);
    setPhase('finished');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const urgency = timeLeft < 60 ? '#ff5252' : timeLeft < 180 ? '#ffab00' : '#00e676';

  return (
    <div style={st.page}>
      {phase === 'setup' && (
        <div style={st.setupCard}>
          <div style={st.setupIcon}>
            <Clock size={40} />
          </div>
          <h1 style={st.setupTitle}>{t('exam.title')}</h1>
          <p style={st.setupDesc}>{t('exam.subtitle')}</p>

          <div style={st.setupForm}>
            <label style={st.label}>{t('exam.selectTime')}</label>
            <div style={st.timeOptions}>
              {[15, 30, 45].map(m => (
                <button key={m} onClick={() => setTimeLimit(m)}
                  style={{ ...st.timeBtn, ...(timeLimit === m ? st.timeBtnActive : {}) }}>
                  {m} {t('exam.mins')}
                </button>
              ))}
            </div>
          </div>

          <div style={st.rules}>
            <h4 style={st.rulesTitle}>📋 Exam Rules</h4>
            <ul style={st.rulesList}>
              <li>A random experiment will be assigned</li>
              <li>No AI hints available during exam</li>
              <li>Complete the experiment within the time limit</li>
              <li>Score based on completion and accuracy</li>
            </ul>
          </div>

          <button onClick={startExam} style={st.startBtn}>
            <Play size={18} /> {t('exam.start')}
          </button>
        </div>
      )}

      {phase === 'running' && selectedExpt && (
        <div>
          <div style={st.examHeader}>
            <div style={st.examInfo}>
              <AlertTriangle size={18} color="#ffab00" />
              <span style={st.examLabel}>EXAM MODE</span>
              <span style={st.examExp}>{selectedExpt.icon} {selectedExpt.title}</span>
            </div>
            <div style={{ ...st.timer, color: urgency, borderColor: urgency + '40' }}>
              <Clock size={16} />
              <span style={st.timerText}>{formatTime(timeLeft)}</span>
            </div>
            <button onClick={finishExam} style={st.submitBtn}>
              {t('exam.submit')}
            </button>
          </div>

          <div style={st.examBody}>
            <div style={st.examCard}>
              <h3 style={st.examCardTitle}>🎯 {selectedExpt.aim}</h3>
              <div style={st.examSection}>
                <h4 style={{ fontSize: '0.85rem', color: '#4f8cff', marginBottom: 8 }}>Apparatus</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(selectedExpt.apparatus || []).map((a, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{a}</span>
                  ))}
                </div>
              </div>
              <div style={st.examSection}>
                <h4 style={{ fontSize: '0.85rem', color: '#4f8cff', marginBottom: 8 }}>Procedure</h4>
                <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(selectedExpt.procedure || []).map((step, i) => (
                    <li key={i} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{step}</li>
                  ))}
                </ol>
              </div>
              <div style={st.examSection}>
                <h4 style={{ fontSize: '0.85rem', color: '#ffab00', marginBottom: 8 }}>Formula</h4>
                <pre style={{ fontSize: '0.9rem', fontFamily: "'JetBrains Mono'", color: '#ffab00', margin: 0, whiteSpace: 'pre-wrap' }}>{selectedExpt.formula}</pre>
              </div>
              <button onClick={() => navigate(`/experiment/${selectedExpt.id}`)} style={st.goToLabBtn}>
                🔬 Open Virtual Lab
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'finished' && (
        <div style={st.resultCard}>
          <div style={st.resultIcon}>
            <Trophy size={48} />
          </div>
          <h1 style={st.resultTitle}>{t('exam.score')}</h1>
          <div style={st.scoreCircle}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke={score >= 70 ? '#00e676' : score >= 40 ? '#ffab00' : '#ff5252'} strokeWidth="8"
                strokeDasharray={`${score * 3.77} ${377 - score * 3.77}`} strokeDashoffset="94"
                strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.5s ease' }} />
              <text x="70" y="68" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="800" fontFamily="Inter">{score}</text>
              <text x="70" y="85" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="Inter">/ 100</text>
            </svg>
          </div>
          <p style={st.resultExp}>
            {selectedExpt?.icon} {selectedExpt?.title}
          </p>
          <p style={st.resultMsg}>
            {score >= 70 ? '🎉 Excellent work! You performed great!' : score >= 40 ? '👍 Good effort! Keep practicing!' : '💪 Keep trying! Practice makes perfect!'}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setPhase('setup')} style={st.retryBtn}>
              <RotateCcw size={16} /> {t('exam.tryAgain')}
            </button>
            <button onClick={() => navigate('/home')} style={st.homeBtn}>
              🏠 Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  page: { padding: '88px 24px 40px', maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 88px)', animation: 'fadeIn 0.5s ease' },
  setupCard: { width: '100%', maxWidth: 500, padding: '40px 36px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', animation: 'fadeInUp 0.6s ease' },
  setupIcon: { width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg, #ffab00, #ff6eb4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(255,171,0,0.3)' },
  setupTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 6 },
  setupDesc: { fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', marginBottom: 28 },
  setupForm: { marginBottom: 24 },
  label: { fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 10 },
  timeOptions: { display: 'flex', gap: 8, justifyContent: 'center' },
  timeBtn: { padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' },
  timeBtnActive: { background: 'rgba(255,171,0,0.15)', borderColor: 'rgba(255,171,0,0.3)', color: '#ffab00' },
  rules: { textAlign: 'left', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 },
  rulesTitle: { fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginBottom: 8 },
  rulesList: { paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' },
  startBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 40px', borderRadius: 14, background: 'linear-gradient(135deg, #ffab00, #ff6eb4)', color: '#fff', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 0 20px rgba(255,171,0,0.3)' },
  examHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'rgba(255,171,0,0.06)', borderRadius: 14, border: '1px solid rgba(255,171,0,0.15)', marginBottom: 20, flexWrap: 'wrap', gap: 10 },
  examInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  examLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#ffab00', textTransform: 'uppercase', letterSpacing: '1px' },
  examExp: { fontSize: '0.9rem', fontWeight: 600, color: '#fff' },
  timer: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid', background: 'rgba(0,0,0,0.2)', fontFamily: "'JetBrains Mono', monospace" },
  timerText: { fontSize: '1.2rem', fontWeight: 700 },
  submitBtn: { padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #4f8cff, #7c5cff)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  examBody: {},
  examCard: { padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' },
  examCardTitle: { fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 16, lineHeight: 1.5 },
  examSection: { marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' },
  goToLabBtn: { marginTop: 20, width: '100%', padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8cff, #7c5cff)', color: '#fff', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 0 20px rgba(79,140,255,0.3)' },
  resultCard: { width: '100%', maxWidth: 450, padding: '40px 36px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', animation: 'bounceIn 0.6s ease' },
  resultIcon: { width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #00e676, #00bfa5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(0,230,118,0.3)' },
  resultTitle: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 16 },
  scoreCircle: { margin: '0 auto 16px' },
  resultExp: { fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  resultMsg: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' },
  retryBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: 'rgba(255,171,0,0.15)', border: '1px solid rgba(255,171,0,0.3)', color: '#ffab00', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  homeBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: 'rgba(79,140,255,0.15)', border: '1px solid rgba(79,140,255,0.3)', color: '#4f8cff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
};
