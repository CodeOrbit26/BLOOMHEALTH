import React, { useState, useEffect } from 'react';

export default function DashPanel({ onNavigateCommand }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading patients:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">DASH - Clinical Dashboard</h2>
          <span className="panel-subtitle">AEGIS REGIONAL COMMAND CENTRE STATUS</span>
        </div>
        <div>
          <span style={{ color: 'var(--terminal-green)' }}>● SYSTEM SECURE</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-label">ICU Bed Occupancy</div>
          <div className="dash-card-value">92.4%</div>
          <div className="dash-card-footer">
            <span style={{ color: 'var(--terminal-red)' }}>+4.2%</span> from last hour
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Average ER Wait Time</div>
          <div className="dash-card-value">144 Min</div>
          <div className="dash-card-footer">
            <span style={{ color: 'var(--terminal-amber)' }}>↑ 12 min</span> delay trend
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Active FDA Pipelines</div>
          <div className="dash-card-value">12 Drugs</div>
          <div className="dash-card-footer">
            <span style={{ color: 'var(--terminal-green)' }}>2 Priority</span> designated
          </div>
        </div>
      </div>

      {/* Patients Census Table */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-gold)', borderBottom: '1px solid #333', paddingBottom: '6px' }}>
          PATIENT CENSUS OVERVIEW (Click row to monitor)
        </h3>
        
        {loading ? (
          <div style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>Querying patient database...</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age/Sex</th>
                <th>Admitting Diagnosis</th>
                <th>Unit / Room</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onNavigateCommand(`PAT ${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ color: 'var(--terminal-green)', fontWeight: 'bold' }}>{p.id}</td>
                  <td style={{ color: '#fff' }}>{p.name}</td>
                  <td>{p.age} / {p.gender[0]}</td>
                  <td>{p.condition}</td>
                  <td>{p.room}</td>
                  <td>
                    <span className={`badge-status ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '24px', padding: '12px', border: '1px solid #333', backgroundColor: '#090a0d', color: 'var(--text-secondary)', fontSize: '11px', lineHeight: '1.4' }}>
        <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>TELEMETRY NOTICE:</span> Double-click on any patient row above or type <code style={{ color: 'var(--terminal-green)' }}>PAT [ID] &lt;GO&gt;</code> in the terminal command line bar (e.g. <code style={{ color: 'var(--terminal-green)' }}>PAT 102 &lt;GO&gt;</code>) to spawn a dedicated real-time vital telemetry graph feed with live ECG Canvas drawing.
      </div>
    </div>
  );
}
