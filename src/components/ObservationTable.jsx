import { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ObservationTable({ headers, data, onDataChange, onAddRow }) {
  const { t } = useLanguage();

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex] = [...newData[rowIndex]];
    newData[rowIndex][colIndex] = value;
    onDataChange(newData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>{t('expt.observations')}</h4>
        <div style={styles.actions}>
          <button style={styles.addBtn} onClick={onAddRow}>
            <Plus size={14} /> {t('expt.addReading')}
          </button>
          <button style={styles.clearBtn} onClick={() => onDataChange([])}>
            <Trash2 size={14} /> {t('expt.clearTable')}
          </button>
        </div>
      </div>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} style={styles.empty}>
                  No observations yet. Add readings from the simulation or click "Add Reading".
                </td>
              </tr>
            ) : (
              data.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={styles.td}>
                      <input
                        style={styles.cellInput}
                        value={cell}
                        onChange={e => handleCellChange(ri, ci, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.03)', borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title: { fontSize: '0.9rem', fontWeight: 600, color: '#fff' },
  actions: { display: 'flex', gap: 8 },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '5px 12px', borderRadius: 8,
    background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)',
    color: '#00e676', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
  },
  clearBtn: {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '5px 12px', borderRadius: 8,
    background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)',
    color: '#ff5252', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '10px 14px', textAlign: 'left',
    background: 'rgba(79,140,255,0.08)',
    fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '4px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  cellInput: {
    width: '100%', padding: '8px 10px', background: 'transparent',
    border: '1px solid transparent', borderRadius: 6,
    color: '#fff', fontSize: '0.84rem', outline: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'all 0.2s',
  },
  empty: {
    padding: 30, textAlign: 'center',
    color: 'rgba(255,255,255,0.3)', fontSize: '0.84rem',
  },
};
