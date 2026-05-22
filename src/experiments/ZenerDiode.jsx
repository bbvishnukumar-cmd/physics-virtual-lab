import { useState } from 'react';
import GraphPlotter from '../components/GraphPlotter';

export default function ZenerDiode({ onReading }) {
  const [voltage, setVoltage] = useState(0);
  const [isForward, setIsForward] = useState(true);
  const [readings, setReadings] = useState({ forward: [], reverse: [] });

  const Vz = 5.6;
  const getCurrent = (v, fwd) => {
    if (fwd) {
      if (v < 0.3) return v * 0.01;
      if (v < 0.7) return 0.003 + (v - 0.3) * 0.5;
      return 0.2 + Math.exp((v - 0.7) * 8) * 0.5;
    } else {
      if (v < Vz) return -v * 0.0008;
      return -0.005 - (v - Vz) * 15;
    }
  };

  const current = getCurrent(voltage, isForward);
  const isBreakdown = !isForward && voltage >= Vz;

  const addReading = () => {
    const key = isForward ? 'forward' : 'reverse';
    setReadings(prev => ({ ...prev, [key]: [...prev[key], { v: isForward ? voltage : -voltage, i: current }] }));
    onReading && onReading(['', (isForward ? voltage : -voltage).toFixed(2), current.toFixed(4)]);
  };

  return (
    <div>
      <div style={styles.circuit}>
        <svg width="100%" height="200" viewBox="0 0 600 200">
          <rect x="20" y="80" width="60" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke={voltage > 0 ? '#00e676' : 'rgba(255,255,255,0.15)'} strokeWidth="1.5" />
          <text x="50" y="105" textAnchor="middle" fill={voltage > 0 ? '#00e676' : 'rgba(255,255,255,0.5)'} fontSize="11" fontFamily="Inter">{voltage.toFixed(1)}V</text>
          <line x1="80" y1="100" x2="180" y2="100" stroke={voltage > 0 ? 'rgba(79,140,255,0.5)' : 'rgba(255,255,255,0.1)'} strokeWidth="2" />
          {/* Zener diode symbol */}
          <g transform="translate(220, 75)">
            <polygon points="0,25 40,0 40,50" fill={isBreakdown ? 'rgba(255,82,82,0.3)' : isForward && voltage > 0.7 ? 'rgba(79,140,255,0.2)' : 'rgba(255,255,255,0.05)'} stroke={isBreakdown ? '#ff5252' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
            <line x1="40" y1="0" x2="40" y2="50" stroke={isBreakdown ? '#ff5252' : 'rgba(255,255,255,0.2)'} strokeWidth="3" />
            <line x1="36" y1="0" x2="44" y2="0" stroke={isBreakdown ? '#ff5252' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
            <line x1="36" y1="50" x2="44" y2="50" stroke={isBreakdown ? '#ff5252' : 'rgba(255,255,255,0.2)'} strokeWidth="2" />
            {isBreakdown && <circle cx="20" cy="25" r="35" fill="rgba(255,82,82,0.06)"><animate attributeName="r" values="30;40;30" dur="1s" repeatCount="indefinite" /></circle>}
            <text x="20" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="Inter">Zener {isForward ? 'Fwd' : 'Rev'}</text>
          </g>
          <line x1="260" y1="100" x2="360" y2="100" stroke={isBreakdown ? 'rgba(255,82,82,0.5)' : 'rgba(255,255,255,0.1)'} strokeWidth="2" />
          <circle cx="400" cy="100" r="25" fill="rgba(255,255,255,0.04)" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
          <text x="400" y="95" textAnchor="middle" fill="#00d4ff" fontSize="10" fontWeight="bold" fontFamily="Inter">A</text>
          <text x="400" y="108" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">{Math.abs(current) < 1 ? (Math.abs(current) * 1000).toFixed(1) + 'μA' : Math.abs(current).toFixed(2) + 'mA'}</text>
          <circle cx="240" cy="165" r="22" fill="rgba(255,255,255,0.04)" stroke="rgba(124,92,255,0.3)" strokeWidth="1.5" />
          <text x="240" y="162" textAnchor="middle" fill="#7c5cff" fontSize="10" fontWeight="bold" fontFamily="Inter">V</text>
          <text x="240" y="174" textAnchor="middle" fill="#7c5cff" fontSize="8" fontFamily="JetBrains Mono">{voltage.toFixed(2)}V</text>
          <line x1="425" y1="100" x2="540" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="540" y1="100" x2="540" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="540" y1="160" x2="20" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="20" y1="160" x2="20" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        </svg>
        {isBreakdown && (
          <div style={styles.breakdownBadge}>⚡ ZENER BREAKDOWN at V<sub>z</sub> = {Vz}V</div>
        )}
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 130 }}>Voltage ({isForward ? '0-2V' : '0-10V'})</label>
          <input type="range" min="0" max={isForward ? 2 : 10} step={isForward ? 0.05 : 0.1} value={voltage} onChange={e => setVoltage(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{voltage.toFixed(2)} V</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => { setIsForward(f => !f); setVoltage(0); }} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: isForward ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)', color: isForward ? '#00e676' : '#ff5252', borderColor: isForward ? '#00e67640' : '#ff525240' }}>{isForward ? '➡️ Forward' : '⬅️ Reverse'}</button>
          <button onClick={addReading} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
      {(readings.forward.length > 2 || readings.reverse.length > 2) && (
        <div style={{ marginTop: 16 }}>
          <GraphPlotter title="Zener Diode V-I Characteristics" xLabel="Voltage (V)" yLabel="Current (mA)"
            xData={[...(readings.forward.length > 1 ? readings.forward : readings.reverse)].map(r => r.v.toFixed(2))}
            yData={[...(readings.forward.length > 1 ? readings.forward : readings.reverse)].map(r => r.i)} />
        </div>
      )}
    </div>
  );
}

const styles = {
  circuit: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 8, position: 'relative' },
  breakdownBadge: { position: 'absolute', top: 8, right: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,82,82,0.15)', border: '1px solid rgba(255,82,82,0.3)', color: '#ff5252', fontSize: '0.78rem', fontWeight: 600, animation: 'pulse 1s ease-in-out infinite' },
};
