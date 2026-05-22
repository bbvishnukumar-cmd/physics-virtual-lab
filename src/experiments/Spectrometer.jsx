import { useState, useRef, useEffect, useCallback } from 'react';

export default function Spectrometer({ onReading }) {
  const canvasRef = useRef(null);
  const [telescopeAngle, setTelescopeAngle] = useState(0);
  const [prismPlaced, setPrismPlaced] = useState(true);
  const [lightOn, setLightOn] = useState(false);

  const A = 60; // prism angle
  const D = 38; // minimum deviation
  const mu = Math.sin(((A + D) / 2) * Math.PI / 180) / Math.sin((A / 2) * Math.PI / 180);
  const minDevAngle = 180 + D / 2;
  const isMinDev = lightOn && prismPlaced && Math.abs(telescopeAngle - minDevAngle) < 3;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1333'; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText('SPECTROMETER', W / 2, 30);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
    ctx.fillText('Refractive Index of Prism', W / 2, 48);

    const cx = W / 2, cy = H / 2 + 20;

    // Circular scale
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 135, 0, Math.PI * 2); ctx.stroke();

    // Degree marks
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '7px JetBrains Mono';
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = deg * Math.PI / 180;
      const inner = deg % 30 === 0 ? 125 : deg % 10 === 0 ? 130 : 133;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
      ctx.lineTo(cx + Math.cos(rad) * 138, cy + Math.sin(rad) * 138);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = deg % 30 === 0 ? 1.5 : 0.5; ctx.stroke();
      if (deg % 30 === 0) {
        ctx.textAlign = 'center';
        ctx.fillText(deg.toString(), cx + Math.cos(rad) * 118, cy + Math.sin(rad) * 118 + 3);
      }
    }

    // Prism table
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Prism
    if (prismPlaced) {
      ctx.fillStyle = lightOn ? 'rgba(79,140,255,0.2)' : 'rgba(255,255,255,0.08)';
      ctx.strokeStyle = lightOn ? '#4f8cff' : 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 30); ctx.lineTo(cx - 26, cy + 15); ctx.lineTo(cx + 26, cy + 15);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      if (lightOn) { ctx.shadowColor = '#4f8cff'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0; }
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
      ctx.fillText('PRISM', cx, cy + 30);
    }

    // Collimator (left)
    ctx.strokeStyle = lightOn ? '#ffab00' : 'rgba(255,255,255,0.2)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 150, cy); ctx.lineTo(cx - 50, cy); ctx.stroke();
    ctx.fillStyle = lightOn ? '#ffab00' : 'rgba(255,255,255,0.3)'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Collimator', cx - 100, cy - 12);

    // Light ray through prism
    if (lightOn && prismPlaced) {
      ctx.strokeStyle = '#ffab00'; ctx.lineWidth = 2; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(cx - 50, cy); ctx.lineTo(cx - 10, cy - 5); ctx.stroke();
      // Refracted ray
      const refAngle = (180 + D) * Math.PI / 180;
      ctx.strokeStyle = '#ff6eb4'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx + 10, cy - 5);
      ctx.lineTo(cx + 10 + Math.cos(refAngle + Math.PI) * 80, cy - 5 + Math.sin(refAngle + Math.PI) * 80); ctx.stroke();
      // Spectrum colors
      const colors = ['#8b00ff', '#0000ff', '#00d4ff', '#00ff00', '#ffff00', '#ff8800', '#ff0000'];
      colors.forEach((c, i) => {
        const spread = (i - 3) * 0.02;
        ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(cx + 10, cy - 5);
        ctx.lineTo(cx + 10 + Math.cos(refAngle + Math.PI + spread) * 90, cy - 5 + Math.sin(refAngle + Math.PI + spread) * 90);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    // Telescope
    const tRad = telescopeAngle * Math.PI / 180;
    ctx.strokeStyle = isMinDev ? '#00e676' : '#00d4ff'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(tRad) * 50, cy + Math.sin(tRad) * 50);
    ctx.lineTo(cx + Math.cos(tRad) * 140, cy + Math.sin(tRad) * 140); ctx.stroke();
    ctx.fillStyle = isMinDev ? '#00e676' : '#00d4ff'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Telescope', cx + Math.cos(tRad) * 110, cy + Math.sin(tRad) * 110 - 10);

    // Readings
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(20, H - 80, 200, 65, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`Telescope: ${telescopeAngle.toFixed(1)}°`, 32, H - 58);
    ctx.fillText(`Prism angle A = ${A}°`, 32, H - 42);
    if (isMinDev) {
      ctx.fillStyle = '#00e676'; ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`D = ${D}° | μ = ${mu.toFixed(3)}`, 32, H - 24);
    }

    if (isMinDev) {
      ctx.fillStyle = 'rgba(0,230,118,0.1)'; ctx.strokeStyle = '#00e676'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(W / 2 - 80, 60, 160, 28, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00e676'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
      ctx.fillText('✓ MINIMUM DEVIATION', W / 2, 78);
    }
  }, [telescopeAngle, prismPlaced, lightOn, isMinDev, mu]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef} width={620} height={420} style={{ width: '100%', maxWidth: 620, borderRadius: 12, display: 'block', border: '1px solid rgba(255,255,255,0.06)' }} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 140 }}>Telescope Angle (°)</label>
          <input type="range" min="0" max="360" step="0.5" value={telescopeAngle} onChange={e => setTelescopeAngle(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{telescopeAngle.toFixed(1)}°</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setLightOn(l => !l)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: lightOn ? 'rgba(255,171,0,0.15)' : 'rgba(255,255,255,0.05)', color: lightOn ? '#ffab00' : 'rgba(255,255,255,0.5)', borderColor: lightOn ? '#ffab0040' : 'rgba(255,255,255,0.1)' }}>{lightOn ? '💡 Light ON' : '💡 Light OFF'}</button>
          <button onClick={() => onReading && onReading(['', telescopeAngle.toFixed(1), '', D.toString()])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
    </div>
  );
}
