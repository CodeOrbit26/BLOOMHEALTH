import React, { useState, useEffect } from 'react';

export default function FdaPanel() {
  const [trials, setTrials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fda')
      .then((res) => res.json())
      .then((data) => {
        setTrials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching clinical trials:', err);
        setLoading(false);
      });
  }, []);

  const filteredTrials = trials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.drug.toLowerCase().includes(q) ||
      t.sponsor.toLowerCase().includes(q) ||
      t.therapeuticClass.toLowerCase().includes(q)
    );
  });

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">FDA - Clinical Trials Directory</h2>
          <span className="panel-subtitle">FDA PHARMACEUTICAL DRUG PIPELINE & PIP TRIAL LOGS</span>
        </div>
        <div>
          <span style={{ color: 'var(--accent-gold)' }}>● PIPELINE SEARCH ENABLED</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="fda-search-bar">
        <input
          type="text"
          className="fda-input"
          placeholder="Filter trials by drug name, sponsor, or therapeutic class (e.g. Alzheimer's, Aegis)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="topbar-btn" onClick={() => setSearchQuery('')}>
            Clear
          </button>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-gold)', borderBottom: '1px solid #333', paddingBottom: '6px', marginBottom: '12px' }}>
          CLINICAL TRIAL PIPELINE RECORDS ({filteredTrials.length} found)
        </h3>

        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Querying FDA drug registry...</div>
        ) : filteredTrials.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No records match your query.</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>NCT ID</th>
                <th>Drug / Molecule</th>
                <th>Sponsor Company</th>
                <th>Phase</th>
                <th>Therapeutic Indication</th>
                <th>Clinical Efficacy Status</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrials.map((t) => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--terminal-green)', fontFamily: 'monospace' }}>{t.id}</td>
                  <td style={{ color: '#fff', fontWeight: 'bold' }}>{t.drug}</td>
                  <td>{t.sponsor}</td>
                  <td style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{t.phase}</td>
                  <td>{t.therapeuticClass}</td>
                  <td style={{ color: 'var(--terminal-cyan)', fontSize: '11px' }}>{t.efficacy}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.estimatedCompletion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '24px', padding: '12px', border: '1px solid #222', backgroundColor: '#0b0c10', fontSize: '11px', lineHeight: '1.4' }}>
        <span style={{ color: 'var(--terminal-cyan)', fontWeight: 'bold' }}>FDA PIPELINE NOTICE:</span> Clinical efficacy results are compiled from Phase I/II/III peer reviews and official IND filings. Investigational drugs listed under "FDA Review Pending" have submitted formal Biologics License Applications (BLAs).
      </div>
    </div>
  );
}
