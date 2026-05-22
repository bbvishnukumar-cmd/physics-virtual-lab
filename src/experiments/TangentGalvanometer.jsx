import { useState, useRef, useEffect, useCallback } from 'react';

export default function TangentGalvanometer({ onReading }) {
  const canvasRef = useRef(null);
  const [current, setCurrent] = useState(0.5);
  const [coilAngle, setCoilAngle] = useState(0);
  const [keyOn, setKeyOn] = useState(false);
  const [reversed, setReversed] = useState(false);

  const n = 50, r = 0.1, mu0 = 4 * Math.PI * 1e-7, Bh = 3.5e-5;
  const B = keyOn ? mu0 * n * current / (2 * r) : 0;
  const tanTheta = B / Bh;
  const theta = Math.atan(tanTheta) * (180 / Math.PI) * (reversed ? -1 : 1);
  const K = current / Math.abs(tanTheta || 1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1333'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1a1f4e'; ctx.fillRect(20, 70, W - 40, H - 90);

    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText('TANGENT GALVANOMETER', W / 2, 35);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
    ctx.fillText('Reduction Factor Determination', W / 2, 53);

    const cx = W / 2, cy = 200;
    // Coil
    ctx.strokeStyle = keyOn ? '#ffab00' : '#666'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = keyOn ? 'rgba(255,171,0,0.3)' : 'transparent'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke();

    // Compass base
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Scale markings
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '8px JetBrains Mono';
    for (let a = 0; a < 360; a += 10) {
      const rad = a * Math.PI / 180;
      const inner = a % 30 === 0 ? 38 : 42;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
      ctx.lineTo(cx + Math.cos(rad) * 46, cy + Math.sin(rad) * 46);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      if (a % 30 === 0) {
        ctx.fillText(a.toString(), cx + Math.cos(rad) * 33 - 6, cy + Math.sin(rad) * 33 + 3);
      }
    }

    // Compass needle
    const needleRad = (theta - 90) * Math.PI / 180;
    const nl = 36;
    ctx.strokeStyle = '#ff5252'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(needleRad) * nl, cy + Math.sin(needleRad) * nl); ctx.stroke();
    ctx.strokeStyle = '#4f8cff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - Math.cos(needleRad) * nl, cy - Math.sin(needleRad) * nl); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();

    // N/S labels
    ctx.fillStyle = '#ff5252'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
    ctx.fillText('N', cx, cy - 55);
    ctx.fillStyle = '#4f8cff'; ctx.fillText('S', cx, cy + 62);

    // Ammeter
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = 'rgba(79,140,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(40, 320, 130, 60, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('AMMETER', 105, 338);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px JetBrains Mono';
    ctx.fillText(`${keyOn ? current.toFixed(2) : '0.00'} A`, 105, 362);

    // Readings panel
    if (keyOn) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(W - 200, 320, 170, 60, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
      ctx.fillText(`θ = ${Math.abs(theta).toFixed(1)}°`, W - 188, 342);
      ctx.fillText(`tan θ = ${Math.abs(tanTheta).toFixed(4)}`, W - 188, 358);
      ctx.fillStyle = '#00e676'; ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`K = ${K.toFixed(3)} A`, W - 188, 374);
    }

    // Current flow
    if (keyOn) {
      ctx.strokeStyle = 'rgba(79,140,255,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -(Date.now() / 50) % 8;
      ctx.beginPath(); ctx.moveTo(cx - 80, cy); ctx.lineTo(40, cy); ctx.lineTo(40, 350); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 80, cy); ctx.lineTo(W - 40, cy); ctx.lineTo(W - 40, 350); ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [current, keyOn, theta, tanTheta, K, reversed]);

  useEffect(() => { draw(); if (keyOn) { const id = setInterval(draw, 50); return () => clearInterval(id); } }, [draw, keyOn]);

  return (
    <div>
      <canvas ref={canvasRef} width={620} height={400} style={{ width: '100%', maxWidth: 620, borderRadius: 12, cursor: 'pointer', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 120 }}>Current (A)</label>
          <input type="range" min="0.1" max="3" step="0.1" value={current} onChange={e => setCurrent(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{current.toFixed(1)} A</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setKeyOn(k => !k)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: keyOn ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: keyOn ? '#00e676' : '#ff5252', borderColor: keyOn ? '#00e67640' : '#ff525240' }}>{keyOn ? '⚡ ON' : '⚡ OFF'}</button>
          <button onClick={() => setReversed(r => !r)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #7c5cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(124,92,255,0.1)', color: '#7c5cff' }}>🔄 {reversed ? 'Reversed' : 'Direct'}</button>
          <button onClick={() => onReading && onReading(['', current.toFixed(2), Math.abs(theta).toFixed(1), Math.abs(theta).toFixed(1), '', '', Math.abs(theta).toFixed(1), Math.abs(tanTheta).toFixed(4), K.toFixed(3)])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
    </div>
  );
}
