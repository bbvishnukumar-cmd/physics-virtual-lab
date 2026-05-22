import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Save, BookOpen, Beaker } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { experiments } from '../data/experiments';
import ObservationTable from '../components/ObservationTable';
import AIChatbot from '../components/AIChatbot';
import MeterBridge from '../experiments/MeterBridge';
import TangentGalvanometer from '../experiments/TangentGalvanometer';
import Potentiometer from '../experiments/Potentiometer';
import Spectrometer from '../experiments/Spectrometer';
import DiffractionGrating from '../experiments/DiffractionGrating';
import PNJunctionDiode from '../experiments/PNJunctionDiode';
import ZenerDiode from '../experiments/ZenerDiode';
import TransistorCE from '../experiments/TransistorCE';
import LogicGates from '../experiments/LogicGates';
import DeMorganTheorem from '../experiments/DeMorganTheorem';

const experimentComponents = {
  'meter-bridge': MeterBridge, 'tangent-galvanometer': TangentGalvanometer,
  'potentiometer': Potentiometer, 'spectrometer': Spectrometer,
  'diffraction-grating': DiffractionGrating, 'pn-junction-diode': PNJunctionDiode,
  'zener-diode': ZenerDiode, 'transistor-ce': TransistorCE,
  'logic-gates': LogicGates, 'demorgan-theorem': DeMorganTheorem,
};

