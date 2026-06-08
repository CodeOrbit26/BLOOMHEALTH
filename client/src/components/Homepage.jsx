import React, { useEffect, useState, useRef } from 'react';

const PRODUCT_PAGES = [
  'aegis-terminal', 'clinical-data-feeds', 'surveillance-monitor', 'risk-analytics', 
  'regulatory-compliance', 'clinical-indices', 'terminal-overview', 'ai-medical-assist', 
  'clinical-trials', 'diagnostic-analytics', 'bioethics-care', 'remote-console', 
  'alert-surveillance', 'clinical-collaboration', 'clinical-news-wire', 'operator-training'
];

const SOLUTION_PAGES = [
  'hospital-systems', 'life-science-labs', 'health-insurers', 'er-operations', 
  'academic-research', 'icu-patient-flow', 'diagnostics-support', 'biopharma-development', 
  'outcome-analytics', 'ehr-integrations', 'clinical-index-logs'
];

export default function Homepage({ onLaunchTerminal }) {
  const [indices, setIndices] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); // 'products' | 'solutions' | 'insights' | null
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Tab Navigation: 'home' | 'insights'
  const [currentTab, setCurrentTab] = useState('home');

  // Insights Page States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Mock Articles database for Insights Page
  const articles = [
    {
      id: 1,
      title: "Built-in or bolted-on? Core telemetry integration paradigms inside ICU networks",
      description: "How native FHIR APIs enable low-latency vitals tracking without secondary software layers, streamlining critical bedside operations.",
      type: "Article",
      topic: "Clinical AI",
      imageUrl: "cube" // Graphic placeholder
    },
    {
      id: 2,
      title: "Three forces reshaping regional clinical capacity and ICU risk management",
      description: "Analyzing staffing variables, infectious transmission curves, and diagnostics throughput under modern health stress scenarios.",
      type: "Article",
      topic: "Risk",
      imageUrl: "building"
    },
    {
      id: 3,
      title: "Aegis BioLabs: Enhancing gene editing operations with CRISPR pipelines",
      description: "A case study on automating genomics workflow streams on Aegis Terminal databases, boosting analytical throughput by 42%.",
      type: "Case Study",
      topic: "BioTech",
      imageUrl: "lab"
    },
    {
      id: 4,
      title: "FDA reporting challenges in a post-Covid clinical trial environment",
      description: "Understanding new safety indices, clinical efficacy benchmarks, and priority approvals under revised IND regulatory frameworks.",
      type: "Report",
      topic: "Regulation",
      imageUrl: "charts"
    },
    {
      id: 5,
      title: "Real-time vitals feeds: Minimizing false telemetry alerts",
      description: "How predictive clinical networks filter electronic noise in heart rate monitoring to optimize nurse coordinator workflows.",
      type: "Report",
      topic: "Vitals Feeds",
      imageUrl: "vitals"
    }
  ];

  useEffect(() => {
    fetch('/api/indices')
      .then((res) => res.json())
      .then((data) => {
        if (data.indices) {
          setIndices(data.indices);
        }
      })
      .catch((err) => {
        console.error('Error fetching indices:', err);
        setIndices([
          { name: 'AEGIS BIOTECH INDEX', value: '3,842.10', change: '+42.50', pct: '+1.12%', trend: 'up' },
          { name: 'CDC EPIDEMIC LEVEL', value: '4.8', change: '+0.15', pct: '+3.23%', trend: 'up' },
          { name: 'FDA DRUG APPR RATE', value: '88%', change: '0.00', pct: '0.00%', trend: 'flat' },
          { name: 'US HOSP TRIAGE TIME (MIN)', value: '144', change: '+12.00', pct: '+9.09%', trend: 'up' }
        ]);
      });
  }, []);

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleTopicToggle = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleResetFilters = () => {
    setSelectedTopics([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? 1 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev === 1 ? 0 : prev + 1));
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic =
      selectedTopics.length === 0 || selectedTopics.includes(art.topic);
    
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(art.type);

    return matchesSearch && matchesTopic && matchesType;
  });

  return (
    <div className="homepage-container" style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Black Ribbon Utility Bar */}
      <div style={{ backgroundColor: '#000000', borderBottom: '1px solid #222', fontSize: '11px', padding: '10px 0', color: '#888888', fontWeight: 'bold' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer', color: '#aaa' }} onClick={() => { setCurrentTab('home'); setActiveMenu(null); }}>Aegis the Company & Its Products ▾</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={onLaunchTerminal}>Aegis Terminal Demo Request</span>
            <span>|</span>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={onLaunchTerminal}>
              💻 Aegis Anywhere Remote Login
            </span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }}>Aegis Customer Support</span>
          </div>
          <div style={{ color: 'var(--accent-gold)' }}>
            ● TELEMETRY ACTIVE
          </div>
        </div>
      </div>

      {/* Dynamic Live Ticker Ribbon */}
      <div className="ticker-wrap" style={{ backgroundColor: '#000000', height: '36px', borderBottom: '1px solid #111' }}>
        <div className="ticker-content">
          {[...indices, ...indices].map((idx, index) => (
            <div key={index} className="ticker-item" style={{ fontSize: '10px' }}>
              <span className="ticker-name" style={{ color: '#aaa' }}>{idx.name}</span>
              <span className="ticker-val" style={{ color: '#fff', fontWeight: 'bold' }}>{idx.value}</span>
              <span className={`ticker-change ${idx.trend === 'up' ? 'ticker-up' : idx.trend === 'down' ? 'ticker-down' : 'ticker-flat'}`}>
                {idx.change} ({idx.pct})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="nav-header" style={{ backgroundColor: '#000000', borderBottom: '1px solid #111', zIndex: 100 }}>
        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div className="logo-wrapper" onClick={() => { setActiveMenu(null); setCurrentTab('home'); }} style={{ cursor: 'pointer' }}>
            <div className="logo-text" style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
              Aegis Professional Services
            </div>
          </div>

          <nav>
            <ul className="nav-links" style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
              <li>
                <span 
                  className={`nav-link ${activeMenu === 'products' || PRODUCT_PAGES.includes(currentTab) ? 'active' : ''}`}
                  onClick={() => { toggleMenu('products'); }}
                  style={{ color: (activeMenu === 'products' || PRODUCT_PAGES.includes(currentTab)) ? 'var(--accent-gold)' : '#ffffff', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Products
                </span>
              </li>
              <li>
                <span 
                  className={`nav-link ${activeMenu === 'solutions' || SOLUTION_PAGES.includes(currentTab) ? 'active' : ''}`}
                  onClick={() => { toggleMenu('solutions'); }}
                  style={{ color: (activeMenu === 'solutions' || SOLUTION_PAGES.includes(currentTab)) ? 'var(--accent-gold)' : '#ffffff', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Solutions
                </span>
              </li>
              <li>
                <span 
                  className="nav-link"
                  onClick={() => { setActiveMenu(null); setCurrentTab('home'); alert('Contacting Aegis Institutions...'); }}
                  style={{ color: '#ffffff', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Institutions
                </span>
              </li>
              <li>
                <span 
                  className={`nav-link ${currentTab === 'insights' ? 'active' : ''}`}
                  onClick={() => { setActiveMenu(null); setCurrentTab('insights'); }}
                  style={{ color: currentTab === 'insights' ? 'var(--accent-gold)' : '#ffffff', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Insights
                </span>
              </li>
              <li>
                <span 
                  className="nav-link"
                  onClick={() => { setActiveMenu(null); alert('Aegis Help Desk Link activated.'); }}
                  style={{ color: '#ffffff', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
                >
                  Support
                </span>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button className="btn-primary" onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', color: '#ffffff', padding: '12px 24px', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', textTransform: 'none', cursor: 'pointer' }}>
              Contact Us
            </button>
          </div>
        </div>

        {/* Megamenu Dropdown - Products */}
        {activeMenu === 'products' && (
          <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, backgroundColor: '#16181d', borderBottom: '1px solid #333', zIndex: 99, padding: '36px 0', borderTop: '1px solid #222' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '40px' }}>
              
              {/* Left Column */}
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '40px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('aegis-terminal'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Aegis Terminal</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('clinical-data-feeds'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Clinical Data Feeds</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('surveillance-monitor'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Surveillance Monitor</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('risk-analytics'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Risk Analytics</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('regulatory-compliance'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Regulatory Compliance</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('clinical-indices'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Clinical Indices</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                </ul>
                <button className="btn-secondary" onClick={() => { setActiveMenu(null); setCurrentTab('aegis-terminal'); }} style={{ marginTop: '30px', width: '100%', backgroundColor: '#000000', border: '1px solid #444', color: '#fff', fontWeight: 'bold', textTransform: 'none', height: '40px', fontSize: '13px' }}>
                  See All Products
                </button>
              </div>

              {/* Middle Column */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('terminal-overview'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Terminal Overview →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('ai-medical-assist'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>AI Medical Assist →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('clinical-trials'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Clinical Trials →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('diagnostic-analytics'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Diagnostic Analytics →</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('bioethics-care'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Bioethics & Care →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('remote-console'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Remote Console →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('alert-surveillance'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Alert Surveillance →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('clinical-collaboration'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Clinical Collaboration →</span>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span onClick={() => { setActiveMenu(null); setCurrentTab('clinical-news-wire'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Clinical News Wire →</span>
                <span onClick={() => { setActiveMenu(null); setCurrentTab('operator-training'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Operator Training →</span>
              </div>

            </div>
          </div>
        )}

        {/* Megamenu Dropdown - Solutions */}
        {activeMenu === 'solutions' && (
          <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, backgroundColor: '#16181d', borderBottom: '1px solid #333', zIndex: 99, padding: '36px 0', borderTop: '1px solid #222' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr', gap: '40px' }}>
              {/* Left Column */}
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '40px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('hospital-systems'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Hospital Systems</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('life-science-labs'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Life Science & Labs</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                  <li onClick={() => { setActiveMenu(null); setCurrentTab('health-insurers'); }} style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', cursor: 'pointer', fontSize: '15px' }}>
                    <span>Health Insurers</span> <span style={{ color: '#777' }}>→</span>
                  </li>
                </ul>
              </div>
              {/* Middle Column */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('er-operations'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>ER Operations →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('academic-research'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Academic Research →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('icu-patient-flow'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>ICU Patient Flow →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('diagnostics-support'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Diagnostics Support →</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('biopharma-development'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>BioPharma Development →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('outcome-analytics'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Outcome Analytics →</span>
                  <span onClick={() => { setActiveMenu(null); setCurrentTab('ehr-integrations'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>EHR Integrations →</span>
                </div>
              </div>
              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span onClick={() => { setActiveMenu(null); setCurrentTab('clinical-index-logs'); }} style={{ color: '#bbb', cursor: 'pointer', fontSize: '14px' }}>Clinical Index Logs →</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* CONTENT AREA ROUTER */}
      {currentTab === 'home' ? (
        /* ==========================================================================
           HOMEPAGE CONTENT
           ========================================================================== */
        <main onClick={() => setActiveMenu(null)}>
          {/* Section 1: Hero Centered with Keyboard Vector Layout */}
          <div style={{ 
            position: 'relative', 
            height: '560px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(9,20,38,0.7) 0%, rgba(0,0,0,1) 80%)',
            borderBottom: '1px solid #111'
          }}>
            {/* Keyboard Grid Overlay */}
            <div style={{ position: 'absolute', opacity: 0.1, width: '80%', height: '300px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', pointerEvents: 'none', display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.1)', margin: '4px', borderRadius: '4px' }}></div>
              ))}
            </div>

            <div style={{ zIndex: 2, maxWidth: '800px', padding: '0 20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#eef', marginBottom: '24px', letterSpacing: '0.5px' }}>
                access to a global community - all from one fully integrated solution.
              </h2>
              <button className="btn-primary" onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', color: '#ffffff', padding: '16px 36px', fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                Order a Terminal Subscription
              </button>
            </div>
          </div>

          {/* Section 2: OUR PRODUCTS Section */}
          <section className="container" style={{ padding: '80px 24px' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', display: 'block', textAlign: 'center', marginBottom: '16px' }}>
              OUR PRODUCTS
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
              
              <div className="feature-card glass" onClick={() => setCurrentTab('aegis-terminal')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15 }}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
                    <rect x="0" y="0" width="100" height="60" fill="#000" stroke="#333" />
                    <path d="M 0 30 L 30 30 L 40 10 L 50 50 L 60 30 L 100 30" fill="none" stroke="var(--terminal-green)" strokeWidth="2" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Bloomberg Terminal</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

              <div className="feature-card glass" onClick={() => setCurrentTab('clinical-data-feeds')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15, fontFamily: 'monospace', fontSize: '8px', color: 'var(--terminal-cyan)' }}>
                  101: HR 82 (STABLE)<br />102: HR 105 (ALERT)<br />103: HR 68 (STABLE)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Data</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

              <div className="feature-card glass" onClick={() => setCurrentTab('clinical-collaboration')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15 }}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
                    <rect x="5" y="40" width="15" height="15" fill="var(--terminal-green)" />
                    <rect x="25" y="20" width="15" height="35" fill="var(--terminal-green)" />
                    <rect x="45" y="30" width="15" height="25" fill="var(--terminal-red)" />
                    <rect x="65" y="10" width="15" height="45" fill="var(--terminal-green)" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Trading</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

              <div className="feature-card glass" onClick={() => setCurrentTab('risk-analytics')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15, color: 'var(--terminal-red)', fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  R0: 1.45 ⚠️
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Risk</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

              <div className="feature-card glass" onClick={() => setCurrentTab('regulatory-compliance')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15 }}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
                    <circle cx="50" cy="30" r="20" fill="none" stroke="#fff" strokeWidth="2" />
                    <path d="M 40 30 L 48 38 L 62 24" fill="none" stroke="var(--terminal-green)" strokeWidth="3" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Compliance</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

              <div className="feature-card glass" onClick={() => setCurrentTab('clinical-indices')} style={{ cursor: 'pointer', position: 'relative', height: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: '#0a0d14' }}>
                <div style={{ position: 'absolute', top: 12, right: 12, width: '120px', height: '80px', opacity: 0.15 }}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }}>
                    <path d="M 0 50 L 20 40 L 40 45 L 60 20 L 80 25 L 100 5" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Indices</h3>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>➔</div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: SOLUTIONS Section */}
          <section style={{ backgroundColor: '#040508', borderTop: '1px solid #111', padding: '80px 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '60px' }}>
              <div>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>
                  SOLUTIONS
                </span>
                <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
                  Aligned with your enterprise
                </h2>
                <p style={{ color: '#888', fontSize: '14px', marginTop: '16px', lineHeight: '1.6' }}>
                  Aegis specialists will work with you every step of the way to tailor a solution to meet your firm's specific needs.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <span onClick={() => setCurrentTab('hospital-systems')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Asset Management →</span>
                  <span onClick={() => setCurrentTab('health-insurers')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Banks & Broker Dealers →</span>
                  <span onClick={() => setCurrentTab('biopharma-development')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Hedge Funds →</span>
                  <span onClick={() => setCurrentTab('outcome-analytics')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Private Wealth Management →</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <span onClick={() => setCurrentTab('academic-research')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Asset Owners →</span>
                  <span onClick={() => setCurrentTab('life-science-labs')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Corporations →</span>
                  <span onClick={() => setCurrentTab('icu-patient-flow')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Private Equity →</span>
                  <span onClick={() => setCurrentTab('bioethics-care')} style={{ color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>ESG and Sustainable Finance →</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Video Clip & Summary */}
          <section style={{ backgroundColor: '#000000', borderTop: '1px solid #111', padding: '80px 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '20px', color: '#eee', lineHeight: '1.6', marginBottom: '32px' }}>
                  insights that empower you to move faster, work smarter and more strategically, and achieve better results.
                </p>
                <button className="btn-primary" onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', padding: '14px 28px', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                  See How
                </button>
              </div>

              <div style={{ position: 'relative', height: '300px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '10px', color: 'var(--accent-gold)' }}>
                  <div style={{ borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '8px', color: '#fff' }}>AEGIS NEWS DESK - AI INSIGHT SUMMARY</div>
                  <div style={{ color: '#aaa', marginBottom: '6px' }}>• The clinical trials show 78% reduction in plaque densities...</div>
                  <div style={{ color: '#aaa', marginBottom: '6px' }}>• Medical authorities coordinate regional responses to flu clusters...</div>
                  <div style={{ color: '#aaa' }}>• FDA pipeline lists 12 new investigational molecules under fast-track BLA review.</div>
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '20px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #005aff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '28px', color: '#005aff', margin: '0 auto 16px auto' }}>▶</div>
                  <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                    Watch this quick video to learn about AI-Powered News Summaries on the Bloomberg Terminal.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: FEATURED INSIGHTS */}
          <section style={{ backgroundColor: '#050608', borderTop: '1px solid #111', padding: '80px 0' }}>
            <div className="container">
              <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', display: 'block', textAlign: 'center', marginBottom: '16px' }}>
                FEATURED INSIGHTS
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '30px', marginTop: '32px' }}>
                <button onClick={handlePrevCarousel} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>◀</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '30px', backgroundColor: '#11141c', borderRadius: '8px', padding: '32px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  {carouselIndex === 0 ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px dashed #333', paddingRight: '30px' }}>
                        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '120px' }}>
                          <path d="M 0 55 L 20 40 L 40 45 L 60 15 L 80 20 L 100 5" fill="none" stroke="var(--terminal-green)" strokeWidth="3" />
                          <path d="M 0 55 Q 30 30, 60 40 T 100 10" fill="none" stroke="var(--terminal-red)" strokeWidth="2" strokeDasharray="3,3" />
                        </svg>
                      </div>
                      <div>
                        <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>REPORT</span>
                        <h4 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '8px 0 16px 0', lineHeight: '1.3' }}>
                          EU & UK Regulatory Reporting Rewrites 2026-2030+
                        </h4>
                        <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5' }}>
                          Explore the impact of shifting regulatory updates on pharmaceutical and biotech trial compliance indexes, pipeline approvals, and reporting standards.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px dashed #333', paddingRight: '30px' }}>
                        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '120px' }}>
                          <circle cx="50" cy="30" r="22" fill="none" stroke="var(--terminal-cyan)" strokeWidth="2" />
                          <line x1="10" y1="10" x2="90" y2="50" stroke="var(--terminal-amber)" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>CASE STUDY</span>
                        <h4 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '8px 0 16px 0', lineHeight: '1.3' }}>
                          Pricing Insights: Price Discovery in Biotech & Research
                        </h4>
                        <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.5' }}>
                          How decentralized diagnostic modeling and real-time clinical indices enable cost optimization inside leading academic health systems.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <button onClick={handleNextCarousel} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}>▶</button>
              </div>
            </div>
          </section>

          {/* Section 6: Newsletter Box */}
          <section style={{ backgroundColor: '#000000', borderTop: '1px solid #111', padding: '80px 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '850px', backgroundColor: '#13161c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h3 style={{ fontSize: '28px', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                  Get insights delivered to your inbox
                </h3>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '24px' }}>
                  Sign up for Bloomberg Professional Services newsletters
                </p>
                <button className="btn-primary" onClick={() => alert('Subscribed!')} style={{ backgroundColor: '#005aff', padding: '12px 36px', fontSize: '14px', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Sign Up
                </button>
              </div>
            </div>
          </section>
        </main>
      ) : currentTab === 'insights' ? (
        /* ==========================================================================
           RESEARCH & INSIGHTS TAB PAGE (Matching Images 2, 3, 4, 5 of this turn)
           ========================================================================== */
        <main onClick={() => setActiveMenu(null)}>
          
          {/* Top Yellow Warning Banner */}
          <div style={{ backgroundColor: '#ffcc00', color: '#000000', padding: '12px 0', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }} onClick={() => alert('Webinar registration activated.')}>
            Access a broad range of analysis, research, insight, and actionable ideas with Bloomberg webinars. ➔
          </div>

          {/* Title and Intro Hero Section */}
          <section style={{ padding: '80px 0 60px 0', background: 'radial-gradient(circle, #0e121a 0%, #000 90%)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '52px', fontWeight: '800', marginBottom: '24px', color: '#ffffff' }}>
                  Research & Insights
                </h1>
                <p style={{ fontSize: '16px', color: '#cccccc', lineHeight: '1.6' }}>
                  See things you wouldn't otherwise see, know things you wouldn't otherwise know with insights on companies, industries, regions, regulations, markets and more.
                </p>
              </div>

              {/* Newsletter Box (Right Column) */}
              <div className="glass" style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.06)', background: '#11141c', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Get insights delivered to your inbox</h3>
                <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>Sign up for our Insights newsletter</p>
                <button className="btn-primary" onClick={() => alert('Subscribed!')} style={{ width: '100%', backgroundColor: '#005aff', color: '#fff', padding: '10px 0', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Sign Up
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Explore all topics (Matching Image 3 of this turn with Gold Gradient) */}
          <section style={{ 
            background: 'linear-gradient(180deg, #000000 0%, #d49a00 100%)', 
            padding: '60px 0',
            borderTop: '1px solid #111',
            textAlign: 'center'
          }}>
            <div className="container">
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '32px' }}>
                Explore all topics
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
                {[
                  'Artificial Intelligence', 'Commodities', 'Data', 'Financial Services', 
                  'Indices', 'Markets', 'Regional Analysis', 'Regulation', 'Risk', 
                  'Sustainable Finance', 'Technology', 'Trading', 'Treasury'
                ].map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => handleTopicToggle(topic)}
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-gold)' : '#000000',
                        color: isSelected ? '#000' : '#ffffff',
                        border: '1px solid #333',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'all 0.15s'
                      }}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 3: Explore all research and insights (Matching Image 4 of this turn with Filters + Grid) */}
          <section style={{ backgroundColor: '#ffffff', color: '#000000', padding: '80px 0' }}>
            <div className="container">
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#000000', marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '16px' }}>
                Explore all research and insights
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px' }}>
                
                {/* Left Column: Filters Sidebar */}
                <div style={{ fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', color: '#666' }}>FILTERS</span>
                    <button 
                      onClick={handleResetFilters}
                      style={{ background: 'transparent', border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      Reset all
                    </button>
                  </div>

                  {/* Topic Filter */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}>Topic</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {['Clinical AI', 'BioTech', 'Vitals Feeds', 'Regulation', 'Risk'].map((topic) => (
                        <label key={topic} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => handleTopicToggle(topic)}
                          />
                          {topic}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}>Type</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {['Article', 'Case Study', 'Report'].map((type) => (
                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleTypeToggle(type)}
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Search + Article Grid */}
                <div>
                  
                  {/* Search Insights Bar */}
                  <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '14px', color: '#999', fontSize: '16px' }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search insights"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '14px 16px 14px 44px',
                        color: '#000000',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Articles Grid */}
                  {filteredArticles.length === 0 ? (
                    <div style={{ color: '#666', padding: '40px 0', textAlign: 'center' }}>No dispatches match the selected filters.</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      {filteredArticles.map((art) => (
                        <div key={art.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
                          
                          {/* Image Box Mock */}
                          <div style={{ height: '160px', backgroundColor: '#eee', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {art.imageUrl === 'cube' && (
                              <div style={{ width: '60px', height: '60px', border: '2px solid #005aff', transform: 'rotateX(45deg) rotateY(45deg)', background: 'rgba(0,90,255,0.1)' }}></div>
                            )}
                            {art.imageUrl === 'building' && (
                              <svg viewBox="0 0 100 60" style={{ width: '80%', height: '80%' }}>
                                <rect x="10" y="10" width="20" height="40" fill="#bbb" />
                                <rect x="40" y="5" width="20" height="45" fill="#999" />
                                <rect x="70" y="20" width="20" height="30" fill="#ddd" />
                              </svg>
                            )}
                            {art.imageUrl === 'lab' && (
                              <span style={{ fontSize: '40px' }}>🧬</span>
                            )}
                            {art.imageUrl === 'charts' && (
                              <svg viewBox="0 0 100 60" style={{ width: '80%', height: '80%' }}>
                                <path d="M 0 50 Q 25 10, 50 40 T 100 5" fill="none" stroke="#005aff" strokeWidth="3" />
                              </svg>
                            )}
                            {art.imageUrl === 'vitals' && (
                              <span style={{ fontSize: '40px' }}>❤️</span>
                            )}
                          </div>

                          <span style={{ color: '#005aff', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {art.type} | {art.topic}
                          </span>
                          
                          <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', lineHeight: '1.3' }}>
                            {art.title}
                          </h4>

                          <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.5' }}>
                            {art.description}
                          </p>

                          <span style={{ color: '#005aff', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                            Read full story ➔
                          </span>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Load More Button */}
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button style={{ backgroundColor: '#ffffff', border: '1px solid #000', padding: '12px 32px', fontSize: '13px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                      Load More
                    </button>
                  </div>

                </div>

              </div>
            </div>
          </section>

        </main>
      ) : (
        <SubpageView pageId={currentTab} onLaunchTerminal={onLaunchTerminal} onBack={() => setCurrentTab('home')} />
      )}

      {/* FOOTER: PLAIN DARK THEME */}
      <footer style={{ backgroundColor: '#000000', color: '#ffffff', padding: '60px 0', fontSize: '12px', borderTop: '1px solid #222' }} onClick={() => setActiveMenu(null)}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '30px', paddingBottom: '40px', borderBottom: '1px solid #222' }}>
            
            {/* Contact */}
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', fontSize: '11px', letterSpacing: '0.5px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#aaaaaa' }}>
                <li>Americas +1 212 318 2000</li>
                <li>EMEA +44 20 7330 7500</li>
                <li>Asia Pacific +65 6212 1000</li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', fontSize: '11px', letterSpacing: '0.5px' }}>Customer Support</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#aaaaaa' }}>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Software Updates</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Manage Products and Account Information</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={onLaunchTerminal}>B-Unit Setup</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>FAQ</li>
              </ul>
            </div>

            {/* Client Access */}
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', fontSize: '11px', letterSpacing: '0.5px' }}>Client Access</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#aaaaaa' }}>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={onLaunchTerminal}>Bloomberg Anywhere</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Bloomberg Legal Entity Identifier</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Bloomberg Vault</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Enterprise Console</li>
                <li style={{ cursor: 'pointer', textDecoration: 'underline' }}>Entity Exchange</li>
              </ul>
            </div>

            {/* Regions */}
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', fontSize: '11px', letterSpacing: '0.5px' }}>Regions</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#aaaaaa' }}>
                <li style={{ cursor: 'pointer' }}>Brazil</li>
                <li style={{ cursor: 'pointer' }}>Simplified Chinese</li>
                <li style={{ cursor: 'pointer' }}>Traditional Chinese</li>
                <li style={{ cursor: 'pointer' }}>Japan</li>
                <li style={{ cursor: 'pointer' }}>Korea</li>
              </ul>
            </div>

            {/* Press */}
            <div>
              <h4 style={{ fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', fontSize: '11px', letterSpacing: '0.5px' }}>Press</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, color: '#aaaaaa' }}>
                <li style={{ cursor: 'pointer' }}>Announcements</li>
              </ul>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', paddingTop: '30px' }}>
            <div style={{ color: '#888888', lineHeight: '1.5' }}>
              Bloomberg Professional Services connect decision makers to a dynamic network of information, people and ideas.
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <span onClick={onLaunchTerminal} style={{ color: '#005aff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                Contact Us ➔
              </span>
              <div style={{ display: 'flex', gap: '16px', color: '#888888' }}>
                <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ==========================================================================
   SUBPAGES CONFIGURATION DATABASE
   ========================================================================== */
const SUBPAGES_CONFIG = {
  'aegis-terminal': {
    title: "Aegis Terminal",
    subtitle: "The unified platform for clinical intelligence, real-time telemetry, and health systems management.",
    heroGradient: "radial-gradient(circle at top, #0d281e 0%, #000 80%)",
    stats: [
      { value: '350,000+', label: 'Clinical Operators' },
      { value: '< 2ms', label: 'Feeds Latency' },
      { value: '99.99%', label: 'Active Uptime' }
    ],
    capabilities: [
      { title: "Clinical Workflow Hub", desc: "Streamline ER diagnostics, bed triage, and practitioner assignment in one command screen." },
      { title: "Live ECG Stream", desc: "Integrate real-time Server-Sent Events vital telemetry directly into practitioner dashboards." },
      { title: "Secure Physician Chat", desc: "Instant messaging consult loops with specialists and clinical AI diagnostic assistants." }
    ],
    widgetType: "terminal-preview"
  },
  'clinical-data-feeds': {
    title: "Clinical Data Feeds",
    subtitle: "Ultra-low latency vital streaming and patient records integration via FHIR standard APIs.",
    heroGradient: "radial-gradient(circle at top, #092040 0%, #000 80%)",
    stats: [
      { value: '10ms', label: 'Avg API Latency' },
      { value: '150+', label: 'Supported EHR Models' },
      { value: '1.2B', label: 'Daily Data Packets' }
    ],
    capabilities: [
      { title: "Sub-second Telemetry", desc: "Stream live patient vitals from bedside monitors straight to central analytics consoles." },
      { title: "FHIR Native", desc: "Full compliance with HL7 FHIR standards for plug-and-play electronic health record mapping." },
      { title: "Secure Sandbox", desc: "End-to-end TLS 1.3 encryption on medical data channels protecting patient privacy." }
    ],
    widgetType: "vitals-streamer"
  },
  'surveillance-monitor': {
    title: "Surveillance Monitor",
    subtitle: "Hospital-wide and regional disease surveillance maps, active pathogen indexing, and warning portals.",
    heroGradient: "radial-gradient(circle at top, #2e0808 0%, #000 80%)",
    stats: [
      { value: 'Level 1-4', label: 'CDC Hazard Tiers' },
      { value: 'Real-time', label: 'Pathogen Alerting' },
      { value: '88%', label: 'Early-Detection Rate' }
    ],
    capabilities: [
      { title: "Outbreak Alerting", desc: "Early detection algorithms analyzing regional diagnostic consult text logs for epidemic spikes." },
      { title: "Bed Allocation Radar", desc: "Monitor active ER triage loads, intensive care unit capacity ratios, and ventilator allocations." },
      { title: "Zoonotic Tracking", desc: "Integrate veterinary disease databases with human clinical triage logs for comprehensive monitoring." }
    ],
    widgetType: "outbreak-monitor"
  },
  'risk-analytics': {
    title: "Risk Analytics",
    subtitle: "Predictive ICU risk modeling, patient triage indexing, and mortality prognostic algorithms.",
    heroGradient: "radial-gradient(circle at top, #201a09 0%, #000 80%)",
    stats: [
      { value: '94%', label: 'Risk Model Accuracy' },
      { value: '100k+', label: 'Clinical Test Trials' },
      { value: '45m', label: 'Early Warning Lead' }
    ],
    capabilities: [
      { title: "Prognostic Triage", desc: "Assess patient vital trajectory patterns over 24-hour periods to flag early decompensation markers." },
      { title: "Sepsis Predetector", desc: "ML neural networks checking white blood cell indices, body temp, and blood pressure changes." },
      { title: "Resource Risk Profiler", desc: "Predict hospital supply demand, ICU bed occupancy bottlenecks, and pharmaceutical burn-rates." }
    ],
    widgetType: "risk-calculator"
  },
  'regulatory-compliance': {
    title: "Regulatory Compliance",
    subtitle: "Automated clinical trial auditing, priority approval indexing, and regulatory compliance logging.",
    heroGradient: "radial-gradient(circle at top, #111e3b 0%, #000 80%)",
    stats: [
      { value: '100%', label: 'Audit Trail Coverage' },
      { value: '25+', label: 'FDA Protocol Templates' },
      { value: '42%', label: 'Faster Filing Times' }
    ],
    capabilities: [
      { title: "Trial Audit Trail", desc: "Immutable logs documenting trial subject consent, laboratory protocols, and safety compliance audits." },
      { title: "Fast-Track FDA Index", desc: "Monitor investigational new drugs undergoing priority review, expedited trials, and breakthrough designations." },
      { title: "GCP Automated Check", desc: "Ensure Good Clinical Practice requirements are strictly met across all network study sites." }
    ],
    widgetType: "fda-tracker"
  },
  'clinical-indices': {
    title: "Clinical Indices",
    subtitle: "Market-style healthcare trackers: CDC epidemic levels, average regional triage times, and drug approval indices.",
    heroGradient: "radial-gradient(circle at top, #2c1a04 0%, #000 80%)",
    stats: [
      { value: '4 Key', label: 'Triage Benchmarks' },
      { value: '0.1s', label: 'Index Update Speed' },
      { value: 'Global', label: 'Regional Aggregation' }
    ],
    capabilities: [
      { title: "Triage Time Index", desc: "Track real-time average wait times in major emergency departments across metropolitan hubs." },
      { title: "Epidemic Level Tracker", desc: "Aggregated clinical diagnostic codes mapped into standard severity rates for respiratory viruses." },
      { title: "Biotech Approval Yields", desc: "Index monitoring daily success rates, phases completion, and approvals for healthcare startups." }
    ],
    widgetType: "indices-feed"
  },
  'terminal-overview': {
    title: "Terminal Overview",
    subtitle: "Learn how the Aegis Clinical Terminal optimizes workflows, synchronizes telemetry, and guides diagnostics.",
    heroGradient: "radial-gradient(circle at top, #15092b 0%, #000 80%)",
    stats: [
      { value: '12 Keys', label: 'Primary Mnemonics' },
      { value: '100%', label: 'Integrated Analytics' },
      { value: '2.5x', label: 'Efficiency Multiplier' }
    ],
    capabilities: [
      { title: "Mnemonic Command Shell", desc: "Fast navigation using standard key shortcuts (e.g. HELP, DASH, PATIENT) designed for high-stress settings." },
      { title: "Split-Screen Panels", desc: "Render EKG waveforms, consultant chat rooms, and patient electronic charts concurrently." },
      { title: "Offline Resiliency", desc: "Maintains vital logs and triage capabilities even under hospital network connectivity drops." }
    ],
    widgetType: "terminal-preview"
  },
  'ai-medical-assist': {
    title: "AI Medical Assist",
    subtitle: "Leverage advanced neural diagnostic copilots to evaluate clinical consult files and triage alerts.",
    heroGradient: "radial-gradient(circle at top, #092c42 0%, #000 80%)",
    stats: [
      { value: '98.7%', label: 'NLP Recall Rate' },
      { value: '75%', label: 'Symptom Match Speedup' },
      { value: 'HIPAA', label: 'Compliant Encrypt' }
    ],
    capabilities: [
      { title: "Clinical Summary Copilot", desc: "Instantly summarize patient logs, past medication errors, and critical history descriptors." },
      { title: "Differential Diagnose Gen", desc: "Synthesize clinical symptoms and telemetry signs to suggest differential diagnostic pathways." },
      { title: "Drug Interaction Alerts", desc: "Monitor patient prescriptions against active FDA recall notices and patient allergies in real time." }
    ],
    widgetType: "vitals-streamer"
  },
  'clinical-trials': {
    title: "Clinical Trials",
    subtitle: "Comprehensive clinical study registry tracking phases, molecule efficacy, and investigator files.",
    heroGradient: "radial-gradient(circle at top, #1b3820 0%, #000 80%)",
    stats: [
      { value: '15,000+', label: 'Registered Trials' },
      { value: 'Phase I-IV', label: 'Trial Coverage' },
      { value: 'Active', label: 'Recruitment Tracking' }
    ],
    capabilities: [
      { title: "Study Cohort Filter", desc: "Filter clinical candidates based on diagnostic classifications, genomics biomarkers, and age criteria." },
      { title: "Efficacy Progression", desc: "Review raw molecular success ratios, white-cell response curves, and target cell clearance charts." },
      { title: "Principal Investigator Links", desc: "Direct communication channels to lead scientists and academic sponsors via Secure Consult Chat." }
    ],
    widgetType: "fda-tracker"
  },
  'diagnostic-analytics': {
    title: "Diagnostic Analytics",
    subtitle: "Centralized laboratory analysis, laboratory data mapping, and imaging metadata synthesis.",
    heroGradient: "radial-gradient(circle at top, #3b2c07 0%, #000 80%)",
    stats: [
      { value: '150+', label: 'Diagnostic File Formats' },
      { value: 'DICOM', label: 'Native Support' },
      { value: '99.9%', label: 'Metadata Retrieval' }
    ],
    capabilities: [
      { title: "Metadata Harvesting", desc: "Extract laboratory timestamps, diagnostic values, and imaging parameters from clinical storage nodes." },
      { title: "Pathology Analytics", desc: "Track blood panel counts, biopsy report logs, and molecular chemistry indices in real time." },
      { title: "Imaging Pipeline", desc: "Fast loading of DICOM datasets directly inside Aegis Terminal clinical windows." }
    ],
    widgetType: "risk-calculator"
  },
  'bioethics-care': {
    title: "BioEthics & Care",
    subtitle: "Ensure patient outcomes, clinical trial ethics compliance, and resource distribution equity.",
    heroGradient: "radial-gradient(circle at top, #093327 0%, #000 80%)",
    stats: [
      { value: '100%', label: 'Consent Audits' },
      { value: 'IRB Standard', label: 'Compliance' },
      { value: 'Direct', label: 'Advocacy Portal' }
    ],
    capabilities: [
      { title: "Consent Records", desc: "Store cryptographically signed patient consent logs to secure data privacy guidelines." },
      { title: "Equity Audits", desc: "Analyze local ICU resource distribution models to flag socioeconomic demographic bottlenecks." },
      { title: "Ethics Directives", desc: "Comprehensive guidance on clinical protocols, therapeutic trials, and diagnostic access pathways." }
    ],
    widgetType: "dna-analyzer"
  },
  'remote-console': {
    title: "Remote Console",
    subtitle: "Access patient telemetry databases and monitor diagnostic hubs from outside the clinical facility.",
    heroGradient: "radial-gradient(circle at top, #112845 0%, #000 80%)",
    stats: [
      { value: 'AES-256', label: 'Security Grade' },
      { value: '2-Factor', label: 'Hardware Key' },
      { value: '< 5ms', label: 'Remote Latency' }
    ],
    capabilities: [
      { title: "Bloomberg Anywhere Style", desc: "Hardware biometric B-Unit authentication lets specialists login securely from home consoles." },
      { title: "Unified Device Monitoring", desc: "Manage clinical terminals, ER queue trackers, and lab servers via a single remote console." },
      { title: "Signal Resiliency", desc: "Low bandwidth connection mode preserves vital graphs stream integrity over mobile channels." }
    ],
    widgetType: "console-simulator"
  },
  'alert-surveillance': {
    title: "Alert Surveillance",
    subtitle: "Automated real-time notification loop alerting clinicians of diagnostic threshold breeches.",
    heroGradient: "radial-gradient(circle at top, #3b0707 0%, #000 80%)",
    stats: [
      { value: '< 1s', label: 'Critical Push Delay' },
      { value: '99.999%', label: 'Notification SLA' },
      { value: '75%', label: 'Fewer False Alarms' }
    ],
    capabilities: [
      { title: "Threshold Triggers", desc: "Configure custom alerts on heart rate spikes, SpO2 dips, or critical blood pressure crashes." },
      { title: "Multi-Channel Dispatch", desc: "Push alerts directly to terminal prompt screens, clinician pagers, and remote consoles." },
      { title: "Noise Cancellation", desc: "Advanced predictive filtering reduces alarms caused by physical bedside sensors shifting." }
    ],
    widgetType: "outbreak-monitor"
  },
  'clinical-collaboration': {
    title: "Clinical Collaboration",
    subtitle: "Secure instant messaging consultations, clinical cohort study groups, and physician chat panels.",
    heroGradient: "radial-gradient(circle at top, #16073b 0%, #000 80%)",
    stats: [
      { value: 'Instant', label: 'Messaging Speed' },
      { value: '100% HIPAA', label: 'Compliance' },
      { value: 'Unlimited', label: 'Chat Channels' }
    ],
    capabilities: [
      { title: "Consult Chat Rooms", desc: "Instant communication channels for cardiology triage, surgical planning, or epidemic response." },
      { title: "Subject Case File Share", desc: "Securely drop diagnostic values, vital trends, and laboratory logs directly into messaging boards." },
      { title: "Specialist Directory", desc: "Reach on-duty clinicians across academic research networks, regional hospital systems, and ERs." }
    ],
    widgetType: "console-simulator"
  },
  'clinical-news-wire': {
    title: "Clinical News Wire",
    subtitle: "High-speed medical news coverage, global epidemiologic updates, and priority clinical trial notices.",
    heroGradient: "radial-gradient(circle at top, #1d252e 0%, #000 80%)",
    stats: [
      { value: '24/7', label: 'Active Wire' },
      { value: '500+', label: 'Vetted Sources' },
      { value: 'Instant', label: 'Search Indexing' }
    ],
    capabilities: [
      { title: "Live Feeds Stream", desc: "Real-time updates covering major disease reports, CDC health advisories, and pharmaceutical trials." },
      { title: "Aegis AI Summaries", desc: "Short diagnostic digests explaining trial results and regulatory updates under 10 seconds." },
      { title: "Mnemonic Navigation", desc: "Fast review of medical articles using the terminal commands (NEWS or WIRE)." }
    ],
    widgetType: "vitals-streamer"
  },
  'operator-training': {
    title: "Operator Training",
    subtitle: "Professional certification modules, interactive command practice grids, and simulation trials.",
    heroGradient: "radial-gradient(circle at top, #11291b 0%, #000 80%)",
    stats: [
      { value: '12 Step', label: 'Training Course' },
      { value: 'Aegis Certified', label: 'Credentials' },
      { value: '100%', label: 'Simulator Fidelity' }
    ],
    capabilities: [
      { title: "Mnemonic Command Exercises", desc: "Simulate rapid navigation under stress to master emergency triage commands." },
      { title: "Mock Patient Telemetry", desc: "Practice patient monitoring on generated vital anomalies, diagnosing simulated cardiac distress." },
      { title: "Regulatory Auditing Drills", desc: "Master FDA IND and GCP template compliance logs inside a sandbox terminal workspace." }
    ],
    widgetType: "console-simulator"
  },
  'hospital-systems': {
    title: "Hospital Systems",
    subtitle: "Integrate ER operations, inpatient telemetry channels, and bed allocation networks globally.",
    heroGradient: "radial-gradient(circle at top, #0c1a2d 0%, #000 80%)",
    stats: [
      { value: '35%', label: 'Wait Time Reduction' },
      { value: '$2.4M', label: 'Avg System Savings' },
      { value: '99.99%', label: 'Active Connectivity' }
    ],
    capabilities: [
      { title: "ER Bed Allocation", desc: "Monitor bed status across hospital blocks, prioritizing active arrivals based on risk indices." },
      { title: "Integrated Telemetry", desc: "Consolidate vital feeds from ICU, emergency wards, and surgical recovery blocks into one screen." },
      { title: "EHR Interoperability", desc: "Eliminate custom middleware bottlenecks with full HL7 FHIR client integration." }
    ],
    widgetType: "operations-roi"
  },
  'life-science-labs': {
    title: "Life Science & Labs",
    subtitle: "Automate genome sequencing databases, CRISPR cleavage analyzers, and clinical trials tracking.",
    heroGradient: "radial-gradient(circle at top, #093019 0%, #000 80%)",
    stats: [
      { value: '42%', label: 'Workflow Acceleration' },
      { value: '10M+', label: 'Subject Sequences' },
      { value: 'Phase I-IV', label: 'Automation Support' }
    ],
    capabilities: [
      { title: "Gene Sequencing Data", desc: "Manage massive genomics datasets within high-capacity Aegis Laboratory databases." },
      { title: "CRISPR Cleavage Indexing", desc: "Evaluate guide RNA base pair efficiency using dynamic molecular diagnostics simulators." },
      { title: "Trial Pipeline Integration", desc: "Directly link research telemetry into the FDA compliance check pipeline." }
    ],
    widgetType: "dna-analyzer"
  },
  'health-insurers': {
    title: "Health Insurers",
    subtitle: "Verify clinical outcomes metrics, audit telehealth feeds, and evaluate triage risk indices.",
    heroGradient: "radial-gradient(circle at top, #2b2309 0%, #000 80%)",
    stats: [
      { value: '98%', label: 'Claim Audit Speed' },
      { value: '25%', label: 'Fewer Readmissions' },
      { value: 'Outcomes-based', label: 'Payment Models' }
    ],
    capabilities: [
      { title: "Outcomes Diagnostics", desc: "Evaluate hospital performance metrics, patient discharge times, and readmission risk levels." },
      { title: "Telehealth Auditing", desc: "Analyze telehealth vital streams, session durations, and patient-doctor consult records." },
      { title: "Risk Index Mapping", desc: "Leverage Aegis CDC index logs to model regional actuarial insurance values." }
    ],
    widgetType: "risk-calculator"
  },
  'er-operations': {
    title: "ER Operations",
    subtitle: "Optimize emergency department workflows, triage queue priorities, and physician assignments.",
    heroGradient: "radial-gradient(circle at top, #2e091b 0%, #000 80%)",
    stats: [
      { value: '-45m', label: 'Triage Time Cut' },
      { value: '98%', label: 'Staffing Efficiency' },
      { value: 'Zero', label: 'Lost Patient Logs' }
    ],
    capabilities: [
      { title: "Queue Priority Sorting", desc: "Automated ICU Risk Index calculations sort pending ER queues by immediate medical urgency." },
      { title: "Real-Time Bed Tracker", desc: "Visual alert grids indicating occupied, clean, and standby ER beds." },
      { title: "Clinician Duty Assign", desc: "Directly match arrivals to specialized ER practitioners based on symptom complexity." }
    ],
    widgetType: "operations-roi"
  },
  'academic-research': {
    title: "Academic Research",
    subtitle: "Access patient cohort registries, diagnostics indices, and genome sequence databases for peer studies.",
    heroGradient: "radial-gradient(circle at top, #14082e 0%, #000 80%)",
    stats: [
      { value: '250+', label: 'Partner Universities' },
      { value: '1.5M', label: 'Scientific Citations' },
      { value: 'Open-Access', label: 'Data Feeds' }
    ],
    capabilities: [
      { title: "Cohort Population Data", desc: "Filter and aggregate anonymous patient databases based on diagnosis codes and regions." },
      { title: "CRISPR Target Matching", desc: "Master genomics modeling using molecular biology sequences parsing copilots." },
      { title: "Research News Archive", desc: "Review decades of medical papers and clinical indices on Aegis historical servers." }
    ],
    widgetType: "dna-analyzer"
  },
  'icu-patient-flow': {
    title: "ICU Patient Flow",
    subtitle: "Maximize ICU bed capacity utilization, monitor vital warning trajectories, and plan step-down care.",
    heroGradient: "radial-gradient(circle at top, #0c2b29 0%, #000 80%)",
    stats: [
      { value: '22%', label: 'ICU Capacity Increase' },
      { value: '< 2%', label: 'Premature Discharge' },
      { value: '24/7', label: 'Telemetry Cover' }
    ],
    capabilities: [
      { title: "Vital Decoil Alerting", desc: "Early decompensation indicators warn clinicians when ICU patients are trending toward instability." },
      { title: "Step-Down Coordination", desc: "Determine readiness for general ward transfers based on long-term telemetry metrics." },
      { title: "Ventilator Allocation", desc: "Model hospital ventilator demands, predicting supply crunches hours in advance." }
    ],
    widgetType: "operations-roi"
  },
  'diagnostics-support': {
    title: "Diagnostics Support",
    subtitle: "Synthesize image analysis datasets, clinical chemistry records, and symptoms mapping copilots.",
    heroGradient: "radial-gradient(circle at top, #2e2608 0%, #000 80%)",
    stats: [
      { value: '99.5%', label: 'Diagnostic Sync' },
      { value: '200+', label: 'DICOM Studies/hr' },
      { value: '120k', label: 'Symptom Sign Maps' }
    ],
    capabilities: [
      { title: "DICOM Image Viewer", desc: "Render high-contrast radiology studies directly in split-screen clinical terminal panels." },
      { title: "Chemistry Analyzer", desc: "Parse blood lipid profiles, enzyme levels, and metabolic indicators using standard graphs." },
      { title: "Aegis AI Copilot", desc: "Integrate neural pathology models to highlight potential areas of interest in diagnostic data." }
    ],
    widgetType: "fda-tracker"
  },
  'biopharma-development': {
    title: "BioPharma Development",
    subtitle: "Expedite drug target discovery, genome CRISPR sequence analysis, and FDA compliance filing audits.",
    heroGradient: "radial-gradient(circle at top, #093026 0%, #000 80%)",
    stats: [
      { value: '3.5 yrs', label: 'Avg Dev Time Saved' },
      { value: '100k+', label: 'Simulated Molecules' },
      { value: 'GCP/GLP', label: 'Compliant Archives' }
    ],
    capabilities: [
      { title: "Molecular Simulators", desc: "Analyze binding affinities and guide RNA pairings on interactive lab modules." },
      { title: "Electronic Trial Records", desc: "Automate Good Laboratory Practice compliant documentation for investigational new drugs." },
      { title: "Expedited FDA Indices", desc: "Track IND/BLA approval criteria, expedited paths, and breakthrough designation updates." }
    ],
    widgetType: "dna-analyzer"
  },
  'outcome-analytics': {
    title: "Outcome Analytics",
    subtitle: "Review clinical efficacy ratios, readmission risk rates, and long-term recovery metrics.",
    heroGradient: "radial-gradient(circle at top, #240c2e 0%, #000 80%)",
    stats: [
      { value: '30,000+', label: 'Aggregated Outcomes' },
      { value: '96%', label: 'Prediction Accuracy' },
      { value: 'Global', label: 'EHR Data Nodes' }
    ],
    capabilities: [
      { title: "Discharge Efficacy", desc: "Compare outcomes databases across hospital regions to find treatment best practices." },
      { title: "Readmission Risk Predictor", desc: "Leverage predictive models to flag patients at risk of relapsing within 30 days of release." },
      { title: "Quality Audit Logs", desc: "Immutable logs detailing care timelines, diagnostic actions, and therapeutic outcomes." }
    ],
    widgetType: "risk-calculator"
  },
  'ehr-integrations': {
    title: "EHR Integrations",
    subtitle: "Standardize patient records mapping with native FHIR API databases and HL7 schema converters.",
    heroGradient: "radial-gradient(circle at top, #0b1a30 0%, #000 80%)",
    stats: [
      { value: '100% FHIR', label: 'Interoperability' },
      { value: 'Zero', label: 'Middleware Overheads' },
      { value: '5 Min', label: 'Sync Setup Time' }
    ],
    capabilities: [
      { title: "No-Code Schemas", desc: "Map clinical structures, doctor IDs, and patient consent files to FHIR databases without coding." },
      { title: "Low-Latency Hooks", desc: "Update local client databases instantly when hospital terminal charts receive diagnostic edits." },
      { title: "Encrypted Records Sync", desc: "Securely mirror client data nodes to centralized clinical databases with end-to-end encryption." }
    ],
    widgetType: "operations-roi"
  },
  'clinical-index-logs': {
    title: "Clinical Index Logs",
    subtitle: "Historical logs of regional epidemic indexes, ER wait times, and biotech drug approvals yield.",
    heroGradient: "radial-gradient(circle at top, #301f0b 0%, #000 80%)",
    stats: [
      { value: '10 Yrs', label: 'Historical Archives' },
      { value: '15 Min', label: 'Index Log Resolution' },
      { value: 'CSV/JSON', label: 'Export Support' }
    ],
    capabilities: [
      { title: "Epidemic Index Charts", desc: "Explore years of clinical pathogen records, tracking R0 values during historical outbreaks." },
      { title: "FDA Drug Approvals Yield", desc: "Review historical clinical trial statistics, approvals, and recall ratios by chemical class." },
      { title: "Triage Time Performance", desc: "Evaluate ER triage performance records during major regional weather or disease emergencies." }
    ],
    widgetType: "indices-feed"
  }
};

/* ==========================================================================
   INTERACTIVE SUBPAGE WIDGETS
   ========================================================================== */
function EkgMiniCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let x = 0;
    const height = canvas.height;
    const width = canvas.width;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(x, 0, 15, height);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      if (x % 20 === 0) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
      }
      ctx.stroke();

      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let y = height / 2;
      const cycle = x % 80;
      if (cycle > 30 && cycle < 34) {
        y = height / 2 - 25; // R wave
      } else if (cycle >= 34 && cycle < 38) {
        y = height / 2 + 15; // S wave
      } else if (cycle >= 38 && cycle < 44) {
        y = height / 2 - 5; // T wave
      }

      ctx.moveTo(x - 2 < 0 ? width : x - 2, height / 2);
      ctx.lineTo(x, y);
      ctx.stroke();

      x = (x + 2) % width;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} width={400} height={100} style={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '4px', width: '100%', display: 'block' }} />;
}

function VitalsStreamerWidget() {
  const [logs, setLogs] = useState([
    { time: '09:08:15', patientId: 102, hr: 82, spo2: 97, bp: '118/76' },
    { time: '09:08:13', patientId: 104, hr: 71, spo2: 99, bp: '124/82' }
  ]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString(),
        patientId: Math.floor(101 + Math.random() * 5),
        hr: Math.floor(65 + Math.random() * 40),
        spo2: Math.floor(95 + Math.random() * 5),
        bp: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 15)}`
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 3)]);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div style={{ color: '#fff', fontSize: '13px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#00ff66', fontWeight: 'bold' }}>● STREAM ACTIVE</span>
        <button 
          onClick={() => setIsLive(!isLive)}
          style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
        >
          {isLive ? 'Pause Stream' : 'Resume Stream'}
        </button>
      </div>

      <EkgMiniCanvas />

      <div style={{ marginTop: '16px', background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '12px', fontFamily: 'monospace', fontSize: '11px' }}>
        <div style={{ color: '#888', borderBottom: '1px solid #111', paddingBottom: '4px', marginBottom: '8px' }}>SSE Feed Logs:</div>
        {logs.map((log, i) => (
          <div key={i} style={{ color: '#aaa', margin: '4px 0' }}>
            <span style={{ color: '#00ff66' }}>[{log.time}]</span> Patient {log.patientId}: HR <span style={{ color: '#fff' }}>{log.hr}</span> | SpO2 <span style={{ color: '#fff' }}>{log.spo2}%</span> | BP <span style={{ color: '#fff' }}>{log.bp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskCalculatorWidget() {
  const [age, setAge] = useState(55);
  const [bp, setBp] = useState(120);
  const [rr, setRr] = useState(18);
  const [spo2, setSpo2] = useState(98);
  const [result, setResult] = useState(null);

  const calculateRisk = () => {
    let score = (age - 20) / 1.5;
    if (spo2 < 95) {
      score += (95 - spo2) * 8;
    }
    if (bp < 90 || bp > 160) {
      score += 15;
    }
    if (rr > 25 || rr < 10) {
      score += 12;
    }
    score = Math.max(0, Math.min(100, Math.round(score)));
    
    let label = 'Low Triage Risk';
    let color = '#00ff66';
    if (score > 65) {
      label = 'CRITICAL ICU ADMISSION';
      color = '#ff3b30';
    } else if (score > 35) {
      label = 'ELEVATED CLINICAL RISK';
      color = '#ff9900';
    }

    setResult({ score, label, color });
  };

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#888' }}>Age (Years)</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#888' }}>Systolic BP (mmHg)</label>
          <input type="number" value={bp} onChange={(e) => setBp(Number(e.target.value))} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#888' }}>Respiratory Rate (bpm)</label>
          <input type="number" value={rr} onChange={(e) => setRr(Number(e.target.value))} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#888' }}>Oxygen Sat (SpO2 %)</label>
          <input type="number" value={spo2} onChange={(e) => setSpo2(Number(e.target.value))} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }} />
        </div>
      </div>

      <button 
        onClick={calculateRisk}
        style={{ width: '100%', marginTop: '16px', backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
      >
        Calculate Risk Score
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '16px', border: `1px dashed ${result.color}`, borderRadius: '4px', textAlign: 'center', background: '#000' }}>
          <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>PROGNOSIS SCORE</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.color, margin: '8px 0', fontFamily: 'monospace' }}>{result.score} %</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{result.label}</div>
        </div>
      )}
    </div>
  );
}

function OutbreakMonitorWidget() {
  const [multiplier, setMultiplier] = useState(1);
  
  const getSeverity = (base) => {
    const val = base * multiplier;
    if (val > 8) return { label: 'CRITICAL WARNING', color: '#ff3b30' };
    if (val > 4) return { label: 'ELEVATED THREAT', color: '#ff9900' };
    return { label: 'LOW INCIDENCE', color: '#00ff66' };
  };

  const respiratory = getSeverity(1.2);
  const enteric = getSeverity(0.8);
  const zoonotic = getSeverity(0.4);

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '8px' }}>Pathogen Threat Multiplier: {multiplier}x</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={multiplier} 
          onChange={(e) => setMultiplier(Number(e.target.value))} 
          style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#000', padding: '12px', border: '1px solid #222', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', paddingBottom: '6px' }}>
          <span>Influenza Pathogen:</span>
          <span style={{ color: respiratory.color, fontWeight: 'bold', fontFamily: 'monospace' }}>{respiratory.label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', paddingBottom: '6px' }}>
          <span>Enteric Virus Load:</span>
          <span style={{ color: enteric.color, fontWeight: 'bold', fontFamily: 'monospace' }}>{enteric.label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Zoonotic Avian Threat:</span>
          <span style={{ color: zoonotic.color, fontWeight: 'bold', fontFamily: 'monospace' }}>{zoonotic.label}</span>
        </div>
      </div>

      {multiplier > 7 && (
        <div style={{ marginTop: '16px', color: '#ff3b30', fontSize: '11px', fontWeight: 'bold', animation: 'blink 1.5s infinite', textAlign: 'center' }}>
          ⚠️ CDC EPIDEMIOLOGICAL WARNING: OUTBREAK DETECTED
        </div>
      )}
    </div>
  );
}

function FdaTrackerWidget() {
  const [phaseFilter, setPhaseFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [selectedTrial, setSelectedTrial] = useState(null);

  const trials = [
    { id: 'AEG-902', sponsor: 'Aegis BioLabs', phase: 'Phase III', class: 'Biologics', efficacy: '82.4%', safety: 'Passed', details: 'Targeting beta-amyloid plaques in early onset Alzheimer patients.' },
    { id: 'AEG-108', sponsor: 'Aegis BioLabs', phase: 'Phase II', class: 'Small Molecules', efficacy: '67.1%', safety: 'Passed', details: 'Expedited review for targeted therapy of myeloid leukemia cells.' },
    { id: 'AEG-305', sponsor: 'BioResearch Corp', phase: 'Phase I', class: 'Gene Therapy', efficacy: '91.2%', safety: 'In Audit', details: 'CRISPR guided editing of sickle-cell genomic hemoglobin lines.' },
    { id: 'AEG-412', sponsor: 'LabSponsors Inc', phase: 'NDA Review', class: 'Small Molecules', efficacy: '74.9%', safety: 'Approved', details: 'Broad spectrum anti-viral candidate targeting cell protein blocks.' }
  ];

  const filteredTrials = trials.filter(t => 
    (phaseFilter === 'All' || t.phase === phaseFilter) &&
    (classFilter === 'All' || t.class === classFilter)
  );

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>Filter by Phase</label>
          <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }}>
            <option value="All">All Phases</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
            <option value="NDA Review">NDA Review</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '10px', color: '#888', display: 'block', marginBottom: '4px' }}>Filter by Class</label>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px' }}>
            <option value="All">All Classes</option>
            <option value="Biologics">Biologics</option>
            <option value="Small Molecules">Small Molecules</option>
            <option value="Gene Therapy">Gene Therapy</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '8px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
              <th style={{ padding: '6px' }}>ID</th>
              <th style={{ padding: '6px' }}>Phase</th>
              <th style={{ padding: '6px' }}>Class</th>
              <th style={{ padding: '6px' }}>Efficacy</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrials.map(t => (
              <tr 
                key={t.id} 
                onClick={() => setSelectedTrial(t)}
                style={{ borderBottom: '1px solid #111', cursor: 'pointer', backgroundColor: selectedTrial?.id === t.id ? '#111' : 'transparent' }}
              >
                <td style={{ padding: '6px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{t.id}</td>
                <td style={{ padding: '6px' }}>{t.phase}</td>
                <td style={{ padding: '6px' }}>{t.class}</td>
                <td style={{ padding: '6px', color: '#00ff66' }}>{t.efficacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrial && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '4px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '6px' }}>
            <span>{selectedTrial.sponsor}</span>
            <span style={{ color: '#00e5ff' }}>Safety: {selectedTrial.safety}</span>
          </div>
          <p style={{ color: '#aaa', lineHeight: '1.4' }}>{selectedTrial.details}</p>
        </div>
      )}
    </div>
  );
}

function OperationsRoiWidget() {
  const [arrivals, setArrivals] = useState(150);
  const [triageTime, setTriageTime] = useState(120);

  const timeSaved = Math.round(arrivals * (triageTime * 0.35) / 60);
  const costSaved = Math.round(timeSaved * 85).toLocaleString();
  const bedsCapacity = (arrivals * (triageTime * 0.35) / 1440).toFixed(1);

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px' }}>
          <span>Daily ER Arrivals:</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{arrivals} patients</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="500" 
          value={arrivals} 
          onChange={(e) => setArrivals(Number(e.target.value))} 
          style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px' }}>
          <span>Current Avg Wait:</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{triageTime} mins</span>
        </div>
        <input 
          type="range" 
          min="60" 
          max="240" 
          value={triageTime} 
          onChange={(e) => setTriageTime(Number(e.target.value))} 
          style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
        />
      </div>

      <div style={{ background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '6px' }}>
          <span style={{ color: '#888' }}>Staff Time Saved:</span>
          <span style={{ color: '#00ff66', fontWeight: 'bold', fontFamily: 'monospace' }}>~{timeSaved} hrs/day</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #111', paddingBottom: '6px' }}>
          <span style={{ color: '#888' }}>Bed Triage Capacity:</span>
          <span style={{ color: '#00e5ff', fontWeight: 'bold', fontFamily: 'monospace' }}>+{bedsCapacity} beds/day</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888' }}>Clinician ROI Value:</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontFamily: 'monospace' }}>${costSaved}/day</span>
        </div>
      </div>
    </div>
  );
}

function DnaAnalyzerWidget() {
  const [dna, setDna] = useState('ATGCGTACGTTAGC');
  const [guide, setGuide] = useState('TGCGTA');
  const [cleavage, setCleavage] = useState(null);

  const analyzeSequence = () => {
    const cleanDna = dna.trim().toUpperCase();
    if (/[^ATCG]/g.test(cleanDna)) {
      alert("Invalid DNA base sequence! Only A, T, C, G permitted.");
      return;
    }
    
    let matchCount = 0;
    for (let i = 0; i < guide.length; i++) {
      if (cleanDna.includes(guide[i])) matchCount++;
    }
    const matchPct = Math.round((matchCount / guide.length) * 100);
    
    setCleavage({
      target: cleanDna,
      guide: guide,
      matchRate: `${matchCount}/${guide.length}`,
      efficacy: `${matchPct}%`
    });
  };

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Target DNA Base Pairs</label>
        <input 
          type="text" 
          value={dna} 
          onChange={(e) => setDna(e.target.value.toUpperCase())}
          style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }} 
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Guide RNA Sequence</label>
        <select value={guide} onChange={(e) => setGuide(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '6px', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }}>
          <option value="TGCGTA">AEG-Guide-1 (TGCGTA)</option>
          <option value="TACGTT">AEG-Guide-2 (TACGTT)</option>
          <option value="TAGCAT">AEG-Guide-3 (TAGCAT)</option>
        </select>
      </div>

      <button 
        onClick={analyzeSequence}
        style={{ width: '100%', backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
      >
        Analyze CRISPR Cleavage
      </button>

      {cleavage && (
        <div style={{ marginTop: '16px', background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '12px', fontFamily: 'monospace', fontSize: '11px' }}>
          <div style={{ color: '#888', borderBottom: '1px solid #111', paddingBottom: '4px', marginBottom: '8px' }}>Analysis Results:</div>
          <div>Efficacy: <span style={{ color: '#00ff66', fontWeight: 'bold' }}>{cleavage.efficacy}</span></div>
          <div>Matches: <span style={{ color: '#fff' }}>{cleavage.matchRate}</span></div>
          <div style={{ marginTop: '8px', color: '#555', whiteSpace: 'pre-wrap' }}>
            {"Target: " + cleavage.target}<br />
            {"         " + "|".repeat(cleavage.guide.length)}<br />
            {"Guide:  " + cleavage.guide}
          </div>
        </div>
      )}
    </div>
  );
}

function ConsoleSimulatorWidget() {
  const [logs, setLogs] = useState([
    { time: '09:12:05', status: 'INIT', msg: 'Central Aegis Node connected.' }
  ]);
  const [pinging, setPinging] = useState(false);

  const sendPing = () => {
    setPinging(true);
    const nodes = ['BEDSIDE_01', 'BEDSIDE_02', 'LAB_SERVER_A', 'CENTRAL_DASH'];
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    
    setTimeout(() => {
      const duration = (Math.random() * 5).toFixed(1);
      const newLog = {
        time: new Date().toLocaleTimeString(),
        status: 'SUCCESS',
        msg: `Pinged node ${node} - latency: ${duration}ms`
      };
      setLogs(prev => [newLog, ...prev.slice(0, 3)]);
      setPinging(false);
    }, 800);
  };

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {['BEDSIDE_01', 'BEDSIDE_02', 'LAB_SERVER', 'CENTRAL_DASH'].map((node, i) => (
          <div key={i} style={{ border: '1px solid #333', background: '#111', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '8px', color: '#888' }}>Node</div>
            <div style={{ fontWeight: 'bold', fontSize: '9px', margin: '4px 0', color: '#00e5ff' }}>{node}</div>
            <div style={{ width: '6px', height: '6px', backgroundColor: '#00ff66', borderRadius: '50%', margin: '0 auto', animation: 'pulse-led 1s infinite' }}></div>
          </div>
        ))}
      </div>

      <button 
        onClick={sendPing}
        disabled={pinging}
        style={{ width: '100%', backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', opacity: pinging ? 0.7 : 1 }}
      >
        {pinging ? 'Sending Handshake...' : 'Send Telemetry Ping'}
      </button>

      <div style={{ marginTop: '16px', background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '12px', fontFamily: 'monospace', fontSize: '11px', height: '100px', overflowY: 'auto' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: l.status === 'INIT' ? '#888' : '#aaa', margin: '4px 0' }}>
            <span style={{ color: '#ffb000' }}>[{l.time}]</span> <span style={{ color: '#00ff66' }}>[NET]</span> {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function IndicesFeedWidget() {
  const [pathogen, setPathogen] = useState(4.8);
  const [triage, setTriage] = useState(144);

  return (
    <div style={{ fontSize: '13px', color: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#888' }}>CDC PATHOGEN INDEX</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff3b30', margin: '6px 0', fontFamily: 'monospace' }}>{pathogen.toFixed(2)}</div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.1" 
            value={pathogen} 
            onChange={(e) => setPathogen(Number(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ background: '#000', border: '1px solid #222', borderRadius: '4px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#888' }}>US HOSPITAL TRIAGE WAIT</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffb000', margin: '6px 0', fontFamily: 'monospace' }}>{triage}m</div>
          <input 
            type="range" 
            min="30" 
            max="300" 
            value={triage} 
            onChange={(e) => setTriage(Number(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#888' }}>
        Drag sliders to simulate clinical volatility indexes in real-time.
      </div>
    </div>
  );
}

function DefaultGaugeWidget() {
  const [val, setVal] = useState(85);
  return (
    <div style={{ textAlign: 'center', color: '#fff', fontSize: '13px' }}>
      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '12px' }}>Aegis Network Stream Activity</div>
      <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#00ff66', fontFamily: 'monospace', marginBottom: '16px' }}>{val}%</div>
      <input 
        type="range" 
        min="10" 
        max="100" 
        value={val} 
        onChange={(e) => setVal(Number(e.target.value))} 
        style={{ width: '100%', accentColor: '#00ff66' }}
      />
      <div style={{ marginTop: '12px', color: '#555', fontSize: '11px' }}>
        Network throughput telemetry running within normal ranges.
      </div>
    </div>
  );
}

function SubpageWidget({ type }) {
  if (type === 'vitals-streamer') {
    return <VitalsStreamerWidget />;
  }
  if (type === 'risk-calculator') {
    return <RiskCalculatorWidget />;
  }
  if (type === 'outbreak-monitor') {
    return <OutbreakMonitorWidget />;
  }
  if (type === 'fda-tracker') {
    return <FdaTrackerWidget />;
  }
  if (type === 'operations-roi') {
    return <OperationsRoiWidget />;
  }
  if (type === 'dna-analyzer') {
    return <DnaAnalyzerWidget />;
  }
  if (type === 'console-simulator') {
    return <ConsoleSimulatorWidget />;
  }
  if (type === 'indices-feed') {
    return <IndicesFeedWidget />;
  }
  
  return <DefaultGaugeWidget />;
}

function SubpageView({ pageId, onLaunchTerminal, onBack }) {
  const config = SUBPAGES_CONFIG[pageId] || {
    title: "Services Detail",
    subtitle: "Aegis Health Professional Services clinical databases and pipelines.",
    heroGradient: "radial-gradient(circle at top, #111 0%, #000 80%)",
    stats: [{ value: '99.9%', label: 'Active Service' }],
    capabilities: [{ title: "Interactive Telemetry", desc: "Access high-performance dashboards and secure records streams." }],
    widgetType: "default"
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '80vh' }}>
      {/* Subpage Hero */}
      <section style={{
        background: config.heroGradient,
        padding: '80px 24px',
        borderBottom: '1px solid #111',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', display: 'block', marginBottom: '16px' }}>
              Aegis Professional Services
            </span>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#ffffff', lineHeight: '1.2', marginBottom: '24px' }}>
              {config.title}
            </h1>
            <p style={{ fontSize: '18px', color: '#cccccc', lineHeight: '1.6', marginBottom: '36px', maxWidth: '650px' }}>
              {config.subtitle}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '14px 28px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                Launch Aegis Terminal Demo
              </button>
              <button className="btn-secondary" onClick={onBack} style={{ border: '1px solid #444', color: '#fff', padding: '13px 27px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}>
                Back to Services Directory
              </button>
            </div>
          </div>
          {/* Decorative Graph overlay */}
          <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
            <svg viewBox="0 0 100 100" style={{ width: '160px', height: '160px' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="#222" strokeWidth="1" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeDasharray="10 30" style={{ transformOrigin: '50px 50px' }} />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: '#090a0f', borderBottom: '1px solid #111', padding: '30px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: `repeat(${config.stats.length}, 1fr)`, gap: '40px', textAlign: 'center' }}>
          {config.stats.map((s, idx) => (
            <div key={idx} style={{ borderLeft: idx > 0 ? '1px solid #222' : 'none' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', fontFamily: 'monospace' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '6px', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container" style={{ padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '60px' }}>
        {/* Left Side: Capabilities details */}
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '40px' }}>
            Enterprise Capabilities
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {config.capabilities.map((c, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', fontSize: '18px', flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>{c.title}</h3>
                  <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
            Interactive Demo Sandbox
          </h2>
          <div className="glass" style={{ padding: '30px', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.06)' }}>
            <SubpageWidget type={config.widgetType} />
          </div>
        </div>
      </section>

      {/* Final Action CTA Block */}
      <section style={{ backgroundColor: '#000', borderTop: '1px solid #111', padding: '80px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass" style={{ width: '900px', padding: '50px', textAlign: 'center', background: 'linear-gradient(180deg, #11141c 0%, #080a0f 100%)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
              Full Integration inside Aegis Terminal
            </h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
              This capability is fully synchronized inside the Aegis Terminal workspace. Enter the biometrically secured command console to test clinical news wires, outbreak tracking maps, and live SSE ECG monitors.
            </p>
            <button className="btn-primary" onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', padding: '14px 36px', fontSize: '14px', fontWeight: 'bold' }}>
              Launch Full Terminal Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
