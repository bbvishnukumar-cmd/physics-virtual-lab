import { useState } from 'react';

const GATES = {
  AND: { ic: '7408', fn: (a, b) => a && b, symbol: '·' },
  OR: { ic: '7432', fn: (a, b) => a || b, symbol: '+' },
  NOT: { ic: '7404', fn: (a) => !a, symbol: "'" },
  NAND: { ic: '7400', fn: (a, b) => !(a && b), symbol: '↑' },
  NOR: { ic: '7402', fn: (a, b) => !(a || b), symbol: '↓' },
  XOR: { ic: '7486', fn: (a, b) => a !== b, symbol: '⊕' },
};

export default function LogicGates({ onReading }) {
  const [selectedGate, setSelectedGate] = useState('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [truthTable, setTruthTable] = useState([]);

  const gate = GATES[selectedGate];
  const isNOT = selectedGate === 'NOT';
  const output = isNOT ? gate.fn(inputA) : gate.fn(inputA, inputB);

  const generateTruthTable = () => {
    const rows = isNOT
      ? [[0, '-', gate.fn(false) ? 1 : 0], [1, '-', gate.fn(true) ? 1 : 0]]
      : [[0, 0, gate.fn(false, false) ? 1 : 0], [0, 1, gate.fn(false, true) ? 1 : 0], [1, 0, gate.fn(true, false) ? 1 : 0], [1, 1, gate.fn(true, true) ? 1 : 0]];
    setTruthTable(rows);
  };

  return (
    <div>
      {/* Gate selector */}
      <div style={styles.gateSelector}>
        {Object.keys(GATES).map(g => (
          <button key={g} onClick={() => { setSelectedGate(g); setTruthTable([]); }}
            style={{ ...styles.gateBtn, ...(selectedGate === g ? styles.gateBtnActive : {}) }}>
            {g}<span style={styles.icLabel}> ({GATES[g].ic})</span>
          </button>
        ))}
      </div>

      {/* Circuit visualization */}
      <div style={styles.circuit}>
        <svg width="100%" height="240" viewBox="0 0 500 240">
          {/* Power */}
          <rect x="10" y="10" width="70" height="25" rx="5" fill="rgba(0,230,118,0.1)" stroke="rgba(0,230,118,0.3)" strokeWidth="1" />
          <text x="45" y="27" textAnchor="middle" fill="#00e676" fontSize="10" fontFamily="Inter">+5V DC</text>

          {/* IC chip */}
          <rect x="180" y="60" width="140" height="120" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(79,140,255,0.3)" strokeWidth="2" />
          <text x="250" y="90" textAnchor="middle" fill="#4f8cff" fontSize="14" fontWeight="bold" fontFamily="Inter">IC {gate.ic}</text>
          <text x="250" y="108" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="Inter">{selectedGate} Gate</text>

          {/* Pin labels */}
          <text x="190" y="140" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter">Pin 1: A</text>
          <text x="190" y="155" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter">{isNOT ? '' : 'Pin 2: B'}</text>
          <text x="190" y="170" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter">Pin 3: Y</text>

          {/* Input A switch */}
          <g onClick={() => setInputA(!inputA)} style={{ cursor: 'pointer' }}>
            <rect x="40" y="100" width="80" height="35" rx="8" fill={inputA ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)'} stroke={inputA ? '#00e676' : '#ff5252'} strokeWidth="1.5" />
            <text x="80" y="115" textAnchor="middle" fill={inputA ? '#00e676' : '#ff5252'} fontSize="10" fontWeight="bold" fontFamily="Inter">A = {inputA ? '1 (HIGH)' : '0 (LOW)'}</text>
            <text x="80" y="128" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">Click to toggle</text>
          </g>
          <line x1="120" y1="117" x2="180" y2="117" stroke={inputA ? '#00e676' : 'rgba(255,255,255,0.15)'} strokeWidth="2" />

          {/* Input B switch */}
          {!isNOT && (
            <g onClick={() => setInputB(!inputB)} style={{ cursor: 'pointer' }}>
              <rect x="40" y="150" width="80" height="35" rx="8" fill={inputB ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)'} stroke={inputB ? '#00e676' : '#ff5252'} strokeWidth="1.5" />
              <text x="80" y="165" textAnchor="middle" fill={inputB ? '#00e676' : '#ff5252'} fontSize="10" fontWeight="bold" fontFamily="Inter">B = {inputB ? '1 (HIGH)' : '0 (LOW)'}</text>
              <text x="80" y="178" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">Click to toggle</text>
            </g>
          )}
          {!isNOT && <line x1="120" y1="167" x2="180" y2="167" stroke={inputB ? '#00e676' : 'rgba(255,255,255,0.15)'} strokeWidth="2" />}

          {/* Output LED */}
          <line x1="320" y1="140" x2="380" y2="140" stroke={output ? '#ffab00' : 'rgba(255,255,255,0.15)'} strokeWidth="2" />
          <circle cx="410" cy="140" r="22" fill={output ? 'rgba(255,171,0,0.2)' : 'rgba(255,255,255,0.03)'} stroke={output ? '#ffab00' : 'rgba(255,255,255,0.15)'} strokeWidth="2" />
          {output && <circle cx="410" cy="140" r="30" fill="rgba(255,171,0,0.08)"><animate attributeName="r" values="25;35;25" dur="1s" repeatCount="indefinite" /></circle>}
          <text x="410" y="137" textAnchor="middle" fill={output ? '#ffab00' : 'rgba(255,255,255,0.3)'} fontSize="10" fontWeight="bold" fontFamily="Inter">LED</text>
          <text x="410" y="150" textAnchor="middle" fill={output ? '#ffab00' : 'rgba(255,255,255,0.3)'} fontSize="9" fontFamily="Inter">{output ? 'ON (1)' : 'OFF (0)'}</text>

          {/* Expression */}
          <text x="250" y="210" textAnchor="middle" fill="#7c5cff" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
            Y = {isNOT ? `A' = ${output ? 1 : 0}` : `A ${gate.symbol} B = ${output ? 1 : 0}`}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setInputA(!inputA)} style={{ ...styles.toggleBtn, background: inputA ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: inputA ? '#00e676' : '#ff5252', borderColor: inputA ? '#00e67640' : '#ff525240' }}>A = {inputA ? 1 : 0}</button>
        {!isNOT && <button onClick={() => setInputB(!inputB)} style={{ ...styles.toggleBtn, background: inputB ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: inputB ? '#00e676' : '#ff5252', borderColor: inputB ? '#00e67640' : '#ff525240' }}>B = {inputB ? 1 : 0}</button>}
        <button onClick={generateTruthTable} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #7c5cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(124,92,255,0.1)', color: '#7c5cff' }}>📋 Truth Table</button>
        <button onClick={() => onReading && onReading([inputA ? '1' : '0', isNOT ? '-' : inputB ? '1' : '0', output ? '1' : '0'])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
      </div>

      {/* Truth table */}
      {truthTable.length > 0 && (
        <div style={styles.truthTable}>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: 8 }}>{selectedGate} Gate Truth Table (IC {gate.ic})</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={styles.th}>A</th>{!isNOT && <th style={styles.th}>B</th>}<th style={styles.th}>Y</th>
            </tr></thead>
            <tbody>
              {truthTable.map((row, i) => (
                <tr key={i}>
                  <td style={styles.td}>{row[0]}</td>
                  {!isNOT && <td style={styles.td}>{row[1]}</td>}
                  <td style={{ ...styles.td, color: row[isNOT ? 2 : 2] ? '#00e676' : '#ff5252', fontWeight: 600 }}>{row[isNOT ? 2 : 2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  gateSelector: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 },
  gateBtn: { padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' },
  gateBtnActive: { background: 'rgba(79,140,255,0.15)', borderColor: 'rgba(79,140,255,0.3)', color: '#4f8cff' },
  icLabel: { fontSize: '0.7rem', fontWeight: 400, opacity: 0.6 },
  circuit: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 8 },
  toggleBtn: { padding: '8px 20px', borderRadius: 10, border: '1px solid', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" },
  truthTable: { marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' },
  th: { padding: '8px 16px', textAlign: 'center', background: 'rgba(79,140,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td: { padding: '8px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontFamily: "'JetBrains Mono'", borderBottom: '1px solid rgba(255,255,255,0.04)' },
};
