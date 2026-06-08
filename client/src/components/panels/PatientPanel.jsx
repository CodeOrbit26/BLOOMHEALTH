import React, { useState, useEffect, useRef } from 'react';

export default function PatientPanel({ patientId, onNavigateCommand }) {
  const [patients, setPatients] = useState([]);
  const [activeId, setActiveId] = useState(patientId || '101');
  const [patientDetail, setPatientDetail] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  const canvasRef = useRef(null);
  const eventSourceRef = useRef(null);
  const animationRef = useRef(null);

  // Vital histories for EKG rendering sync
  const vitalHR = useRef(80);

  // Fetch all patients for selection dropdown
  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error('Error loading patients list:', err));
  }, []);

  // Fetch patient static detail and establish SSE stream
  useEffect(() => {
    if (!activeId) return;

    setConnectionStatus('Connecting...');
    setVitals(null);

    // Fetch static details
    fetch(`/api/patients/${activeId}`)
      .then((res) => res.json())
      .then((data) => setPatientDetail(data))
      .catch((err) => console.error('Error details:', err));

    // Close any existing SSE stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Connect to Server-Sent Events stream
    const source = new EventSource(`/api/patients/${activeId}/stream`);
    eventSourceRef.current = source;

    source.onopen = () => {
      setConnectionStatus('Active Live Link');
    };

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVitals(data);
      vitalHR.current = data.hr;
    };

    source.onerror = (err) => {
      console.error('SSE Error:', err);
      setConnectionStatus('Error, Reconnecting');
    };

    return () => {
      if (source) source.close();
    };
  }, [activeId]);

  // Sync state if prop changes
  useEffect(() => {
    if (patientId && patientId !== activeId) {
      setActiveId(patientId);
    }
  }, [patientId]);

  // EKG Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    // Grid coordinates
    let x = 0;
    const points = [];
    const maxPoints = width;

    // Create a grid pattern
    const drawGrid = (ctx) => {
      ctx.strokeStyle = '#0e141a';
      ctx.lineWidth = 1;
      
      // Vertical gridlines
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Horizontal gridlines
      for (let j = 0; j < height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }
    };

    let beatTime = 0;

    const render = () => {
      // Clear canvas slightly to leave a faint trail (fade effect)
      ctx.fillStyle = 'rgba(2, 3, 4, 0.1)';
      ctx.fillRect(0, 0, width, height);

      drawGrid(ctx);

      // Determine beat intervals depending on Heart Rate
      // Higher HR = faster beats
      const hr = vitalHR.current || 75;
      const bpmInterval = (60 / hr) * 60; // Approximate frames per beat at 60fps

      beatTime++;
      let yOffset = height / 2;

      // Draw QRS ECG wave sequence
      if (beatTime >= bpmInterval) {
        beatTime = 0;
      }

      // QRS Pulse Simulation
      if (beatTime > 0 && beatTime < 4) {
        // P-wave (small bump)
        yOffset -= Math.sin((beatTime / 4) * Math.PI) * 8;
      } else if (beatTime >= 8 && beatTime < 10) {
        // Q-wave (small dip)
        yOffset += 6;
      } else if (beatTime >= 10 && beatTime < 14) {
        // R-wave (large upward spike)
        const t = (beatTime - 10) / 4;
        yOffset -= Math.sin(t * Math.PI) * (height * 0.45);
      } else if (beatTime >= 14 && beatTime < 18) {
        // S-wave (deep downward spike)
        const t = (beatTime - 14) / 4;
        yOffset += Math.sin(t * Math.PI) * (height * 0.2);
      } else if (beatTime >= 24 && beatTime < 32) {
        // T-wave (wider, medium bump)
        const t = (beatTime - 24) / 8;
        yOffset -= Math.sin(t * Math.PI) * 12;
      }

      points.push({ x, y: yOffset });
      if (points.length > maxPoints) {
        points.shift();
      }

      // Redraw trace line
      ctx.strokeStyle = 'var(--terminal-green)';
      ctx.shadowColor = 'rgba(0, 255, 102, 0.5)';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        // Map points to move from left to right sweep style, or scrolling
        // Let's do a moving dot sweep line
        const pt = points[i];
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          // Add sweep gap so the dot doesn't connect backwards
          const nextPt = points[i - 1];
          if (Math.abs(pt.x - nextPt.x) < 5) {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw sweeping light indicator
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, yOffset, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Advance sweep coordinate
      x = (x + 2) % width;

      // Update trace point x position
      points[points.length - 1].x = x;

      // Wipe points ahead of sweep line
      for (let i = 0; i < points.length; i++) {
        if (Math.abs(points[i].x - x) < 15) {
          points.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Clean up animation on unmount or resize
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [activeId]);

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">PAT - Patient Telemetry View</h2>
          <span className="panel-subtitle">LIVE CENTRAL MONITOR FEED</span>
        </div>
        <div>
          <span style={{ color: connectionStatus.includes('Active') ? 'var(--terminal-green)' : 'var(--terminal-amber)' }}>
            ● {connectionStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Patient Selector Dropdown */}
      <div className="patient-select-header">
        <label>Active Patient File:</label>
        <select value={activeId} onChange={(e) => setActiveId(e.target.value)}>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              ID: {p.id} — {p.name} ({p.condition})
            </option>
          ))}
        </select>
        <button className="topbar-btn" onClick={() => onNavigateCommand('DASH')}>
          Back to Dashboard
        </button>
      </div>

      {patientDetail ? (
        <div className="patient-monitor-layout">
          {/* Left Telemetry Screen */}
          <div className="telemetry-screen">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '8px' }}>
              <div>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{patientDetail.name}</span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  ({patientDetail.gender}, {patientDetail.age} y/o)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--accent-gold)' }}>ROOM: {patientDetail.room}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <div>DIAGNOSIS: <span style={{ color: '#fff' }}>{patientDetail.condition}</span></div>
              <div>CLASSIFICATION: <span className={`badge-status ${patientDetail.status.toLowerCase()}`}>{patientDetail.status}</span></div>
            </div>

            {/* EKG Canvas Graph */}
            <div className="canvas-container">
              <span className="canvas-overlay-text">ECG LEAD II (HR SYNC) - mV</span>
              <canvas ref={canvasRef}></canvas>
            </div>

            <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              * Electrocardiogram lead traces are derived dynamically from medical server nodes. Heart rate variability corresponds to real-time physiologic calculations.
            </div>
          </div>

          {/* Right Vital Cards */}
          <div className="patient-vitals-sidebar">
            {vitals ? (
              <>
                {/* Heart Rate */}
                <div className="vital-readout-card" style={{ borderColor: 'var(--terminal-green)' }}>
                  <div className="vital-label-col">
                    <span className="vital-label vital-hr">HR</span>
                    <span className="vital-unit">Beats/Min</span>
                  </div>
                  <div className="vital-value-col">
                    <span className="vital-number vital-hr">{vitals.hr}</span>
                    <div className="vital-limits">60 - 100</div>
                  </div>
                </div>

                {/* Oxygen Saturation */}
                <div className="vital-readout-card" style={{ borderColor: 'var(--terminal-cyan)' }}>
                  <div className="vital-label-col">
                    <span className="vital-label vital-spo2">SpO2</span>
                    <span className="vital-unit">Percent</span>
                  </div>
                  <div className="vital-value-col">
                    <span className="vital-number vital-spo2">{vitals.spo2}%</span>
                    <div className="vital-limits">95 - 100</div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="vital-readout-card" style={{ borderColor: 'var(--accent-gold)' }}>
                  <div className="vital-label-col">
                    <span className="vital-label vital-bp">NIBP</span>
                    <span className="vital-unit">mmHg</span>
                  </div>
                  <div className="vital-value-col">
                    <span className="vital-number vital-bp" style={{ fontSize: '24px' }}>
                      {vitals.bp_sys}/{vitals.bp_dia}
                    </span>
                    <div className="vital-limits">120/80</div>
                  </div>
                </div>

                {/* Respiratory Rate */}
                <div className="vital-readout-card" style={{ borderColor: 'var(--terminal-amber)' }}>
                  <div className="vital-label-col">
                    <span className="vital-label vital-rr">RESP</span>
                    <span className="vital-unit">Breaths/Min</span>
                  </div>
                  <div className="vital-value-col">
                    <span className="vital-number vital-rr">{vitals.rr}</span>
                    <div className="vital-limits">12 - 20</div>
                  </div>
                </div>

                {/* Temp */}
                <div className="vital-readout-card" style={{ borderColor: '#d0a0ff' }}>
                  <div className="vital-label-col">
                    <span className="vital-label vital-temp">TEMP</span>
                    <span className="vital-unit">Celsius</span>
                  </div>
                  <div className="vital-value-col">
                    <span className="vital-number vital-temp">{vitals.temp}°C</span>
                    <div className="vital-limits">36.5-37.5</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-secondary)', padding: '40px 0', textAlign: 'center' }}>
                Establishing telemetry link...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-secondary)' }}>Loading patient record...</div>
      )}
    </div>
  );
}
