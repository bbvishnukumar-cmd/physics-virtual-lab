import { useState } from 'react';

export default function DeMorganTheorem({ onReading }) {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [activeTheorem, setActiveTheorem] = useState(1);

  // Theorem 1: (A+B)' = A'.B'
  const t1_lhs = !(inputA || inputB);
  const t1_rhs = (!inputA) && (!inputB);
  const t1_verified = t1_lhs === t1_rhs;

  // Theorem 2: (A.B)' = A'+B'
  const t2_lhs = !(inputA && inputB);
  const t2_rhs = (!inputA) || (!inputB);
  const t2_verified = t2_lhs === t2_rhs;

  const generateFullTable = () => {
    const combos = [[false, false], [false, true], [true, false], [true, true]];
    return combos.map(([a, b]) => {
      if (activeTheorem === 1) {
        const lhs = !(a || b);
        const rhs = (!a) && (!b);
        return { a: a ? 1 : 0, b: b ? 1 : 0, lhs: lhs ? 1 : 0, rhs: rhs ? 1 : 0, match: lhs === rhs };
      } else {
        const lhs = !(a && b);
        const rhs = (!a) || (!b);
        return { a: a ? 1 : 0, b: b ? 1 : 0, lhs: lhs ? 1 : 0, rhs: rhs ? 1 : 0, match: lhs === rhs };
      }
    });
  };

  const [showTable, setShowTable] = useState(false);
  const table = generateFullTable();
  const lhs = activeTheorem === 1 ? t1_lhs : t2_lhs;
  const rhs = activeTheorem === 1 ? t1_rhs : t2_rhs;
  const verified = activeTheorem === 1 ? t1_verified : t2_verified;

  return (
    <div>
      {/* Theorem selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => { setActiveTheorem(1); setShowTable(false); }} style={{ ...styles.tBtn, ...(activeTheorem === 1 ? styles.tBtnActive : {}) }}>
          Theorem 1: (A+B)' = A'·B'
        </button>
        <button onClick={() => { setActiveTheorem(2); setShowTable(false); }} style={{ ...styles.tBtn, ...(activeTheorem === 2 ? styles.tBtnActive : {}) }}>
          Theorem 2: (A·B)' = A'+B'
        </button>
      </div>

      {/* Circuit visualization */}
      <div style={styles.circuit}>
        <svg width="100%" height="280" viewBox="0 0 620 280">
          {/* Title */}
          <text x="310" y="25" textAnchor="middle" fill="#7c5cff" fontSize="13" fontWeight="bold" fontFamily="Inter">
            {activeTheorem === 1 ? "De Morgan's First Theorem: (A+B)' = A'·B'" : "De Morgan's Second Theorem: (A·B)' = A'+B'"}
          </text>

          {/* LHS Circuit */}
          <text x="155" y="55" textAnchor="middle" fill="#4f8cff" fontSize="11" fontWeight="bold" fontFamily="Inter">LHS: {activeTheorem === 1 ? "(A+B)'" : "(A·B)'"}</text>
          <rect x="50" y="65" width="210" height="90" rx="10" fill="rgba(79,140,255,0.05)" stroke="rgba(79,140,255,0.2)" strokeWidth="1" />
          {/* Gate 1 */}
          <rect x="80" y="80" width="70" height="35" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="115" y="102" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="Inter">{activeTheorem === 1 ? 'OR' : 'AND'}</text>
          {/* NOT */}
          <rect x="170" y="80" width="60" height="35" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="200" y="102" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="Inter">NOT</text>
          <line x1="150" y1="97" x2="170" y2="97" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Output LED */}
          <circle cx="155" cy="140" r="10" fill={lhs ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.1)'} stroke={lhs ? '#00e676' : '#ff5252'} strokeWidth="1.5" />
          <text x="155" y="144" textAnchor="middle" fill={lhs ? '#00e676' : '#ff5252'} fontSize="9" fontWeight="bold">{lhs ? '1' : '0'}</text>

          {/* RHS Circuit */}
          <text x="465" y="55" textAnchor="middle" fill="#00d4ff" fontSize="11" fontWeight="bold" fontFamily="Inter">RHS: {activeTheorem === 1 ? "A'·B'" : "A'+B'"}</text>
          <rect x="360" y="65" width="210" height="90" rx="10" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
          {/* NOT gates */}
          <rect x="380" y="75" width="50" height="25" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="405" y="92" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">NOT A</text>
          <rect x="380" y="110" width="50" height="25" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="405" y="127" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">NOT B</text>
          {/* Gate */}
          <rect x="460" y="85" width="70" height="35" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="495" y="107" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="Inter">{activeTheorem === 1 ? 'AND' : 'OR'}</text>
          <line x1="430" y1="88" x2="460" y2="98" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="430" y1="122" x2="460" y2="108" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Output LED */}
          <circle cx="465" cy="140" r="10" fill={rhs ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.1)'} stroke={rhs ? '#00e676' : '#ff5252'} strokeWidth="1.5" />
          <text x="465" y="144" textAnchor="middle" fill={rhs ? '#00e676' : '#ff5252'} fontSize="9" fontWeight="bold">{rhs ? '1' : '0'}</text>

          {/* Verification */}
          <rect x="220" y="170" width="180" height="40" rx="10" fill={verified ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)'} stroke={verified ? '#00e676' : '#ff5252'} strokeWidth="2" />
          <text x="310" y="195" textAnchor="middle" fill={verified ? '#00e676' : '#ff5252'} fontSize="12" fontWeight="bold" fontFamily="Inter">
            {verified ? '✓ LHS = RHS — VERIFIED!' : '✗ LHS ≠ RHS'}
          </text>

          {/* Input display */}
          <text x="310" y="240" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">
            A = {inputA ? 1 : 0}, B = {inputB ? 1 : 0} → LHS = {lhs ? 1 : 0}, RHS = {rhs ? 1 : 0}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setInputA(!inputA)} style={{ ...styles.toggleBtn, background: inputA ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: inputA ? '#00e676' : '#ff5252', borderColor: inputA ? '#00e67640' : '#ff525240' }}>A = {inputA ? 1 : 0}</button>
        <button onClick={() => setInputB(!inputB)} style={{ ...styles.toggleBtn, background: inputB ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: inputB ? '#00e676' : '#ff5252', borderColor: inputB ? '#00e67640' : '#ff525240' }}>B = {inputB ? 1 : 0}</button>
        <button onClick={() => setShowTable(true)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #7c5cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(124,92,255,0.1)', color: '#7c5cff' }}>📋 Full Table</button>
        <button onClick={() => onReading && onReading([inputA ? '1' : '0', inputB ? '1' : '0', lhs ? '1' : '0', rhs ? '1' : '0', verified ? '✓' : '✗'])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
      </div>

      {showTable && (
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: 8 }}>
            Theorem {activeTheorem}: {activeTheorem === 1 ? "(A+B)' = A'·B'" : "(A·B)' = A'+B'"}
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={styles.th}>A</th><th style={styles.th}>B</th><th style={styles.th}>LHS</th><th style={styles.th}>RHS</th><th style={styles.th}>LHS=RHS</th>
            </tr></thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td style={styles.td}>{row.a}</td><td style={styles.td}>{row.b}</td>
                  <td style={styles.td}>{row.lhs}</td><td style={styles.td}>{row.rhs}</td>
                  <td style={{ ...styles.td, color: row.match ? '#00e676' : '#ff5252', fontWeight: 600 }}>{row.match ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: '#00e676', fontWeight: 600 }}>
            ✓ De Morgan's Theorem {activeTheorem} is verified for all input combinations!
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  tBtn: { flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" },
  tBtnActive: { background: 'rgba(124,92,255,0.15)', borderColor: 'rgba(124,92,255,0.3)', color: '#7c5cff' },
  circuit: { background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 8 },
  toggleBtn: { padding: '8px 20px', borderRadius: 10, border: '1px solid', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" },
  th: { padding: '8px 16px', textAlign: 'center', background: 'rgba(79,140,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td: { padding: '8px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontFamily: "'JetBrains Mono'", borderBottom: '1px solid rgba(255,255,255,0.04)' },
};
