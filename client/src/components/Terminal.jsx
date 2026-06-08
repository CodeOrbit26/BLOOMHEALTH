import React, { useState, useEffect, useRef } from 'react';
import DashPanel from './panels/DashPanel';
import PatientPanel from './panels/PatientPanel';
import EpidemicPanel from './panels/EpidemicPanel';
import FdaPanel from './panels/FdaPanel';
import ChatPanel from './panels/ChatPanel';
import NewsPanel from './panels/NewsPanel';
import HelpPanel from './panels/HelpPanel';

export default function Terminal({ onLogout }) {
  const [command, setCommand] = useState('');
  const [activePanel, setActivePanel] = useState('DASH'); // DASH, PATIENT, EPIDEMIC, FDA, CHAT, NEWS, HELP
  const [selectedPatientId, setSelectedPatientId] = useState('101');
  const [tickerNews, setTickerNews] = useState([]);
  
  // Autocomplete and command processing states
  const [suggestions, setSuggestions] = useState([]);
  const [systemMessage, setSystemMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Command database for validation and autocomplete
  const commands = [
    { code: 'DASH', desc: 'Clinical Dashboard' },
    { code: 'PAT', desc: 'Patient Telemetry Monitor' },
    { code: 'PAT 101', desc: 'John Doe - File' },
    { code: 'PAT 102', desc: 'Jane Smith - File' },
    { code: 'PAT 103', desc: 'Robert Chen - File' },
    { code: 'PAT 104', desc: 'Sarah Patel - File' },
    { code: 'PAT 105', desc: 'Marcus Vance - File' },
    { code: 'EPIDEMIC', desc: 'Surveillance & Outbreaks' },
    { code: 'FDA', desc: 'Clinical Drug Trials' },
    { code: 'CHAT', desc: 'Secure Consult Chat' },
    { code: 'NEWS', desc: 'Medical News Wire' },
    { code: 'HELP', desc: 'Manual & Directives' }
  ];

  // Tick clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch news for the ticking sidebar
  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => setTickerNews(data))
      .catch((err) => console.error('Error fetching sidebar news:', err));
  }, []);

  // Auto-suggest matches
  useEffect(() => {
    if (!command.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = commands.filter((c) =>
      c.code.toLowerCase().startsWith(command.toLowerCase())
    );
    setSuggestions(matches);
  }, [command]);

  // Command Execution Router
  const runCommand = (cmdText) => {
    let cleanCmd = cmdText.trim().toUpperCase();
    
    // Strip trailing "<GO>" or "GO"
    if (cleanCmd.endsWith('<GO>')) {
      cleanCmd = cleanCmd.substring(0, cleanCmd.length - 4).trim();
    } else if (cleanCmd.endsWith('GO')) {
      cleanCmd = cleanCmd.substring(0, cleanCmd.length - 2).trim();
    }

    setCommand('');
    setSuggestions([]);

    // Check custom commands e.g. PAT 102
    const patientMatch = cleanCmd.match(/^PAT\s*(\d+)$/);
    if (patientMatch) {
      const pId = patientMatch[1];
      const validIds = ['101', '102', '103', '104', '105'];
      if (validIds.includes(pId)) {
        setSelectedPatientId(pId);
        setActivePanel('PATIENT');
        setSystemMessage('');
      } else {
        setSystemMessage(`ERR: Patient ID ${pId} not registered.`);
      }
      return;
    }

    // Direct mnemonics
    switch (cleanCmd) {
      case 'DASH':
        setActivePanel('DASH');
        setSystemMessage('');
        break;
      case 'PAT':
      case 'PATIENT':
        setActivePanel('PATIENT');
        setSystemMessage('');
        break;
      case 'EPIDEMIC':
      case 'SURVEILLANCE':
        setActivePanel('EPIDEMIC');
        setSystemMessage('');
        break;
      case 'FDA':
      case 'CLINICAL':
        setActivePanel('FDA');
        setSystemMessage('');
        break;
      case 'CHAT':
      case 'MSG':
        setActivePanel('CHAT');
        setSystemMessage('');
        break;
      case 'NEWS':
      case 'WIRE':
        setActivePanel('NEWS');
        setSystemMessage('');
        break;
      case 'HELP':
      case 'MANUAL':
        setActivePanel('HELP');
        setSystemMessage('');
        break;
      default:
        setSystemMessage(`ERR: INVALID MNEMONIC "${cleanCmd}". Try HELP <GO>.`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      runCommand(command);
    }
  };

  const triggerSoftkey = (code) => {
    runCommand(code);
  };

  return (
    <div className="terminal-layout">
      {/* Top Header Command line */}
      <div className="terminal-topbar">
        <div className="topbar-left">
          <div className="terminal-indicator">{activePanel}</div>
          <div className="command-input-container">
            <span className="command-prompt">&gt;</span>
            <input
              type="text"
              className="command-input-element"
              placeholder="Enter Command (e.g. DASH <GO>)..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            {/* Auto Complete Dropdown */}
            {suggestions.length > 0 && (
              <ul className="command-autocomplete">
                {suggestions.map((s) => (
                  <li
                    key={s.code}
                    className="command-autocomplete-item"
                    onClick={() => runCommand(`${s.code} <GO>`)}
                  >
                    <span>{s.code} &lt;GO&gt;</span>
                    <span>{s.desc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {systemMessage && (
            <div style={{ color: 'var(--terminal-red)', fontSize: '11px', fontWeight: 'bold' }}>
              {systemMessage}
            </div>
          )}
        </div>

        <div className="topbar-right">
          <div className="topbar-time">{currentTime}</div>
          <button className="topbar-btn" onClick={onLogout}>
            LOGOUT (SECURE)
          </button>
        </div>
      </div>

      {/* Main Terminal Grid split with Sidebar */}
      <div className="terminal-main-workspace">
        {/* Main Panel Content Area */}
        <div className="terminal-content-area">
          {activePanel === 'DASH' && (
            <DashPanel onNavigateCommand={(cmd) => runCommand(cmd)} />
          )}
          {activePanel === 'PATIENT' && (
            <PatientPanel
              patientId={selectedPatientId}
              onNavigateCommand={(cmd) => runCommand(cmd)}
            />
          )}
          {activePanel === 'EPIDEMIC' && <EpidemicPanel />}
          {activePanel === 'FDA' && <FdaPanel />}
          {activePanel === 'CHAT' && <ChatPanel />}
          {activePanel === 'NEWS' && <NewsPanel />}
          {activePanel === 'HELP' && <HelpPanel />}
        </div>

        {/* Right Live Sidebar (Wire Ticker) */}
        <div className="terminal-side-feed">
          <div className="side-wire-header">Aegis News Telegraph</div>
          <ul className="side-wire-list">
            {tickerNews.map((wire) => (
              <li
                key={wire.id}
                className="side-wire-item"
                onClick={() => {
                  setActivePanel('NEWS');
                }}
              >
                <div className="side-wire-meta">
                  <span className="side-wire-cat">{wire.category}</span>
                  <span>{wire.time}</span>
                </div>
                <div className="side-wire-headline">{wire.headline}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Keyboard Ribbon */}
      <div className="terminal-keyboard-ribbon">
        <div className="softkey softkey-action" onClick={() => triggerSoftkey('DASH')}>
          <span>F1</span> CLINICAL
        </div>
        <div className="softkey softkey-vital" onClick={() => triggerSoftkey('PAT')}>
          <span>F2</span> PATIENT
        </div>
        <div className="softkey softkey-action" onClick={() => triggerSoftkey('EPIDEMIC')}>
          <span>F3</span> SURVEILLANCE
        </div>
        <div className="softkey softkey-action" onClick={() => triggerSoftkey('FDA')}>
          <span>F4</span> FDA REGISTRY
        </div>
        <div className="softkey softkey-action" onClick={() => triggerSoftkey('CHAT')}>
          <span>F5</span> CONSULT CHAT
        </div>
        <div className="softkey" onClick={() => triggerSoftkey('NEWS')}>
          <span>F6</span> WIRE NEWS
        </div>
        <div className="softkey softkey-help" onClick={() => triggerSoftkey('HELP')}>
          <span>F7</span> MANUAL
        </div>
      </div>
    </div>
  );
}