export default function ExperimentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { updateExperiment, markCompleted } = useProgress();
  const [mode, setMode] = useState('free');
  const [observations, setObservations] = useState([]);
  const [activeTab, setActiveTab] = useState('simulation');
  const [startTime] = useState(Date.now());

  const experiment = experiments.find(e => e.id === id);
  const SimComponent = experimentComponents[id];

  useEffect(() => {
    updateExperiment(id, { started: true, startedAt: Date.now() });
    return () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      updateExperiment(id, { timeSpent: elapsed });
    };
  }, []);

  if (!experiment || !SimComponent) {
    return <div style={s.page}><p>Experiment not found.</p></div>;
  }

  const handleReading = (row) => {
    const numbered = [(observations.length + 1).toString(), ...row.slice(1)];
    setObservations(prev => [...prev, numbered]);
  };

  const handleComplete = () => {
    markCompleted(id, 100);
    alert('🎉 Experiment completed! Great work!');
  };

  const tabs = [
    { key: 'simulation', label: '🔬 Simulation' },
    { key: 'observations', label: '📊 Observations' },
    { key: 'manual', label: '📖 Manual' },
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button onClick={() => navigate('/home')} style={s.backBtn}><ArrowLeft size={18} /></button>
          <div>
            <h1 style={s.title}>{lang === 'ta' ? experiment.titleTamil : experiment.title}</h1>
            <p style={s.subtitle}>{experiment.icon} {lang === 'ta' ? (experiment.descriptionTamil || experiment.description) : experiment.description}</p>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.modeToggle}>
            <button onClick={() => setMode('free')} style={{ ...s.modeBtn, ...(mode === 'free' ? s.modeBtnActive : {}) }}>
              <Beaker size={14} /> {t('expt.freeMode')}
            </button>
            <button onClick={() => setMode('guided')} style={{ ...s.modeBtn, ...(mode === 'guided' ? s.modeBtnActive : {}) }}>
              <BookOpen size={14} /> {t('expt.guidedMode')}
            </button>
          </div>
          <button onClick={() => { setObservations([]); }} style={s.resetBtn}><RotateCcw size={14} /> {t('expt.reset')}</button>
          <button onClick={handleComplete} style={s.saveBtn}><Save size={14} /> Complete</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={s.content}>
        {activeTab === 'simulation' && (
          <div style={s.simLayout}>
            {/* Info sidebar */}
            <div style={s.sidebar}>
              <div style={s.infoCard}>
                <h3 style={s.infoTitle}>{t('expt.aim')}</h3>
                <p style={s.infoText}>{lang === 'ta' ? (experiment.aimTamil || experiment.aim) : experiment.aim}</p>
              </div>
              <div style={s.infoCard}>
                <h3 style={s.infoTitle}>{t('expt.formula')}</h3>
                <pre style={s.formula}>{experiment.formula}</pre>
              </div>
              <div style={s.infoCard}>
                <h3 style={s.infoTitle}>{t('expt.apparatus')}</h3>
                <ul style={s.apparatusList}>
                  {(lang === 'ta' && experiment.apparatusTamil ? experiment.apparatusTamil : experiment.apparatus || []).map((a, i) => (
                    <li key={i} style={s.apparatusItem}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Simulation */}
            <div style={s.simArea}>
              <SimComponent onReading={handleReading} />
            </div>
          </div>
        )}

        {activeTab === 'observations' && (
          <div>
            <ObservationTable
              headers={experiment.observationHeaders || []}
              data={observations}
              onDataChange={setObservations}
              onAddRow={() => setObservations(prev => [...prev, experiment.observationHeaders.map(() => '')])}
            />
            {observations.length > 0 && (
              <div style={s.resultCard}>
                <h3 style={s.infoTitle}>{t('expt.result')}</h3>
                <pre style={s.resultText}>{experiment.result}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manual' && (
          <div style={s.manualContent}>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>{t('expt.aim')}</h3>
              <p style={s.infoText}>{lang === 'ta' ? (experiment.aimTamil || experiment.aim) : experiment.aim}</p>
            </div>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>{t('expt.apparatus')}</h3>
              <ul style={s.apparatusList}>
                {(lang === 'ta' && experiment.apparatusTamil ? experiment.apparatusTamil : experiment.apparatus || []).map((a, i) => (
                  <li key={i} style={s.apparatusItem}>• {a}</li>
                ))}
              </ul>
            </div>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>{t('expt.formula')}</h3>
              <pre style={s.formula}>{experiment.formula}</pre>
            </div>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>{t('expt.procedure')}</h3>
              <ol style={s.procedureList}>
                {(lang === 'ta' && experiment.procedureTamil ? experiment.procedureTamil : experiment.procedure || []).map((step, i) => (
                  <li key={i} style={s.procedureItem}>{step}</li>
                ))}
              </ol>
            </div>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>{t('expt.result')}</h3>
              <pre style={s.resultText}>{experiment.result}</pre>
            </div>
          </div>
        )}
      </div>

      <AIChatbot experimentId={id} />
    </div>
  );
}

const s = {
  page: { padding: '80px 20px 40px', maxWidth: 1400, margin: '0 auto', animation: 'fadeIn 0.4s ease' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  backBtn: { padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex' },
  title: { fontSize: '1.4rem', fontWeight: 700, color: '#fff' },
  subtitle: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  modeToggle: { display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  modeBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  modeBtnActive: { background: 'rgba(79,140,255,0.15)', color: '#4f8cff' },
  resetBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)', color: '#ff5252', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', color: '#00e676', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  tabs: { display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.06)' },
  tab: { flex: 1, padding: '10px 16px', borderRadius: 10, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' },
  tabActive: { background: 'rgba(79,140,255,0.15)', color: '#4f8cff' },
  content: {},
  simLayout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 12 },
  simArea: {},
  infoCard: { padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' },
  infoTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#4f8cff', marginBottom: 8 },
  infoText: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  formula: { fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#ffab00', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' },
  apparatusList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  apparatusItem: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' },
  procedureList: { paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  procedureItem: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 },
  resultCard: { marginTop: 20, padding: 16, background: 'rgba(0,230,118,0.05)', borderRadius: 12, border: '1px solid rgba(0,230,118,0.15)' },
  resultText: { fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#00e676', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' },
  manualContent: { display: 'flex', flexDirection: 'column', gap: 16 },
};
