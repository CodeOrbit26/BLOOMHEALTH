import React from 'react';

export default function HelpPanel() {
  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">HELP - Aegis Directory</h2>
          <span className="panel-subtitle">TERMINAL OPERATOR COMMAND MANUAL & SHORTKEYS</span>
        </div>
        <div>
          <span style={{ color: 'var(--accent-gold)' }}>● HELP SERVICE ONLINE</span>
        </div>
      </div>

      <div className="help-grid">
        {/* Command Codes */}
        <div className="help-section">
          <h3>Mnemonic Codes</h3>
          <ul className="help-list">
            <li className="help-item">
              <span className="help-mnemonic">DASH &lt;GO&gt;</span>
              <span className="help-desc">Load main regional hospital dashboard</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">PAT &lt;GO&gt;</span>
              <span className="help-desc">Load active patient vital monitor page</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">PAT [ID] &lt;GO&gt;</span>
              <span className="help-desc">Direct load patient file (e.g. PAT 102 &lt;GO&gt;)</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">EPIDEMIC &lt;GO&gt;</span>
              <span className="help-desc">Load epidemiological infectious monitoring</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">FDA &lt;GO&gt;</span>
              <span className="help-desc">Load FDA drug trials database and pipelines</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">CHAT &lt;GO&gt;</span>
              <span className="help-desc">Load secure doctor consultative messenger</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">NEWS &lt;GO&gt;</span>
              <span className="help-desc">Load full breaking news telegraph list</span>
            </li>
            <li className="help-item">
              <span className="help-mnemonic">HELP &lt;GO&gt;</span>
              <span className="help-desc">Load this interactive command list</span>
            </li>
          </ul>
        </div>

        {/* Interface Guide */}
        <div className="help-section">
          <h3>Terminal Quick Guide</h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '12px' }}>
              The <strong style={{ color: '#fff' }}>Aegis Health Terminal</strong> is a professional command-driven workspace designed to mimic classical analytics terminals.
            </p>
            <p style={{ marginBottom: '12px' }}>
              <strong>Command Prompts:</strong> To trigger a function, type the command mnemonic in the top-left command line prompt bar and hit the <span style={{ color: 'var(--accent-gold)' }}>[ENTER]</span> key. All command strings are automatically processed in uppercase.
            </p>
            <p>
              <strong>Color Palette Legend:</strong><br />
              ● <span style={{ color: 'var(--accent-gold)' }}>Amber:</span> Command prompts and interactive highlights.<br />
              ● <span style={{ color: 'var(--terminal-green)' }}>Green:</span> Physiological vitals/metrics in stable ranges.<br />
              ● <span style={{ color: 'var(--terminal-cyan)' }}>Cyan:</span> Direct clinical links and metadata labels.<br />
              ● <span style={{ color: 'var(--terminal-amber)' }}>Orange/Red:</span> Alert states, high transmission thresholds.
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '16px', padding: '12px', border: '1px solid #333', backgroundColor: '#090a0d', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
        <strong>DIRECT KEYBOARD SHORTCUTS:</strong> Clicking any color-coded "softkey" button on the bottom bar of the screen will automatically write the command mnemonic into the prompt input line and trigger the panel switch immediately.
      </div>
    </div>
  );
}
