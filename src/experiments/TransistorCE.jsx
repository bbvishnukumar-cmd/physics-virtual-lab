import { useState } from 'react';
import GraphPlotter from '../components/GraphPlotter';

export default function TransistorCE({ onReading }) {
  const [vbb, setVbb] = useState(0);
  const [vcc, setVcc] = useState(0);
  const [mode, setMode] = useState('input');
  const [constVCE, setConstVCE] = useState(2);
  const [constIB, setConstIB] = useState(20);
  const [inputReadings, setInputReadings] = useState([]);
  const [outputReadings, setOutputReadings] = useState([]);

  const beta = 150;
  const getIB = (vbe) => {
    if (vbe < 0.5) return vbe * 2;
    return 2 + Math.exp((vbe - 0.5) * 6) * 5;
  };
  const getIC = (ib, vce) => {
    if (vce < 0.2) return ib * beta * (vce / 0.2) / 1000;
    return ib * beta / 1000;
  };

  const vbe = mode === 'input' ? Math.min(vbb, 0.9) : 0.65;
  const ib = mode === 'input' ? getIB(vbe) : constIB;
  const vce = mode === 'output' ? vcc : constVCE;
  const ic = getIC(ib, vce);

  const addReading = () => {
    if (mode === 'input') {
      setInputReadings(prev => [...prev, { vbe: vbe.toFixed(2), ib: ib.toFixed(1) }]);
    } else {
      setOutputReadings(prev => [...prev, { vce: vce.toFixed(2), ic: ic.toFixed(2) }]);
    }
    onReading && onReading(['', vbe.toFixed(2), ib.toFixed(1), vce.toFixed(2), ic.toFixed(2)]);
  };

  return (
    <div>
      <div style={styles.circuit}>
        <svg width="100%" height="220" viewBox="0 0 620 220">
          {/* NPN Transistor symbol */}
          <g transform="translate(280, 60)">
            <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1="30" y1="20" x2="30" y2="80" stroke="#4f8cff" strokeWidth="3" />
            <line x1="30" y1="30" x2="60" y2="10" stroke={ic > 0.1 ? '#00e676' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
            <line x1="30" y1="70" x2="60" y2="90" stroke={ic > 0.1 ? '#00e676' : 'rgba(255,255,255,0.3)'} strokeWidth="2" />
            {/* Arrow */}
            <polygon points="50,85 60,90 55,78" fill={ic > 0.1 ? '#00e676' : 'rgba(255,255,255,0.3)'} />
            <text x="30" y="110" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">NPN (BC107)</text>
            <text x="-5" y="54" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="8">B</text>
            <text x="65" y="14" fill="rgba(255,255,255,0.4)" fontSize="8">C</text>
            <text x="65" y="96" fill="rgba(255,255,255,0.4)" fontSize="8">E</text>
          </g>

          {/* VBB */}
          <rect x="30" y="90" width="55" height="30" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(79,140,255,0.3)" strokeWidth="1" />
          <text x="57" y="110" textAnchor="middle" fill="#4f8cff" fontSize="9" fontFamily="Inter">VBB</text>
          <line x1="85" y1="105" x2="280" y2="110" stroke="rgba(79,140,255,0.3)" strokeWidth="1.5" />

          {/* VCC */}
          <rect x="530" y="30" width="55" height="30" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(0,230,118,0.3)" strokeWidth="1" />
          <text x="557" y="50" textAnchor="middle" fill="#00e676" fontSize="9" fontFamily="Inter">VCC</text>
          <line x1="340" y1="70" x2="530" y2="45" stroke="rgba(0,230,118,0.3)" strokeWidth="1.5" />

          {/* μA meter (IB) */}
          <circle cx="180" cy="110" r="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,171,0,0.3)" strokeWidth="1" />
          <text x="180" y="107" textAnchor="middle" fill="#ffab00" fontSize="8" fontWeight="bold">μA</text>
          <text x="180" y="118" textAnchor="middle" fill="#ffab00" fontSize="7" fontFamily="JetBrains Mono">{ib.toFixed(1)}</text>

          {/* mA meter (IC) */}
          <circle cx="440" cy="70" r="20" fill="rgba(255,255,255,0.04)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
          <text x="440" y="67" textAnchor="middle" fill="#00d4ff" fontSize="8" fontWeight="bold">mA</text>
          <text x="440" y="78" textAnchor="middle" fill="#00d4ff" fontSize="7" fontFamily="JetBrains Mono">{ic.toFixed(2)}</text>

          {/* Readings */}
          <rect x="20" y="150" width="130" height="55" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x="32" y="168" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">VBE = {vbe.toFixed(2)} V</text>
          <text x="32" y="182" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">IB = {ib.toFixed(1)} μA</text>
          <text x="32" y="196" fill="#4f8cff" fontSize="9" fontWeight="bold" fontFamily="Inter">β = {(ic / (ib / 1000)).toFixed(0)}</text>

          <rect x="460" y="150" width="130" height="55" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x="472" y="168" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">VCE = {vce.toFixed(2)} V</text>
          <text x="472" y="182" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">IC = {ic.toFixed(2)} mA</text>
        </svg>
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('input')} style={{ ...styles.modeBtn, ...(mode === 'input' ? styles.modeBtnActive : {}) }}>📊 Input Characteristics</button>
          <button onClick={() => setMode('output')} style={{ ...styles.modeBtn, ...(mode !== 'input' ? styles.modeBtnActive : {}) }}>📈 Output Characteristics</button>
        </div>

        {mode === 'input' ? (
          <>
            <div style={styles.row}>
              <label style={styles.label}>VBB (0-1V)</label>
              <input type="range" min="0" max="1" step="0.02" value={vbb} onChange={e => setVbb(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={styles.val}>{vbe.toFixed(2)} V</span>
            </div>
            <div style={styles.infoRow}>VCE = {constVCE}V (constant)</div>
          </>
        ) : (
          <>
            <div style={styles.row}>
              <label style={styles.label}>VCC (0-10V)</label>
              <input type="range" min="0" max="10" step="0.1" value={vcc} onChange={e => setVcc(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={styles.val}>{vce.toFixed(1)} V</span>
            </div>
            <div style={styles.row}>
              <label style={styles.label}>IB (μA)</label>
              <input type="range" min="10" max="80" step="5" value={constIB} onChange={e => setConstIB(parseFloat(e.target.value))} style={{ flex: 1 }} />
              <span style={styles.val}>{constIB} μA</span>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addReading} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
          <button onClick={() => { setInputReadings([]); setOutputReadings([]); }} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #ff525240', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(255,82,82,0.1)', color: '#ff5252' }}>🗑️ Clear</button>
        </div>
      </div>

      {((mode === 'input' && inputReadings.length > 2) || (mode === 'output' && outputReadings.length > 2)) && (
        <div style={{ marginTop: 16 }}>
          <GraphPlotter
            title={mode === 'input' ? 'Input Characteristics (VBE vs IB)' : 'Output Characteristics (VCE vs IC)'}
            xLabel={mode === 'input' ? 'VBE (V)' : 'VCE (V)'}
            yLabel={mode === 'input' ? 'IB (μA)' : 'IC (mA)'}
            xData={mode === 'input' ? inputReadings.map(r => r.vbe) : outputReadings.map(r => r.vce)}
            yData={mode === 'input' ? inputReadings.map(r => parseFloat(r.ib)) : outputReadings.map(r => parseFloat(r.ic))}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  circuit: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  label: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 100 },
  val: { fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 },
  infoRow: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
  modeBtn: { flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' },
  modeBtnActive: { background: 'rgba(79,140,255,0.15)', borderColor: 'rgba(79,140,255,0.3)', color: '#4f8cff' },
};
