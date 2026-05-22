import { useState, useRef, useEffect, useCallback } from 'react';

export default function MeterBridge({ onReading }) {
  const canvasRef = useRef(null);
  const [jockeyPos, setJockeyPos] = useState(50);
  const [resistance, setResistance] = useState(2);
  const [keyOn, setKeyOn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const unknownR = 3.2;
  const nullPoint = (unknownR / (unknownR + resistance)) * 100;
  const galvDeflection = keyOn ? (jockeyPos - nullPoint) * 0.8 : 0;
  const isBalanced = keyOn && Math.abs(jockeyPos - nullPoint) < 1.5;
  const calculatedR = resistance * jockeyPos / (100 - jockeyPos);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1333'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1a1f4e'; ctx.fillRect(20, 80, W - 40, H - 100);
    ctx.strokeStyle = 'rgba(79,140,255,0.15)'; ctx.lineWidth = 1; ctx.strokeRect(20, 80, W - 40, H - 100);
    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText('METER BRIDGE', W / 2, 40);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
    ctx.fillText('Wheatstone Bridge Principle', W / 2, 58);
    const bx = 60, by = 130, bw = W - 120, bh = 50, wy = by + 25;
    ctx.fillStyle = '#2a1f0a'; ctx.strokeStyle = '#5a4020'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = keyOn ? '#ffab00' : '#888'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx + 10, wy); ctx.lineTo(bx + bw - 10, wy); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'center';
    for (let i = 0; i <= 100; i += 10) {
      const x = bx + 10 + (i / 100) * (bw - 20);
      ctx.beginPath(); ctx.moveTo(x, wy + 8); ctx.lineTo(x, wy + 15); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillText(i, x, wy + 25);
    }
    const gx = W / 2, gy = 260;
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = isBalanced ? '#00e676' : 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(gx, gy, 35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.fillText('Galvanometer', gx, gy + 50);
    const needleAngle = Math.max(-40, Math.min(40, galvDeflection));
    const nrad = (needleAngle - 90) * Math.PI / 180;
    ctx.strokeStyle = isBalanced ? '#00e676' : '#ff5252'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(nrad) * 26, gy + Math.sin(nrad) * 26); ctx.stroke();
    ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    const jx = bx + 10 + (jockeyPos / 100) * (bw - 20);
    ctx.strokeStyle = keyOn ? '#00d4ff' : 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(jx, wy); ctx.lineTo(jx, gy - 35); ctx.stroke();
    ctx.fillStyle = keyOn ? '#00d4ff' : '#666'; ctx.beginPath(); ctx.arc(jx, wy - 5, 6, 0, Math.PI * 2); ctx.fill();
    if (keyOn) { ctx.strokeStyle = 'rgba(79,140,255,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -(Date.now() / 50) % 8;
      ctx.beginPath(); ctx.moveTo(bx + 10, wy); ctx.lineTo(bx + 10, H - 50); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + bw - 10, wy); ctx.lineTo(bx + bw - 10, H - 50); ctx.stroke(); ctx.setLineDash([]);
    }
    const batx = W / 2, baty = H - 55;
    ctx.fillStyle = keyOn ? '#00e676' : 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'center'; ctx.fillText('🔋 2V', batx, baty + 4);
    if (keyOn) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(30, 310, 170, 80, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
      ctx.fillText(`Jockey: ${jockeyPos.toFixed(1)} cm`, 42, 330);
      ctx.fillText(`100-l = ${(100 - jockeyPos).toFixed(1)} cm`, 42, 346);
      ctx.fillStyle = isBalanced ? '#00e676' : '#ffab00'; ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`R = ${calculatedR.toFixed(2)} Ω`, 42, 368);
    }
    if (isBalanced && keyOn) {
      ctx.fillStyle = 'rgba(0,230,118,0.1)'; ctx.strokeStyle = '#00e676'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(W / 2 - 70, 85, 140, 30, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00e676'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
      ctx.fillText('✓ NULL POINT FOUND!', W / 2, 105);
    }
  }, [jockeyPos, resistance, keyOn, galvDeflection, isBalanced, calculatedR]);

  useEffect(() => { draw(); if (keyOn) { const id = setInterval(draw, 50); return () => clearInterval(id); } }, [draw, keyOn]);

  const handleMouseMove = (e) => { if (!dragging) return; const rect = canvasRef.current.getBoundingClientRect(); const x = e.clientX - rect.left; const bx = 70, bw = canvasRef.current.width - 140; setJockeyPos(Math.max(1, Math.min(99, ((x - bx) / bw) * 100))); };
  const handleMouseDown = (e) => { const rect = canvasRef.current.getBoundingClientRect(); const x = e.clientX - rect.left, y = e.clientY - rect.top; const bx = 70, bw = canvasRef.current.width - 140; const jx = bx + (jockeyPos / 100) * bw; if (Math.abs(x - jx) < 20 && y > 120 && y < 270) setDragging(true); const W = canvasRef.current.width, H = canvasRef.current.height; if (Math.abs(x - W / 2 - 80) < 25 && Math.abs(y - H + 55) < 15) setKeyOn(k => !k); };

  return (
    <div>
      <canvas ref={canvasRef} width={620} height={420} style={{ width: '100%', maxWidth: 620, borderRadius: 12, cursor: 'pointer', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 120 }}>Resistance S (Ω)</label>
          <input type="range" min="1" max="10" step="0.5" value={resistance} onChange={e => setResistance(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{resistance} Ω</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 120 }}>Jockey Position</label>
          <input type="range" min="1" max="99" step="0.5" value={jockeyPos} onChange={e => setJockeyPos(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{jockeyPos.toFixed(1)} cm</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setKeyOn(k => !k)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: keyOn ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.1)', color: keyOn ? '#00e676' : '#ff5252', borderColor: keyOn ? '#00e67640' : '#ff525240' }}>{keyOn ? '🔌 Key ON' : '🔌 Key OFF'}</button>
          <button onClick={() => onReading && onReading(['', resistance.toString(), jockeyPos.toFixed(1), (100 - jockeyPos).toFixed(1), calculatedR.toFixed(2)])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
    </div>
  );
}
