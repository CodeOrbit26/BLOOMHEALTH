import React from 'react';

export default function EpidemicPanel() {
  const activeOutbreaks = [
    { location: 'Pacific Northwest', pathogen: 'Influenza H5N1 (Avian)', cases: 142, r0: '1.45', risk: 'High', action: 'Vector Quarantine' },
    { location: 'New England Metro', pathogen: 'Mycoplasma Pneumoniae', cases: 890, r0: '1.18', risk: 'Medium', action: 'Enhanced Diagnostics' },
    { location: 'Southwest Border', pathogen: 'Dengue Virus (Type-3)', cases: 54, r0: '1.32', risk: 'Medium', action: 'Mosquito Mitigation' },
    { location: 'Midwest Rural', pathogen: 'Streptococcus Pneumoniae', cases: 320, r0: '0.98', risk: 'Low', action: 'Standard Monitoring' },
    { location: 'Southeast Seaboard', pathogen: 'Norovirus GII', cases: 1150, r0: '1.65', risk: 'High', action: 'Sanitation Protocols' }
  ];

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">EPIDEMIC - Global Surveillance</h2>
          <span className="panel-subtitle">EPIDEMIOLOGICAL MONITORING & PATHOGEN TRACKING</span>
        </div>
        <div>
          <span style={{ color: 'var(--terminal-red)' }}>⚠️ 2 ACTIVE CRITICAL ALERTS</span>
        </div>
      </div>

      <div className="epidemic-header-metrics">
        <div className="dash-card">
          <div className="dash-card-label">Global R0 Avg.</div>
          <div className="dash-card-value" style={{ color: 'var(--terminal-amber)' }}>1.23</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">US CDC Activity Index</div>
          <div className="dash-card-value" style={{ color: 'var(--terminal-red)' }}>4.8 / 10</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Global Surveillance Coverage</div>
          <div className="dash-card-value" style={{ color: 'var(--terminal-green)' }}>94.8%</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">WHO Alert Tier</div>
          <div className="dash-card-value" style={{ color: '#fff' }}>Tier 2</div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-gold)', borderBottom: '1px solid #333', paddingBottom: '6px', marginBottom: '12px' }}>
          ACTIVE EPIDEMIC OUTBREAKS AND PATHOGEN SURVEILLANCE
        </h3>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Geographic Cluster</th>
              <th>Primary Pathogen</th>
              <th>Active Cases</th>
              <th>R0 Index</th>
              <th>Risk Tier</th>
              <th>Clinical Directives</th>
            </tr>
          </thead>
          <tbody>
            {activeOutbreaks.map((out, idx) => (
              <tr key={idx}>
                <td style={{ color: '#fff', fontWeight: 'bold' }}>{out.location}</td>
                <td style={{ color: 'var(--terminal-cyan)' }}>{out.pathogen}</td>
                <td>{out.cases.toLocaleString()}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: parseFloat(out.r0) > 1.3 ? 'var(--terminal-red)' : 'var(--terminal-green)' }}>
                  {out.r0}
                </td>
                <td>
                  <span className={`badge-status ${out.risk === 'High' ? 'critical' : out.risk === 'Medium' ? 'guarded' : 'stable'}`}>
                    {out.risk}
                  </span>
                </td>
                <td style={{ fontSize: '10px' }}>{out.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '12px', border: '1px dashed #444', backgroundColor: '#090a0d', fontSize: '11px', lineHeight: '1.4' }}>
        <span style={{ color: 'var(--terminal-red)', fontWeight: 'bold' }}>EPIDEMIOLOGY ALERT DIRE-04:</span> Healthcare facilities in the Pacific Northwest are instructed to isolate all patients presenting with acute respiratory syndrome and suspected exposure to agricultural sectors. Run PCR molecular assays immediately.
      </div>
    </div>
  );
}
