import { useState, useRef, useEffect, useCallback } from 'react';

export default function Potentiometer({ onReading }) {
  const canvasRef = useRef(null);
  const [jockeyPos, setJockeyPos] = useState(50);
  const [activeCell, setActiveCell] = useState(1);
  const [keyOn, setKeyOn] = useState(false);
  const [dragging, setDragging] = useState(false);

  const E1 = 1.5, E2 = 1.08, Ebat = 3;
  const nullPoint1 = (E1 / Ebat) * 100;
  const nullPoint2 = (E2 / Ebat) * 100;
  const currentNull = activeCell === 1 ? nullPoint1 : nullPoint2;
  const galvDeflection = keyOn ? (jockeyPos - currentNull) * 0.6 : 0;
  const isBalanced = keyOn && Math.abs(jockeyPos - currentNull) < 2;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1333'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1a1f4e'; ctx.fillRect(20, 70, W - 40, H - 90);

    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText('POTENTIOMETER', W / 2, 35);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
    ctx.fillText('Comparison of EMF of Two Cells', W / 2, 53);

    // Potentiometer wire
    const wx = 50, wy = 140, ww = W - 100;
    ctx.strokeStyle = keyOn ? '#ffab00' : '#666'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + ww, wy); ctx.stroke();

    // Scale
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '8px JetBrains Mono'; ctx.textAlign = 'center';
    for (let i = 0; i <= 100; i += 10) {
      const x = wx + (i / 100) * ww;
      ctx.beginPath(); ctx.moveTo(x, wy + 5); ctx.lineTo(x, wy + 12);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillText(i, x, wy + 22);
    }

    // Jockey
    const jx = wx + (jockeyPos / 100) * ww;
    ctx.fillStyle = keyOn ? '#00d4ff' : '#666';
    ctx.beginPath(); ctx.arc(jx, wy - 4, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = keyOn ? '#00d4ff' : 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(jx, wy); ctx.lineTo(jx, 220); ctx.stroke();

    // Galvanometer
    const gx = W / 2, gy = 250;
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = isBalanced ? '#00e676' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(gx, gy, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const na = Math.max(-35, Math.min(35, galvDeflection));
    const nr = (na - 90) * Math.PI / 180;
    ctx.strokeStyle = isBalanced ? '#00e676' : '#ff5252'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(nr) * 22, gy + Math.sin(nr) * 22); ctx.stroke();
    ctx.beginPath(); ctx.arc(gx, gy, 3, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px Inter'; ctx.fillText('G', gx, gy + 44);

    // Cells
    const c1x = 120, c2x = W - 120, cy = 330;
    [{ x: c1x, label: 'E₁ = 1.5V', active: activeCell === 1 }, { x: c2x, label: 'E₂ = 1.08V', active: activeCell === 2 }].forEach(cell => {
      ctx.fillStyle = cell.active ? 'rgba(79,140,255,0.1)' : 'rgba(255,255,255,0.03)';
      ctx.strokeStyle = cell.active ? '#4f8cff' : 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(cell.x - 50, cy - 20, 100, 40, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = cell.active ? '#4f8cff' : 'rgba(255,255,255,0.4)'; ctx.font = 'bold 11px Inter';
      ctx.fillText(cell.label, cell.x, cy + 4);
    });

    // Battery
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(W / 2 - 40, H - 60, 80, 30, 6); ctx.fill();
    ctx.fillStyle = keyOn ? '#00e676' : 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter';
    ctx.fillText('🔋 3V Battery', W / 2, H - 40);

    // Readings
    if (keyOn) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(30, 170, 150, 50, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
      ctx.fillText(`Cell: E${activeCell}`, 42, 190);
      ctx.fillText(`l = ${jockeyPos.toFixed(1)} cm`, 42, 206);
    }

    if (isBalanced && keyOn) {
      ctx.fillStyle = 'rgba(0,230,118,0.1)'; ctx.strokeStyle = '#00e676'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(W / 2 - 70, 85, 140, 28, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00e676'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
      ctx.fillText('✓ NULL POINT FOUND!', W / 2, 103);
    }

    if (keyOn) {
      ctx.strokeStyle = 'rgba(79,140,255,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -(Date.now() / 50) % 8;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, H - 45); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wx + ww, wy); ctx.lineTo(wx + ww, H - 45); ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [jockeyPos, activeCell, keyOn, galvDeflection, isBalanced]);

  useEffect(() => { draw(); if (keyOn) { const id = setInterval(draw, 50); return () => clearInterval(id); } }, [draw, keyOn]);

  const handleMouseMove = (e) => { if (!dragging) return; const rect = canvasRef.current.getBoundingClientRect(); const x = e.clientX - rect.left; const wx = 50, ww = canvasRef.current.width - 100; setJockeyPos(Math.max(1, Math.min(99, ((x - wx) / ww) * 100))); };
  const handleMouseDown = (e) => { const rect = canvasRef.current.getBoundingClientRect(); const x = e.clientX - rect.left, y = e.clientY - rect.top; const wx = 50, ww = canvasRef.current.width - 100; const jx = wx + (jockeyPos / 100) * ww; if (Math.abs(x - jx) < 20 && y > 110 && y < 230) setDragging(true); };

  return (
    <div>
      <canvas ref={canvasRef} width={620} height={420} style={{ width: '100%', maxWidth: 620, borderRadius: 12, cursor: 'pointer', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 120 }}>Jockey Position</label>
          <input type="range" min="1" max="99" step="0.5" value={jockeyPos} onChange={e => setJockeyPos(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{jockeyPos.toFixed(1)} cm</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setKeyOn(k => !k)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: keyOn ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: keyOn ? '#00e676' : '#ff5252', borderColor: keyOn ? '#00e67640' : '#ff525240' }}>{keyOn ? '⚡ ON' : '⚡ OFF'}</button>
          <button onClick={() => setActiveCell(activeCell === 1 ? 2 : 1)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #7c5cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(124,92,255,0.1)', color: '#7c5cff' }}>🔄 Cell E{activeCell === 1 ? '₂' : '₁'}</button>
          <button onClick={() => onReading && onReading(['', jockeyPos.toFixed(1), '', (activeCell === 1 ? nullPoint1 / nullPoint2 : nullPoint2 / nullPoint1).toFixed(3)])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
    </div>
  );
}
