import { useState } from 'react';
import GraphPlotter from '../components/GraphPlotter';

export default function PNJunctionDiode({ onReading }) {
  const [voltage, setVoltage] = useState(0);
  const [isForward, setIsForward] = useState(true);
  const [readings, setReadings] = useState({ forward: [], reverse: [] });

  const kneeV = 0.7;
  const getCurrent = (v, forward) => {
    if (forward) {
      if (v < 0.3) return v * 0.01;
      if (v < kneeV) return 0.003 + (v - 0.3) * 0.5;
      return 0.2 + Math.exp((v - kneeV) * 8) * 0.5;
    } else {
      if (Math.abs(v) < 25) return -v * 0.001;
      return -0.025 - (Math.abs(v) - 25) * 5;
    }
  };

  const current = getCurrent(voltage, isForward);
  const currentDisplay = isForward ? (current < 1 ? (current * 1000).toFixed(1) + ' μA' : current.toFixed(2) + ' mA') : (current * 1000).toFixed(1) + ' μA';

  const addReading = () => {
    const key = isForward ? 'forward' : 'reverse';
    const newR = { v: isForward ? voltage : -voltage, i: current };
    setReadings(prev => ({ ...prev, [key]: [...prev[key], newR] }));
    onReading && onReading(['', (isForward ? voltage : -voltage).toFixed(2), current.toFixed(4)]);
  };

  const diodeGlow = isForward && voltage > kneeV;

  return (
    <div>
      {/* Circuit visualization */}
      <div style={styles.circuit}>
        <svg width="100%" height="200" viewBox="0 0 600 200">
          {/* Battery */}
          <rect x="20" y="80" width="60" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke={voltage > 0 ? '#00e676' : 'rgba(255,255,255,0.15)'} strokeWidth="1.5" />
          <text x="50" y="105" textAnchor="middle" fill={voltage > 0 ? '#00e676' : 'rgba(255,255,255,0.5)'} fontSize="11" fontFamily="Inter">{voltage.toFixed(1)}V</text>

          {/* Wires */}
          <line x1="80" y1="100" x2="180" y2="100" stroke={voltage > 0 ? 'rgba(79,140,255,0.5)' : 'rgba(255,255,255,0.1)'} strokeWidth="2" strokeDasharray={voltage > 0 ? "4 2" : "none"}>
            {voltage > 0 && <animate attributeName="stroke-dashoffset" values="6;0" dur="0.3s" repeatCount="indefinite" />}
          </line>

          {/* Diode */}
          <g transform="translate(220, 75)">
            <polygon points="0,25 40,0 40,50" fill={diodeGlow ? 'rgba(79,140,255,0.3)' : 'rgba(255,255,255,0.05)'} stroke={diodeGlow ? '#4f8cff' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
            <line x1="40" y1="0" x2="40" y2="50" stroke={diodeGlow ? '#4f8cff' : 'rgba(255,255,255,0.2)'} strokeWidth="3" />
            {diodeGlow && <circle cx="20" cy="25" r="30" fill="rgba(79,140,255,0.08)" />}
            <text x="20" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">{isForward ? 'Forward' : 'Reverse'}</text>
          </g>

          {/* Wires after diode */}
          <line x1="260" y1="100" x2="360" y2="100" stroke={diodeGlow ? 'rgba(79,140,255,0.5)' : 'rgba(255,255,255,0.1)'} strokeWidth="2" />

          {/* Ammeter */}
          <circle cx="400" cy="100" r="25" fill="rgba(255,255,255,0.04)" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
          <text x="400" y="95" textAnchor="middle" fill="#00d4ff" fontSize="10" fontWeight="bold" fontFamily="Inter">A</text>
          <text x="400" y="108" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">{currentDisplay}</text>

          {/* Voltmeter */}
          <circle cx="240" cy="165" r="22" fill="rgba(255,255,255,0.04)" stroke="rgba(124,92,255,0.3)" strokeWidth="1.5" />
          <text x="240" y="162" textAnchor="middle" fill="#7c5cff" fontSize="10" fontWeight="bold" fontFamily="Inter">V</text>
          <text x="240" y="174" textAnchor="middle" fill="#7c5cff" fontSize="8" fontFamily="JetBrains Mono">{voltage.toFixed(2)}V</text>
          <line x1="210" y1="100" x2="210" y2="145" stroke="rgba(124,92,255,0.2)" strokeWidth="1" strokeDasharray="3" />
          <line x1="270" y1="100" x2="270" y2="145" stroke="rgba(124,92,255,0.2)" strokeWidth="1" strokeDasharray="3" />

          {/* Return wire */}
          <line x1="425" y1="100" x2="540" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="540" y1="100" x2="540" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="540" y1="160" x2="20" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="20" y1="160" x2="20" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        </svg>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <div style={styles.row}>
          <label style={styles.label}>Voltage ({isForward ? '0-2V' : '0-30V'})</label>
          <input type="range" min="0" max={isForward ? 2 : 30} step={isForward ? 0.05 : 0.5} value={voltage} onChange={e => setVoltage(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={styles.value}>{voltage.toFixed(2)} V</span>
        </div>
        <div style={styles.btnRow}>
          <button onClick={() => { setIsForward(f => !f); setVoltage(0); }} style={{ ...styles.btn, background: isForward ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)', color: isForward ? '#00e676' : '#ff5252', borderColor: isForward ? '#00e67640' : '#ff525240' }}>
            {isForward ? '➡️ Forward Bias' : '⬅️ Reverse Bias'}
          </button>
          <button onClick={addReading} style={{ ...styles.btn, background: 'rgba(79,140,255,0.1)', color: '#4f8cff', borderColor: '#4f8cff40' }}>📝 Record</button>
          <button onClick={() => setReadings({ forward: [], reverse: [] })} style={{ ...styles.btn, background: 'rgba(255,82,82,0.1)', color: '#ff5252', borderColor: '#ff525240' }}>🗑️ Clear</button>
        </div>
      </div>

      {/* Graph */}
      {(readings.forward.length > 2 || readings.reverse.length > 2) && (
        <div style={{ marginTop: 16 }}>
          <GraphPlotter
            title="V-I Characteristics"
            xLabel="Voltage (V)"
            yLabel="Current (mA)"
            datasets={[
              ...(readings.forward.length > 1 ? [{ label: 'Forward Bias', data: readings.forward.map(r => ({ x: r.v, y: r.i })), color: '#4f8cff' }] : []),
              ...(readings.reverse.length > 1 ? [{ label: 'Reverse Bias', data: readings.reverse.map(r => ({ x: r.v, y: r.i * 1000 })), color: '#ff5252' }] : []),
            ]}
            xData={[...(readings.forward.length > 1 ? readings.forward.map(r => r.v.toFixed(2)) : readings.reverse.map(r => r.v.toFixed(1)))]  }
            yData={[...(readings.forward.length > 1 ? readings.forward.map(r => r.i) : readings.reverse.map(r => r.i * 1000))]}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  circuit: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 8 },
  controls: { marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  label: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 130 },
  value: { fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 },
  btnRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  btn: { padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
};
