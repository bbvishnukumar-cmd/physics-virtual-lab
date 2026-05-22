import { useState } from 'react';
import { BookOpen, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { experiments } from '../data/experiments';
import { categoryColors } from '../data/experiments';

export default function LabManualPage() {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}><BookOpen size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{t('manual.title')}</h1>
          <p style={s.subtitle}>{t('manual.subtitle')}</p>
        </div>
        <button onClick={() => window.print()} style={s.printBtn}><Printer size={14} /> {t('manual.print')}</button>
      </div>

      <div style={s.list}>
        {experiments.map((exp, i) => {
          const cat = categoryColors[exp.category];
          const isOpen = expanded === exp.id;
          return (
            <div key={exp.id} style={{ ...s.card, animationDelay: `${i * 0.05}s` }}>
              <div style={s.cardHeader} onClick={() => toggle(exp.id)}>
                <div style={s.cardLeft}>
                  <span style={{ fontSize: '1.5rem' }}>{exp.icon}</span>
                  <div>
                    <div style={s.expNum}>Experiment {i + 1}</div>
                    <h3 style={s.expTitle}>{lang === 'ta' ? exp.titleTamil : exp.title}</h3>
                  </div>
                  <span style={{ ...s.catBadge, background: cat.bg, color: cat.color }}>
                    {lang === 'ta' ? cat.labelTamil : cat.label}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={20} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={20} color="rgba(255,255,255,0.4)" />}
              </div>

              {isOpen && (
                <div style={s.cardBody}>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('expt.aim')}</h4>
                    <p style={s.secText}>{lang === 'ta' ? (exp.aimTamil || exp.aim) : exp.aim}</p>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('expt.apparatus')}</h4>
                    <div style={s.appGrid}>
                      {(lang === 'ta' && exp.apparatusTamil ? exp.apparatusTamil : exp.apparatus || []).map((a, j) => (
                        <span key={j} style={s.appChip}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('expt.formula')}</h4>
                    <pre style={s.formula}>{exp.formula}</pre>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('manual.diagram')}</h4>
                    <div style={s.diagramPlaceholder}>
                      <span style={{ fontSize: '2rem' }}>{exp.icon}</span>
                      <p>Circuit Diagram</p>
                    </div>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('expt.procedure')}</h4>
                    <ol style={s.procList}>
                      {(lang === 'ta' && exp.procedureTamil ? exp.procedureTamil : exp.procedure || []).map((step, j) => (
                        <li key={j} style={s.procItem}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('manual.observationTable')}</h4>
                    <table style={s.table}>
                      <thead><tr>{(exp.observationHeaders || []).map((h, j) => <th key={j} style={s.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map(row => (
                          <tr key={row}>{(exp.observationHeaders || []).map((_, j) => <td key={j} style={s.td}>{j === 0 ? row : ''}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={s.section}>
                    <h4 style={s.secTitle}>{t('expt.result')}</h4>
                    <pre style={s.result}>{exp.result}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '88px 24px 40px', maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.5s ease' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  title: { fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg, #4f8cff, #7c5cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 },
  subtitle: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' },
  printBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: { background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', animation: 'fadeInUp 0.5s ease backwards' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', transition: 'background 0.2s' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  expNum: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  expTitle: { fontSize: '1rem', fontWeight: 600, color: '#fff' },
  catBadge: { padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' },
  cardBody: { padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' },
  section: { paddingTop: 12 },
  secTitle: { fontSize: '0.85rem', fontWeight: 600, color: '#4f8cff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' },
  secText: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  appGrid: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  appChip: { padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' },
  formula: { fontSize: '0.9rem', fontFamily: "'JetBrains Mono'", color: '#ffab00', lineHeight: 1.8, margin: 0, padding: 12, background: 'rgba(255,171,0,0.05)', borderRadius: 8, whiteSpace: 'pre-wrap' },
  diagramPlaceholder: { padding: 30, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' },
  procList: { paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 },
  procItem: { fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 },
  table: { width: '100%', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' },
  th: { padding: '8px 12px', textAlign: 'left', background: 'rgba(79,140,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td: { padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', background: 'rgba(255,255,255,0.02)' },
  result: { fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#00e676', lineHeight: 1.8, margin: 0, padding: 12, background: 'rgba(0,230,118,0.05)', borderRadius: 8, whiteSpace: 'pre-wrap' },
};
