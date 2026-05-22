import { useState, useRef, useEffect, useCallback } from 'react';

export default function DiffractionGrating({ onReading }) {
  const canvasRef = useRef(null);
  const [telescopeAngle, setTelescopeAngle] = useState(0);
  const [lightOn, setLightOn] = useState(false);

  const N = 6000; const d = 1 / (N * 100);
  const spectralLines = [
    { color: '#8b00ff', name: 'Violet', wavelength: 405, angle: Math.asin(405e-9 / d) * 180 / Math.PI },
    { color: '#0066ff', name: 'Blue', wavelength: 436, angle: Math.asin(436e-9 / d) * 180 / Math.PI },
    { color: '#00cc44', name: 'Green', wavelength: 546, angle: Math.asin(546e-9 / d) * 180 / Math.PI },
    { color: '#ffdd00', name: 'Yellow', wavelength: 579, angle: Math.asin(579e-9 / d) * 180 / Math.PI },
  ];

  const closestLine = spectralLines.reduce((best, line) => {
    const diff = Math.abs(Math.abs(telescopeAngle) - line.angle);
    return diff < best.diff ? { ...line, diff } : best;
  }, { diff: Infinity });
  const isAligned = lightOn && closestLine.diff < 1.5;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1333'; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#4f8cff'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText('DIFFRACTION GRATING', W / 2, 30);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
    ctx.fillText(`N = ${N} lines/cm | d = ${(d * 1e6).toFixed(2)} μm`, W / 2, 48);

    const cx = W / 2, cy = H / 2 + 10;

    // Grating
    ctx.fillStyle = 'rgba(124,92,255,0.1)'; ctx.strokeStyle = 'rgba(124,92,255,0.3)'; ctx.lineWidth = 2;
    ctx.fillRect(cx - 3, cy - 50, 6, 100); ctx.strokeRect(cx - 3, cy - 50, 6, 100);
    for (let y = cy - 45; y < cy + 45; y += 5) {
      ctx.strokeStyle = 'rgba(124,92,255,0.15)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - 3, y); ctx.lineTo(cx + 3, y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '9px Inter'; ctx.fillText('Grating', cx, cy + 65);

    // Incident beam
    if (lightOn) {
      ctx.strokeStyle = '#ffab00'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 200, cy); ctx.lineTo(cx - 5, cy); ctx.stroke();

      // Direct beam
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 200, cy); ctx.stroke(); ctx.setLineDash([]);

      // Diffracted beams
      spectralLines.forEach(line => {
        const rad = line.angle * Math.PI / 180;
        ctx.strokeStyle = line.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.moveTo(cx + 5, cy);
        ctx.lineTo(cx + 5 + Math.cos(-rad) * 180, cy + Math.sin(-rad) * 180); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 5, cy);
        ctx.lineTo(cx + 5 + Math.cos(rad) * 180, cy + Math.sin(rad) * 180); ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    // Telescope indicator
    const tRad = -telescopeAngle * Math.PI / 180;
    ctx.strokeStyle = isAligned ? '#00e676' : '#00d4ff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx + 5, cy);
    ctx.lineTo(cx + 5 + Math.cos(tRad) * 160, cy + Math.sin(tRad) * 160); ctx.stroke();

    // Angle arc
    if (telescopeAngle !== 0) {
      ctx.strokeStyle = 'rgba(0,212,255,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx + 5, cy, 60, 0, -telescopeAngle * Math.PI / 180, telescopeAngle > 0);
      ctx.stroke();
      ctx.fillStyle = '#00d4ff'; ctx.font = '10px JetBrains Mono';
      ctx.fillText(`θ = ${Math.abs(telescopeAngle).toFixed(1)}°`, cx + 70, cy - 10);
    }

    // Readings
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(20, H - 90, 220, 75, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`Angle: ${Math.abs(telescopeAngle).toFixed(1)}°`, 32, H - 68);
    ctx.fillText(`sin θ = ${Math.sin(Math.abs(telescopeAngle) * Math.PI / 180).toFixed(4)}`, 32, H - 52);
    if (isAligned) {
      ctx.fillStyle = closestLine.color; ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`${closestLine.name}: λ = ${closestLine.wavelength} nm`, 32, H - 32);
    }

    // Spectrum legend
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(W - 170, H - 110, 150, 95, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'left';
    ctx.fillText('SPECTRAL LINES:', W - 158, H - 92);
    spectralLines.forEach((line, i) => {
      ctx.fillStyle = line.color; ctx.beginPath(); ctx.arc(W - 150, H - 74 + i * 18, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px Inter';
      ctx.fillText(`${line.name} ${line.wavelength}nm (${line.angle.toFixed(1)}°)`, W - 140, H - 70 + i * 18);
    });
  }, [telescopeAngle, lightOn, isAligned, closestLine]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div>
      <canvas ref={canvasRef} width={620} height={420} style={{ width: '100%', maxWidth: 620, borderRadius: 12, display: 'block', border: '1px solid rgba(255,255,255,0.06)' }} />
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', minWidth: 140 }}>Telescope Angle (°)</label>
          <input type="range" min="-30" max="30" step="0.2" value={telescopeAngle} onChange={e => setTelescopeAngle(parseFloat(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono'", color: '#4f8cff', minWidth: 60 }}>{telescopeAngle.toFixed(1)}°</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setLightOn(l => !l)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: lightOn ? 'rgba(255,171,0,0.15)' : 'rgba(255,255,255,0.05)', color: lightOn ? '#ffab00' : 'rgba(255,255,255,0.5)', borderColor: lightOn ? '#ffab0040' : 'rgba(255,255,255,0.1)' }}>{lightOn ? '💡 ON' : '💡 OFF'}</button>
          <button onClick={() => onReading && isAligned && onReading([closestLine.name, '', '', '', Math.abs(telescopeAngle).toFixed(1), Math.sin(Math.abs(telescopeAngle) * Math.PI / 180).toFixed(4), closestLine.wavelength.toString()])} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #4f8cff40', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(79,140,255,0.1)', color: '#4f8cff' }}>📝 Record</button>
        </div>
      </div>
    </div>
  );
}
