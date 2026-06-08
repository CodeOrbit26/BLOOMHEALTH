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
  
  // Tab Navigation: 'home' | 'insights' | subpages
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path === '/insights' || path === '/insights/') return 'insights';
    if (path === '/products/bloomberg-terminal' || path === '/products/bloomberg-terminal/' || path === '/products/aegis-terminal' || path === '/products/aegis-terminal/') {
      return 'aegis-terminal';
    }
    if (path.startsWith('/products/')) {
      const parts = path.split('/');
      const prod = parts[2];
      if (PRODUCT_PAGES.includes(prod)) return prod;
    }
    if (path.startsWith('/solutions/')) {
      const parts = path.split('/');
      const sol = parts[2];
      if (SOLUTION_PAGES.includes(sol)) return sol;
    }
    return 'home';
  });

  const getPathFromTab = (tab) => {
    if (tab === 'home') return '/';
    if (tab === 'insights') return '/insights/';
    if (tab === 'aegis-terminal' || tab === 'terminal-overview') return '/products/bloomberg-terminal/';
    if (PRODUCT_PAGES.includes(tab)) return `/products/${tab}/`;
    if (SOLUTION_PAGES.includes(tab)) return `/solutions/${tab}/`;
    return '/';
  };

  const getTabFromPath = (path) => {
    if (path === '/' || path === '') return 'home';
    if (path === '/insights' || path === '/insights/') return 'insights';
    if (path === '/products/bloomberg-terminal' || path === '/products/bloomberg-terminal/' || path === '/products/aegis-terminal' || path === '/products/aegis-terminal/') {
      return 'aegis-terminal';
    }
    if (path.startsWith('/products/')) {
      const parts = path.split('/');
      const prod = parts[2];
      if (PRODUCT_PAGES.includes(prod)) return prod;
    }
    if (path.startsWith('/solutions/')) {
      const parts = path.split('/');
      const sol = parts[2];
      if (SOLUTION_PAGES.includes(sol)) return sol;
    }
    return 'home';
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state && state.tab) {
        setCurrentTab(state.tab);
      } else {
        setCurrentTab(getTabFromPath(window.location.pathname));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const targetPath = getPathFromTab(currentTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: currentTab }, '', targetPath);
    }

    // Dynamic browser tab title update
    if (currentTab === 'home') {
      document.title = "Aegis Professional Services";
    } else if (currentTab === 'insights') {
      document.title = "Aegis Insights | Bloomberg Professional Services";
    } else if (currentTab === 'aegis-terminal' || currentTab === 'terminal-overview') {
      document.title = "Bloomberg Terminal | Bloomberg Professional Services";
    } else {
      const config = SUBPAGES_CONFIG[currentTab];
      if (config && config.title) {
        document.title = `${config.title} | Bloomberg Professional Services`;
      } else {
        document.title = "Bloomberg Professional Services";
      }
    }
  }, [currentTab]);

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

      {/* FOOTER: PLAIN DARK THEME OR WHITE BLOOMBERG FOOTER */}
      {currentTab !== 'home' && currentTab !== 'insights' ? (
        <BloombergWhiteFooter onLaunchTerminal={onLaunchTerminal} />
      ) : (
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
      )}
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

function DualMonitorSvg() {
  return (
    <svg viewBox="0 0 800 400" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '650px', margin: '0 auto' }}>
      {/* Stand */}
      <rect x="385" y="280" width="30" height="90" fill="#222" rx="5" />
      <ellipse cx="400" cy="370" rx="90" ry="15" fill="#111" />
      <path d="M 320 280 L 480 280 L 400 320 Z" fill="#1b1b1b" />
      
      {/* Left Monitor Frame */}
      <rect x="60" y="40" width="330" height="230" fill="#0c0d12" rx="10" stroke="#333" strokeWidth="3" />
      {/* Screen Left */}
      <rect x="70" y="50" width="310" height="210" fill="#040507" rx="6" />
      {/* Grid lines for chart */}
      <path d="M 70 85 H 380 M 70 120 H 380 M 70 155 H 380 M 70 190 H 380" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 120 50 V 260 M 180 50 V 260 M 240 50 V 260 M 300 50 V 260" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      
      {/* Financial Line Charts */}
      {/* Yellow Trend Line */}
      <path d="M 70 180 L 110 160 L 140 175 L 180 140 L 220 150 L 260 110 L 300 125 L 340 95 L 380 75" fill="none" stroke="#ffb000" strokeWidth="2" />
      {/* Green Trend Line */}
      <path d="M 70 210 L 110 185 L 150 195 L 190 150 L 230 165 L 270 120 L 310 110 L 350 85 L 380 60" fill="none" stroke="#00ff66" strokeWidth="1.5" />
      {/* Red Drop Line */}
      <path d="M 70 120 L 120 135 L 170 110 L 220 145 L 270 160 L 320 190 L 380 215" fill="none" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Header labels */}
      <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">GP &lt;GO&gt; - MULTI-ASSET RATIO</text>
      <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">SPX: 5,123.45</text>
      <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Range: 1 Year  |  Currency: USD</text>

      {/* Right Monitor Frame */}
      <rect x="410" y="40" width="330" height="230" fill="#0c0d12" rx="10" stroke="#333" strokeWidth="3" />
      {/* Screen Right */}
      <rect x="420" y="50" width="310" height="210" fill="#040507" rx="6" />
      
      {/* Launchpad Layout - Window 1: Candlesticks (Left Half) */}
      <rect x="425" y="55" width="145" height="110" fill="#080a0f" stroke="#222" strokeWidth="1" />
      <text x="430" y="65" fill="#00e5ff" fontSize="7" fontFamily="monospace" fontWeight="bold">AAPL Equity - Candlesticks</text>
      {/* Grid lines inside candlestick window */}
      <line x1="425" y1="90" x2="570" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <line x1="425" y1="120" x2="570" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      {/* Candlesticks: green / red bars with wicks */}
      {/* Bar 1: Green */}
      <line x1="440" y1="110" x2="440" y2="140" stroke="#00ff66" strokeWidth="1" />
      <rect x="437" y="115" width="6" height="18" fill="#00ff66" />
      {/* Bar 2: Red */}
      <line x1="460" y1="100" x2="460" y2="135" stroke="#ff3b30" strokeWidth="1" />
      <rect x="457" y="105" width="6" height="20" fill="#ff3b30" />
      {/* Bar 3: Green */}
      <line x1="480" y1="85" x2="480" y2="115" stroke="#00ff66" strokeWidth="1" />
      <rect x="477" y="90" width="6" height="20" fill="#00ff66" />
      {/* Bar 4: Green */}
      <line x1="500" y1="75" x2="500" y2="105" stroke="#00ff66" strokeWidth="1" />
      <rect x="497" y="80" width="6" height="18" fill="#00ff66" />
      {/* Bar 5: Red */}
      <line x1="520" y1="90" x2="520" y2="120" stroke="#ff3b30" strokeWidth="1" />
      <rect x="517" y="95" width="6" height="15" fill="#ff3b30" />
      {/* Bar 6: Green */}
      <line x1="540" y1="70" x2="540" y2="100" stroke="#00ff66" strokeWidth="1" />
      <rect x="537" y="73" width="6" height="20" fill="#00ff66" />

      {/* Launchpad Layout - Window 2: Tickers List (Right Half Top) */}
      <rect x="575" y="55" width="150" height="110" fill="#080a0f" stroke="#222" strokeWidth="1" />
      <text x="580" y="65" fill="#ffb000" fontSize="7" fontFamily="monospace" fontWeight="bold">WATCHLIST - INDICES</text>
      
      <text x="580" y="80" fill="#fff" fontSize="6" fontFamily="monospace">COMP Index</text>
      <text x="650" y="80" fill="#00ff66" fontSize="6" fontFamily="monospace">16,420.10</text>
      <text x="700" y="80" fill="#00ff66" fontSize="6" fontFamily="monospace">+1.4%</text>

      <text x="580" y="95" fill="#fff" fontSize="6" fontFamily="monospace">INDU Index</text>
      <text x="650" y="95" fill="#ff3b30" fontSize="6" fontFamily="monospace">38,820.50</text>
      <text x="700" y="95" fill="#ff3b30" fontSize="6" fontFamily="monospace">-0.2%</text>

      <text x="580" y="110" fill="#fff" fontSize="6" fontFamily="monospace">EURUSD Curncy</text>
      <text x="650" y="110" fill="#00ff66" fontSize="6" fontFamily="monospace">1.0842</text>
      <text x="700" y="110" fill="#00ff66" fontSize="6" fontFamily="monospace">+0.1%</text>

      <text x="580" y="125" fill="#fff" fontSize="6" fontFamily="monospace">GC1 Comdty</text>
      <text x="650" y="125" fill="#00ff66" fontSize="6" fontFamily="monospace">2,345.80</text>
      <text x="700" y="125" fill="#00ff66" fontSize="6" fontFamily="monospace">+0.8%</text>

      <text x="580" y="140" fill="#fff" fontSize="6" fontFamily="monospace">CL1 Comdty</text>
      <text x="650" y="140" fill="#ff3b30" fontSize="6" fontFamily="monospace">78.20</text>
      <text x="700" y="140" fill="#ff3b30" fontSize="6" fontFamily="monospace">-0.9%</text>

      {/* Launchpad Layout - Window 3: News Feed (Bottom Full Width) */}
      <rect x="425" y="170" width="300" height="80" fill="#080a0f" stroke="#222" strokeWidth="1" />
      <text x="430" y="180" fill="#ffb000" fontSize="7" fontFamily="monospace" fontWeight="bold">NSE &lt;GO&gt; - REAL-TIME BLOOMBERG WIRE</text>
      
      <text x="430" y="195" fill="#00ff66" fontSize="6" fontFamily="monospace">10:44</text>
      <text x="460" y="195" fill="#fff" fontSize="6" fontFamily="monospace">FED KEEPS TARGET RATE RANGE UNCHANGED AT 5.25%-5.50%</text>

      <text x="430" y="210" fill="#00ff66" fontSize="6" fontFamily="monospace">10:42</text>
      <text x="460" y="210" fill="#fff" fontSize="6" fontFamily="monospace">US STOCK INDEX FUTURES RALLY POST-FED POLICY RELEASE</text>

      <text x="430" y="225" fill="#00ff66" fontSize="6" fontFamily="monospace">10:40</text>
      <text x="460" y="225" fill="#aaa" fontSize="6" fontFamily="monospace">ECB OFFICIALS MULL ADDITIONAL 25BPS RATE CUT IN JUNE</text>

      <text x="430" y="240" fill="#00ff66" fontSize="6" fontFamily="monospace">10:39</text>
      <text x="460" y="240" fill="#aaa" fontSize="6" fontFamily="monospace">CRUDE OIL FUTURES STABILIZE ON MIDDLE EAST SUPPLY TALKS</text>
    </svg>
  );
}

function ClinicalDualMonitorSvg({ widgetType, title }) {
  const renderLeftScreen = () => {
    switch (widgetType) {
      case 'vitals-streamer':
      case 'ai-medical-assist':
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">DASH &lt;GO&gt; - VITAL TELEMETRY STREAM</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">PATIENT: 4-B</text>
            <path d="M 70 180 L 100 180 L 105 140 L 110 220 L 115 180 L 160 180 L 165 140 L 170 220 L 175 180 L 220 180 L 225 140 L 230 220 L 235 180 L 280 180 L 285 140 L 290 220 L 295 180 L 340 180 L 345 140 L 350 220 L 355 180 L 380 180" fill="none" stroke="#00ff66" strokeWidth="2" />
            <path d="M 70 120 L 120 115 L 170 125 L 220 110 L 270 118 L 320 108 L 380 115" fill="none" stroke="#ffb000" strokeWidth="1.5" />
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Telemetry Channel: Bedside ECG & SpO2</text>
          </>
        );
      case 'outbreak-monitor':
      case 'alert-surveillance':
        return (
          <>
            <text x="80" y="68" fill="#ff3b30" fontSize="8" fontFamily="monospace" fontWeight="bold">MAP &lt;GO&gt; - REGIONAL OUTBREAK DETECTOR</text>
            <text x="250" y="68" fill="#ff3b30" fontSize="8" fontFamily="monospace" fontWeight="bold">HAZARD: LEVEL 3</text>
            <circle cx="150" cy="140" r="30" fill="rgba(255,59,48,0.15)" stroke="#ff3b30" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="150" cy="140" r="4" fill="#ff3b30" />
            <circle cx="280" cy="170" r="40" fill="rgba(255,59,48,0.1)" stroke="#ff3b30" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="280" cy="170" r="4" fill="#ff3b30" />
            <circle cx="200" cy="90" r="20" fill="rgba(0,229,255,0.15)" stroke="#00e5ff" strokeWidth="1" />
            <circle cx="200" cy="90" r="4" fill="#00e5ff" />
            <path d="M 70 140 H 380 M 225 50 V 260" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Region Grid: US-Northeast  |  Source: CDC Alerts</text>
          </>
        );
      case 'risk-calculator':
      case 'diagnostic-analytics':
        return (
          <>
            <text x="80" y="68" fill="#00e5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">RISK &lt;GO&gt; - ICU PROGNOSTIC CALCULATOR</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">ACCURACY: 94%</text>
            <rect x="90" y="100" width="80" height="15" fill="rgba(255,59,48,0.3)" stroke="#ff3b30" strokeWidth="1" />
            <text x="180" y="111" fill="#fff" fontSize="7" fontFamily="monospace">SEPSIS SCORE: 82% (HIGH)</text>
            <rect x="90" y="130" width="160" height="15" fill="rgba(0,255,102,0.3)" stroke="#00ff66" strokeWidth="1" />
            <text x="260" y="141" fill="#fff" fontSize="7" fontFamily="monospace">RESPIRATORY: 45%</text>
            <rect x="90" y="160" width="110" height="15" fill="rgba(255,176,0,0.3)" stroke="#ffb000" strokeWidth="1" />
            <text x="210" y="171" fill="#fff" fontSize="7" fontFamily="monospace">CARDIAC RISK: 60%</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Model: Random Forest Ensemble v4.1</text>
          </>
        );
      case 'fda-tracker':
      case 'regulatory-compliance':
      case 'clinical-trials':
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">FDA &lt;GO&gt; - TRIAL & DRUG TRACKER</text>
            <text x="250" y="68" fill="#00e5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">ACTIVE TRIALS</text>
            <rect x="90" y="110" width="50" height="25" fill="#00ff66" rx="3" />
            <text x="100" y="125" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">PHASE I</text>
            <line x1="140" y1="122" x2="170" y2="122" stroke="#fff" strokeWidth="2" />
            <rect x="170" y="110" width="50" height="25" fill="#00ff66" rx="3" />
            <text x="177" y="125" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">PHASE II</text>
            <line x1="220" y1="122" x2="250" y2="122" stroke="#fff" strokeWidth="2" />
            <rect x="250" y="110" width="55" height="25" fill="#ffb000" rx="3" />
            <text x="256" y="125" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">PHASE III</text>
            <line x1="305" y1="122" x2="330" y2="122" stroke="#555" strokeWidth="1" strokeDasharray="2 2" />
            <rect x="330" y="110" width="40" height="25" fill="#222" stroke="#555" strokeWidth="1" rx="3" />
            <text x="338" y="125" fill="#555" fontSize="7" fontFamily="monospace" fontWeight="bold">FILING</text>
            <text x="90" y="170" fill="#fff" fontSize="8" fontFamily="monospace">Molecule ID: AEGIS-7218 (Oncology Inhibitor)</text>
            <text x="90" y="185" fill="#00ff66" fontSize="7" fontFamily="monospace">● Trial Phase III Cohort Recruitment Complete (n=1,200)</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Filing Target: Q3 2026  |  Expedited Review Status</text>
          </>
        );
      case 'operations-roi':
      case 'hospital-systems':
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">SYS &lt;GO&gt; - HOSPITAL OPERATIONS DASHBOARD</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">ACTIVE SITES</text>
            <text x="90" y="110" fill="#fff" fontSize="7" fontFamily="monospace">ER BED OCCUPANCY (MAIN BLOCK)</text>
            <rect x="90" y="115" width="200" height="8" fill="#222" rx="2" />
            <rect x="90" y="115" width="176" height="8" fill="#ff3b30" rx="2" />
            <text x="300" y="122" fill="#ff3b30" fontSize="7" fontFamily="monospace" fontWeight="bold">88% (CRITICAL)</text>
            <text x="90" y="140" fill="#fff" fontSize="7" fontFamily="monospace">ICU VENTILATOR RESERVES</text>
            <rect x="90" y="145" width="200" height="8" fill="#222" rx="2" />
            <rect x="90" y="145" width="90" height="8" fill="#00ff66" rx="2" />
            <text x="300" y="152" fill="#00ff66" fontSize="7" fontFamily="monospace" fontWeight="bold">45% (STABLE)</text>
            <text x="90" y="170" fill="#fff" fontSize="7" fontFamily="monospace">AVG PATIENT WAITING ADMISSION TIME</text>
            <text x="90" y="188" fill="#ffb000" fontSize="14" fontFamily="monospace" fontWeight="bold">18.5 Min</text>
            <text x="170" y="188" fill="#00ff66" fontSize="7" fontFamily="monospace">▼ -22% vs Prev Week</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Network Status: Global Synchronized Online</text>
          </>
        );
      case 'dna-analyzer':
      case 'bioethics-care':
        return (
          <>
            <text x="80" y="68" fill="#00e5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">GEN &lt;GO&gt; - GENOMICS SEQUENCER PIPELINE</text>
            <text x="250" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">MAPPED: 10M+</text>
            <path d="M 90 140 Q 110 100 130 140 T 170 140 T 210 140 T 250 140 T 290 140 T 330 140 T 370 140" fill="none" stroke="#00e5ff" strokeWidth="2" />
            <path d="M 90 140 Q 110 180 130 140 T 170 140 T 210 140 T 250 140 T 290 140 T 330 140 T 370 140" fill="none" stroke="#ffb000" strokeWidth="2" strokeDasharray="2 2" />
            <line x1="110" y1="120" x2="110" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="150" y1="120" x2="150" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="190" y1="120" x2="190" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="230" y1="120" x2="230" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="270" y1="120" x2="270" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="310" y1="120" x2="310" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="350" y1="120" x2="350" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="90" y="200" fill="#fff" fontSize="7" fontFamily="monospace">SEQUENCE IDENTIFIED: Homo_sapiens_Chr7_Locus22</text>
            <text x="90" y="212" fill="#00ff66" fontSize="7" fontFamily="monospace">Match Confidence: 99.87% (CRISPR Cleavage Approved)</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Database: GenBank Native Remote Mapping</text>
          </>
        );
      case 'console-simulator':
      case 'remote-console':
      case 'clinical-collaboration':
      case 'operator-training':
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">TERM &lt;GO&gt; - MNEMONIC CLINICAL SHELL</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">ONLINE STATUS</text>
            <text x="90" y="105" fill="#aaa" fontSize="7" fontFamily="monospace">AEGIS SYSTEMS CORE STACK INITIALIZED...</text>
            <text x="90" y="120" fill="#fff" fontSize="7" fontFamily="monospace">AEGIS&gt; HELP DASH</text>
            <text x="90" y="132" fill="#00ff66" fontSize="7" fontFamily="monospace">LOADING CLINICAL TELEMETRY MODULE ON SCREEN B...</text>
            <text x="90" y="150" fill="#fff" fontSize="7" fontFamily="monospace">AEGIS&gt; CALL SPECIALIST --CARDIOLOGY</text>
            <text x="90" y="162" fill="#00ff66" fontSize="7" fontFamily="monospace">ROUTING CONCURRENT CONSULT CHAT... (SPECIALIST ACTIVE)</text>
            <text x="90" y="180" fill="#fff" fontSize="7" fontFamily="monospace">AEGIS&gt; PATIENT --ID 10452 --VITAL</text>
            <text x="90" y="192" fill="#00e5ff" fontSize="7" fontFamily="monospace">Vitals display: HeartRate 78, Temp 98.6F, Respiration 14</text>
            <text x="90" y="215" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">AEGIS&gt; _</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Mnemonic shortcuts enabled. Press HELP key for listings.</text>
          </>
        );
      case 'indices-feed':
      case 'clinical-indices':
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">IDX &lt;GO&gt; - HEALTHCARE INDICES FEED</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">UPDATE SPEED: 0.1s</text>
            <path d="M 70 190 L 110 160 L 150 170 L 190 130 L 230 140 L 270 100 L 310 115 L 350 80 L 380 65" fill="none" stroke="#00e5ff" strokeWidth="2" />
            <path d="M 70 130 L 120 145 L 170 120 L 220 155 L 270 170 L 320 200 L 380 225" fill="none" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="80" y="235" fill="#00e5ff" fontSize="7" fontFamily="monospace">CDC SEVERITY INDEX: 142.10 (+2.4%)</text>
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Indices aggregator updated real-time globally.</text>
          </>
        );
      default:
        return (
          <>
            <text x="80" y="68" fill="#ffb000" fontSize="8" fontFamily="monospace" fontWeight="bold">GP &lt;GO&gt; - AEGIS SYSTEMS INDEX</text>
            <text x="250" y="68" fill="#00ff66" fontSize="8" fontFamily="monospace" fontWeight="bold">Uptime: 99.9%</text>
            <path d="M 70 180 L 110 160 L 140 175 L 180 140 L 220 150 L 260 110 L 300 125 L 340 95 L 380 75" fill="none" stroke="#005aff" strokeWidth="2" />
            <path d="M 70 120 L 120 135 L 170 110 L 220 145 L 270 160 L 320 190 L 380 215" fill="none" stroke="#ff3b30" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="80" y="245" fill="#aaa" fontSize="7" fontFamily="monospace">Active Aegis Pipeline Telemetry Database</text>
          </>
        );
    }
  };

  const renderRightScreen = () => {
    let newsFeed = [
      "FDA PRIORITIZES CANCER BREAKTHROUGH INVESTIGATIONAL DRUGS",
      "NEW ENGLAND JOURNAL RELEASES COHORT OUTCOME TRIAL ANALYSIS",
      "CDC WARNING OVER INCREASED RESPIRATORY CASES REGIONALLY"
    ];
    let indicatorName1 = "ICU OCCU";
    let indicatorVal1 = "84.2%";
    let indicatorTrend1 = "up";
    let indicatorName2 = "ER WAIT";
    let indicatorVal2 = "18.5m";
    let indicatorTrend2 = "down";

    if (widgetType === 'vitals-streamer' || widgetType === 'ai-medical-assist') {
      newsFeed = [
        "BEDSIDE TELEMETRY LATENCY DROPS BELOW 2MS IN BOSTON TESTS",
        "NEW FHIR NATIVE CLOUD PIPELINE LAUNCHED BY HL7 WORKGROUP",
        "PHYSICIAN CHAT ASSIST ENCOUNTERS 98.7% ACCURATE SUMMARIES"
      ];
      indicatorName1 = "VITAL FEED";
      indicatorVal1 = "1.2B/d";
      indicatorTrend1 = "up";
      indicatorName2 = "API LATENCY";
      indicatorVal2 = "10ms";
      indicatorTrend2 = "down";
    } else if (widgetType === 'outbreak-monitor' || widgetType === 'alert-surveillance') {
      newsFeed = [
        "CDC MUNICIPAL WATER REPORT FLAGS WATERBORNE EPIDEMIC SIGNS",
        "ZOONOTIC AVIAN FLU SPREAD HIGHLIGHTED BY VET INSPECTORS",
        "ER ADMISSION LOAD SHIFTS SPARK BRONCHITIS WARNING IN NY"
      ];
      indicatorName1 = "FLUTI LEVEL";
      indicatorVal1 = "Tier 3";
      indicatorTrend1 = "up";
      indicatorName2 = "DETECTION";
      indicatorVal2 = "88%";
      indicatorTrend2 = "up";
    } else if (widgetType === 'risk-calculator' || widgetType === 'diagnostic-analytics') {
      newsFeed = [
        "NEURAL RISK DETECTOR ACCURACY EXCEEDS CLINICAL EXPECTATION",
        "SEPSIS EARLY PREDICTORS REDUCE ICU PATIENT MORTALITY BY 18%",
        "DICOM LAB IMAGE PIPELINES TRANSFERRED IN SUB-SECOND SPEEDS"
      ];
      indicatorName1 = "SEPSIS RISK";
      indicatorVal1 = "82%";
      indicatorTrend1 = "up";
      indicatorName2 = "ERR LEAD TIME";
      indicatorVal2 = "45m";
      indicatorTrend2 = "up";
    } else if (widgetType === 'fda-tracker' || widgetType === 'regulatory-compliance' || widgetType === 'clinical-trials') {
      newsFeed = [
        "BREAKTHROUGH ONCOLOGY MOLECULE MOVES TO EXPEDITED FILING",
        "FDA ACCEPTANCE ON GCP AUDIT TRACKS STABILIZES CLINICAL TRIALS",
        "FAST-TRACK FDA PIPELINES CUT COMPLIANCE DURATION BY 42%"
      ];
      indicatorName1 = "FDA APPR";
      indicatorVal1 = "100%";
      indicatorTrend1 = "flat";
      indicatorName2 = "TRIAL REG";
      indicatorVal2 = "15k+";
      indicatorTrend2 = "up";
    } else if (widgetType === 'operations-roi' || widgetType === 'hospital-systems') {
      newsFeed = [
        "HOSPITAL NETWORK CONSOLIDATION CUTS WAITING TIMES BY 35%",
        "ER TRIAGE RE-ROUTING SAVES $2.4M SYSTEM-WIDE GLOBALLY",
        "HL7 INTEROPERABILITY ELIMINATES LEGACY EHR INTEGRATION LAGS"
      ];
      indicatorName1 = "ER OCCUP";
      indicatorVal1 = "88%";
      indicatorTrend1 = "up";
      indicatorName2 = "SAVINGS";
      indicatorVal2 = "$2.4M";
      indicatorTrend2 = "up";
    } else if (widgetType === 'dna-analyzer' || widgetType === 'bioethics-care') {
      newsFeed = [
        "CRISPR CLEAVAGE GENOMICS ANALYSIS ACCELERATES SEQUENCING",
        "IRB STANDARDS INTEGRATION CONFIRMS CLINICAL CONSENT INTEGRITY",
        "DEMOGRAPHIC RESOURCE FLOW AUDITS FLAG RURAL ICU SHORTAGES"
      ];
      indicatorName1 = "DNA COHORT";
      indicatorVal1 = "10M+";
      indicatorTrend1 = "up";
      indicatorName2 = "CONSENT";
      indicatorVal2 = "100%";
      indicatorTrend2 = "flat";
    }

    return (
      <>
        <rect x="425" y="55" width="145" height="110" fill="#080a0f" stroke="#222" strokeWidth="1" />
        <text x="430" y="65" fill="#ffb000" fontSize="7" fontFamily="monospace" fontWeight="bold">WATCHLIST - INDICATORS</text>
        
        <text x="430" y="82" fill="#fff" fontSize="6" fontFamily="monospace">{indicatorName1}</text>
        <text x="495" y="82" fill={indicatorTrend1 === 'up' ? '#00ff66' : indicatorTrend1 === 'down' ? '#ff3b30' : '#aaa'} fontSize="6" fontFamily="monospace">{indicatorVal1}</text>
        <text x="540" y="82" fill={indicatorTrend1 === 'up' ? '#00ff66' : indicatorTrend1 === 'down' ? '#ff3b30' : '#aaa'} fontSize="6" fontFamily="monospace">{indicatorTrend1 === 'up' ? '▲' : indicatorTrend1 === 'down' ? '▼' : '●'}</text>

        <text x="430" y="97" fill="#fff" fontSize="6" fontFamily="monospace">{indicatorName2}</text>
        <text x="495" y="97" fill={indicatorTrend2 === 'up' ? '#00ff66' : indicatorTrend2 === 'down' ? '#ff3b30' : '#aaa'} fontSize="6" fontFamily="monospace">{indicatorVal2}</text>
        <text x="540" y="97" fill={indicatorTrend2 === 'up' ? '#00ff66' : indicatorTrend2 === 'down' ? '#ff3b30' : '#aaa'} fontSize="6" fontFamily="monospace">{indicatorTrend2 === 'up' ? '▲' : indicatorTrend2 === 'down' ? '▼' : '●'}</text>

        <text x="430" y="112" fill="#fff" fontSize="6" fontFamily="monospace">NET SECURE</text>
        <text x="495" y="112" fill="#00ff66" fontSize="6" fontFamily="monospace">AES-256</text>
        <text x="540" y="112" fill="#00ff66" fontSize="6" fontFamily="monospace">●</text>

        <text x="430" y="127" fill="#fff" fontSize="6" fontFamily="monospace">CLIN RESIL</text>
        <text x="495" y="127" fill="#00e5ff" fontSize="6" fontFamily="monospace">99.99%</text>
        <text x="540" y="127" fill="#00e5ff" fontSize="6" fontFamily="monospace">▲</text>

        <text x="430" y="142" fill="#fff" fontSize="6" fontFamily="monospace">HOST UPTIME</text>
        <text x="495" y="142" fill="#00ff66" fontSize="6" fontFamily="monospace">ACTIVE</text>
        <text x="540" y="142" fill="#00ff66" fontSize="6" fontFamily="monospace">▲</text>

        <rect x="575" y="55" width="150" height="110" fill="#080a0f" stroke="#222" strokeWidth="1" />
        <text x="580" y="65" fill="#ffb000" fontSize="7" fontFamily="monospace" fontWeight="bold">NEWS - CLINICAL WIRE</text>
        
        <text x="580" y="80" fill="#00ff66" fontSize="5.5" fontFamily="monospace">10:44</text>
        <text x="605" y="80" fill="#fff" fontSize="5.5" fontFamily="monospace">{newsFeed[0]}</text>

        <text x="580" y="105" fill="#00ff66" fontSize="5.5" fontFamily="monospace">10:32</text>
        <text x="605" y="105" fill="#fff" fontSize="5.5" fontFamily="monospace">{newsFeed[1]}</text>

        <text x="580" y="130" fill="#00ff66" fontSize="5.5" fontFamily="monospace">10:15</text>
        <text x="605" y="130" fill="#aaa" fontSize="5.5" fontFamily="monospace">{newsFeed[2]}</text>

        <rect x="425" y="170" width="300" height="80" fill="#080a0f" stroke="#222" strokeWidth="1" />
        <text x="430" y="180" fill="#ffb000" fontSize="7" fontFamily="monospace" fontWeight="bold">WIRE &lt;GO&gt; - REAL-TIME AEGIS PRIORITY FEEDS</text>
        
        <text x="430" y="195" fill="#00ff66" fontSize="6" fontFamily="monospace">10:48</text>
        <text x="460" y="195" fill="#fff" fontSize="6" fontFamily="monospace" fontWeight="bold">SYS UPDATE: {title.toUpperCase()} PROTOCOL ONLINE</text>
        <text x="430" y="212" fill="#00ff66" fontSize="6" fontFamily="monospace">10:46</text>
        <text x="460" y="212" fill="#fff" fontSize="6" fontFamily="monospace">CLINICAL STACK INTEGRATING SECURE TLS 1.3 TELEMETRY CHANNEL</text>
        <text x="430" y="229" fill="#00ff66" fontSize="6" fontFamily="monospace">10:43</text>
        <text x="460" y="229" fill="#aaa" fontSize="6" fontFamily="monospace">HOSPITAL ADMINISTRATORS VALIDATE EFFICIENCY GAINS ACCROSS WARDS</text>
      </>
    );
  };

  return (
    <svg viewBox="0 0 800 400" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '650px', margin: '0 auto' }}>
      <rect x="385" y="280" width="30" height="90" fill="#222" rx="5" />
      <ellipse cx="400" cy="370" rx="90" ry="15" fill="#111" />
      <path d="M 320 280 L 480 280 L 400 320 Z" fill="#1b1b1b" />
      
      <rect x="60" y="40" width="330" height="230" fill="#0c0d12" rx="10" stroke="#333" strokeWidth="3" />
      <rect x="70" y="50" width="310" height="210" fill="#040507" rx="6" />
      <path d="M 70 85 H 380 M 70 120 H 380 M 70 155 H 380 M 70 190 H 380" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 120 50 V 260 M 180 50 V 260 M 240 50 V 260 M 300 50 V 260" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      
      {renderLeftScreen()}
      
      <rect x="410" y="40" width="330" height="230" fill="#0c0d12" rx="10" stroke="#333" strokeWidth="3" />
      <rect x="420" y="50" width="310" height="210" fill="#040507" rx="6" />
      
      {renderRightScreen()}
    </svg>
  );
}

function MiniScreenMockup({ feature }) {
  return (
    <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '12px', height: '100px', width: '130px', fontFamily: 'monospace', fontSize: '6px', color: '#00ff66', overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid #222', paddingBottom: '3px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', color: '#ffb000' }}>
        <span>BPS::{feature.toUpperCase()}</span>
        <span>OK</span>
      </div>
      {(feature === 'research' || feature === 'Clinical Research') && (
        <div>
          <div style={{ color: '#aaa', fontSize: '5px' }}>ANALYST RECOMMENDATIONS:</div>
          <div style={{ color: '#fff', marginTop: '2px' }}>• AAPL: BUY [Target $210]</div>
          <div style={{ color: '#ff3b30' }}>• TSLA: SELL [Target $180]</div>
          <div style={{ color: '#00e5ff' }}>• MSFT: HOLD [Target $460]</div>
        </div>
      )}
      {(feature === 'vitals' || feature === 'news' || feature === 'Real-Time Vitals') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ color: '#aaa', fontSize: '5px' }}>MARKET HEADLINES:</div>
          <div style={{ color: '#fff' }}>• FED KEEPS RATES STABLE</div>
          <div style={{ color: '#00e5ff' }}>• TOKYO SHARES ADVANCE</div>
          <div style={{ color: '#ff3b30' }}>• BRENT SLIPS TO $78.20</div>
        </div>
      )}
      {(feature === 'access' || feature === 'Remote Access') && (
        <div style={{ textAlign: 'center', paddingTop: '6px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #00ff66', margin: '0 auto 4px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px' }}>🔑</div>
          <div style={{ color: '#00ff66', fontSize: '5px' }}>B-UNIT PASS ACTIVE</div>
          <div style={{ color: '#fff', fontSize: '6px' }}>[ 8 4 9 2 0 1 ]</div>
        </div>
      )}
      {(feature === 'charts' || feature === 'Telemetry Charts') && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px', paddingTop: '10px' }}>
          <div style={{ width: '8px', height: '20px', background: '#00ff66' }} />
          <div style={{ width: '8px', height: '12px', background: '#ff3b30' }} />
          <div style={{ width: '8px', height: '35px', background: '#00ff66' }} />
          <div style={{ width: '8px', height: '15px', background: '#ff3b30' }} />
          <div style={{ width: '8px', height: '42px', background: '#00ff66' }} />
        </div>
      )}
      {(feature === 'chat' || feature === 'Care Collaboration') && (
        <div>
          <div style={{ color: '#ffb000', fontSize: '5px' }}>IB CHAT WORKSPACE:</div>
          <div style={{ color: '#fff', marginTop: '2px' }}>Vance: Check execution.</div>
          <div style={{ color: '#00ff66' }}>You: Block order done.</div>
          <div style={{ color: '#555', marginTop: '3px' }}>Press &lt;GO&gt; to send</div>
        </div>
      )}
      {(feature === 'education' || feature === 'Operator Education') && (
        <div>
          <div style={{ color: '#aaa', fontSize: '5px' }}>BMC CERTIFICATIONS:</div>
          <div style={{ color: '#fff', marginTop: '2px' }}>1. Econ Indicators [100%]</div>
          <div style={{ color: '#fff' }}>2. Equities Module [100%]</div>
          <div style={{ color: '#00e5ff' }}>3. FX Trading [In Progress]</div>
        </div>
      )}
      {(feature === 'portfolio' || feature === 'Outcome Analytics') && (
        <div>
          <div style={{ color: '#aaa', fontSize: '5px' }}>PORTFOLIO METRICS:</div>
          <div style={{ color: '#fff', marginTop: '2px' }}>Total Return: +14.2%</div>
          <div style={{ color: '#00ff66' }}>S&P Benchmark: +12.1%</div>
          <div style={{ color: '#ffb000' }}>Active Alpha: +2.1%</div>
        </div>
      )}
    </div>
  );
}

function TerminalSubpageView({ onLaunchTerminal, onBack }) {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'products', 'terminal-in-action', 'challenges', 'insights'
  const isScrollingRef = useRef(false);
  
  // Demo request form state
  const [businessSituation, setBusinessSituation] = useState('');
  const [usedBloomberg, setUsedBloomberg] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('US');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [country, setCountry] = useState('');
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const sections = ['overview', 'products', 'terminal-in-action', 'challenges', 'insights'];
      const scrollPosition = window.scrollY + 180; // offset for headers

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTabClick = (sectionId) => {
    setActiveSection(sectionId);
    isScrollingRef.current = true;
    const el = document.getElementById(sectionId);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !company || !city || !jobRole || !companyType || !country) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setFormError('');
    setFormSubmitting(true);
    
    // Simulate submission lag
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  const scrollToRequestForm = () => {
    const el = document.getElementById('request-demo-section');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '80vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Subpage Hero with Bloomberg Gold/Orange Glow */}
      <section style={{
        background: 'linear-gradient(105deg, #000000 45%, #cc8e08 100%)',
        padding: '90px 24px',
        borderBottom: '1px solid #111',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#ff9900', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1.5px', display: 'block', marginBottom: '16px' }}>
              Bloomberg Terminal
            </span>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-0.5px' }}>
              The financial world in full focus built on next-gen technology
            </h1>
            <p style={{ fontSize: '18px', color: '#dddddd', lineHeight: '1.6', marginBottom: '36px', maxWidth: '650px' }}>
              Power your decision-making with best-in-class data, news, research, analytics and access to a global community - all from one fully integrated solution.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" onClick={scrollToRequestForm} style={{ backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '16px 36px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                Request a Demo
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DualMonitorSvg />
          </div>
        </div>
      </section>

      {/* Anchor Navigation Bar - White Background & Black Text (Exactly matching Bloomberg layout) */}
      <div style={{ 
        position: 'sticky', 
        top: '70px', 
        zIndex: 90, 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0', 
        padding: '0 24px' 
      }}>
        <div className="container" style={{ display: 'flex', gap: '30px' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products' },
            { id: 'terminal-in-action', label: 'Terminal in Action' },
            { id: 'challenges', label: 'Top Industry Challenges' },
            { id: 'insights', label: 'Insights' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeSection === tab.id ? '3px solid #000000' : '3px solid transparent',
                color: activeSection === tab.id ? '#000000' : '#555555',
                padding: '16px 0',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT PANEL - Crisp White Background for Subpage Content (Bloomberg Style) */}
      <div style={{ backgroundColor: '#ffffff', color: '#111111', padding: '60px 0', minHeight: '500px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          {/* OVERVIEW SECTION */}
          <section id="overview" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#333333', maxWidth: '1000px', marginBottom: '50px' }}>
              The Bloomberg Terminal revolutionized an industry by bringing transparency to financial markets. More than four decades on, it remains at the cutting edge of innovation and information delivery - with fast access to news, data, unique insight and trading tools helping leading decision makers turn knowledge into action.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {/* 4 Benefit Cards matching Screenshot 2 */}
              <div style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: '#005aff' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Extensive coverage</h3>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6' }}>The Terminal provides coverage of markets, industries, companies & securities across all asset classes.</p>
              </div>

              <div style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: '#005aff' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Powerful data & analytics</h3>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6' }}>Tap into data, proprietary and third-party research & analytics.</p>
              </div>

              <div style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: '#005aff' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Industry-leading collaboration tools</h3>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6' }}>Collaborate across your firm and with a global network of more than 350,000 influential decision makers.</p>
              </div>

              <div style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ color: '#005aff' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>Multi-asset execution</h3>
                <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6' }}>Create more efficient workflows with integrated execution & order management solutions and sophisticated pre- and post-trade analytics.</p>
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '60px 0' }} />

          {/* PRODUCTS SECTION */}
          <section id="products" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#111' }}>
              A Bloomberg Terminal subscription includes the most powerful, flexible tools for financial professionals.
            </h2>

            {/* Grid Layout mimicking Screenshot 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              
              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Research</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="research" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>News</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="news" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Access</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="access" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Charts</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="charts" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Collaboration Tools</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="chat" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Education</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="education" />
                </div>
              </div>

              <div style={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px', padding: '24px', height: '170px', display: 'flex', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Portfolio Analytics</h3>
                  <span style={{ fontSize: '16px' }}>→</span>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-10px', transform: 'rotate(-10deg)', opacity: 0.7 }}>
                  <MiniScreenMockup feature="portfolio" />
                </div>
              </div>

            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '60px 0' }} />

          {/* TERMINAL IN ACTION SECTION */}
          <section id="terminal-in-action" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', color: '#111' }}>
              Go further with the Bloomberg Terminal.
            </h2>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '60px' }}>
              Highlights of the Terminal in action.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
              
              {/* Row 1: Left Text, Right Mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>Research at your fingertips.</h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    Bloomberg Intelligence provides interactive data and exclusive outlooks by industry and region from a team of more than 350 research professionals.
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #ffb000 0%, #ff5a00 100%)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '16px', height: '200px', fontFamily: 'monospace', color: '#00ff66', fontSize: '10px' }}>
                    <div style={{ borderBottom: '1px solid #222', paddingBottom: '6px', marginBottom: '10px', color: '#ffb000' }}>BI &lt;GO&gt; - BLOOMBERG INTELLIGENCE</div>
                    <div>• EQUITIES OVERVIEW: HEALTHY RALLY DETECTED</div>
                    <div>• SECTOR SUMMARY: TECH LEADERS GAIN GROUND</div>
                    <div>• INFLATION GAUGES: EXPECTED CUT STABLE</div>
                    <div style={{ marginTop: '20px', color: '#aaa' }}>Querying analyst reports register...</div>
                  </div>
                </div>
              </div>

              {/* Row 2: Right Text, Left Mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div style={{ background: 'linear-gradient(135deg, #ffb000 0%, #ff5a00 100%)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '16px', height: '200px', fontFamily: 'monospace', color: '#00ff66', fontSize: '10px' }}>
                    <div style={{ borderBottom: '1px solid #222', paddingBottom: '6px', marginBottom: '10px', color: '#ffb000' }}>NEWS ANALYTICS</div>
                    <div style={{ color: '#00e5ff' }}>SENTIMENT SCORING SUMMARY: COMP INDEX</div>
                    <div style={{ marginTop: '10px' }}>• BULLISH HEADLINES: 78% (HIGH INDEX)</div>
                    <div style={{ color: '#ff3b30' }}>• BEARISH INDICATORS: 12% (LOW INDEX)</div>
                    <div style={{ color: '#aaa', marginTop: '20px' }}>Social volume ticker active...</div>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>News analytics that tell a bigger story.</h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    It's more than being the leading and largest provider of financial and business news. See which companies people are reading about the most.
                  </p>
                </div>
              </div>

              {/* Row 3: Left Text, Right Mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>Make instant connections.</h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    Anyone who's anyone in financial services connects with clients, counterparties and colleagues on Instant Bloomberg. The Terminal delivers access that no one else can from your desktop and mobile devices.
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #ffb000 0%, #ff5a00 100%)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '16px', height: '200px', fontFamily: 'monospace', color: '#fff', fontSize: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: '#ffb000', marginBottom: '2px' }}>IB &lt;GO&gt; - INSTANT BLOOMBERG</div>
                      <div style={{ color: '#aaa' }}>Vance: Executing buy order for COMP block index.</div>
                      <div style={{ color: '#00ff66', marginTop: '6px' }}>You: Confirmed, routing order via execute panel.</div>
                    </div>
                    <div style={{ borderTop: '1px solid #222', paddingTop: '6px', color: '#555' }}>
                      Type message &lt;GO&gt;
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Right Text, Left Mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div style={{ background: 'linear-gradient(135deg, #ffb000 0%, #ff5a00 100%)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '16px', height: '200px', fontFamily: 'monospace', color: '#00ff66', fontSize: '10px' }}>
                    <div style={{ borderBottom: '1px solid #222', paddingBottom: '6px', marginBottom: '10px', color: '#ffb000' }}>BLOOMBERG LAUNCHPAD</div>
                    <div>[DASH] S&P ACTIVE WATCH: +1.12% [STABLE]</div>
                    <div>[WIRE] EURUSD RATE LEVEL: 1.0842 [OK]</div>
                    <div>[PORT] ALPHA INDEX RATING: +2.1% [ACTIVE]</div>
                    <div style={{ marginTop: '20px', width: '100%', height: '40px', border: '1.5px dashed #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff' }}>
                      DRAG & DROP MODULES
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>Make fast decisions with a customized workspace.</h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    Bloomberg Launchpad delivers dynamic multi-asset class security monitors, powerful alerting tools, sophisticated charting and news that moves markets.
                  </p>
                </div>
              </div>

              {/* Row 5: Left Text, Right Mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '16px' }}>Never miss a beat.</h3>
                  <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    Access your Bloomberg Terminal account right on your mobile devices whether you're in between meetings, in transit or simply on the go.
                  </p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #ffb000 0%, #ff5a00 100%)', padding: '24px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '16px', height: '200px', fontFamily: 'monospace', color: '#fff', fontSize: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: '#ffb000', borderBottom: '1px solid #222', paddingBottom: '3px', marginBottom: '6px' }}>BLOOMBERG PROFESSIONAL APP</div>
                      <div>MOBILE PIN CODE: [ ACTIVE ]</div>
                      <div style={{ color: '#00ff66', marginTop: '10px' }}>• SECURITIES ACCESS GRANTED</div>
                      <div style={{ color: '#aaa' }}>• SYNCED DEVICE: PORTABLE 1</div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#555' }}>
                      Connected to secure network
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Terminal Essentials Section (Screenshot 2) */}
            <div style={{ 
              marginTop: '100px',
              background: 'linear-gradient(135deg, #0e0e0e 0%, #3a2802 100%)', 
              borderRadius: '8px', 
              padding: '60px 48px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ color: '#ff9900', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Terminal Essentials</h3>
                <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', marginBottom: '20px' }}>Watch what a Bloomberg Terminal can do for you.</h2>
                <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '450px' }}>
                  Terminal Essentials breaks down quick and useful ways to use the Bloomberg Terminal so that new users can confidently navigate one of the world's most powerful financial tools.
                </p>
                <button onClick={onLaunchTerminal} style={{ backgroundColor: '#005aff', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                  More Terminal Essentials
                </button>
              </div>
              
              {/* SVG Video Preview Mockup with Presenter */}
              <div style={{ position: 'relative', width: '100%', height: '240px', background: '#222', borderRadius: '6px', overflow: 'hidden', border: '1px solid #444' }}>
                {/* Presenter Silhouette & Terminal setup graphics */}
                <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', display: 'block' }}>
                  <defs>
                    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a1a1a" />
                      <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>
                  {/* Background glow */}
                  <rect width="400" height="240" fill="url(#glow)" />
                  {/* Desk & Dual Monitors silhouette */}
                  <rect x="50" y="140" width="300" height="80" fill="#151515" />
                  <rect x="80" y="80" width="110" height="70" fill="#0c0d12" stroke="#333" strokeWidth="1.5" />
                  <rect x="200" y="80" width="110" height="70" fill="#0c0d12" stroke="#333" strokeWidth="1.5" />
                  <rect x="130" y="150" width="10" height="30" fill="#333" />
                  <rect x="250" y="150" width="10" height="30" fill="#333" />
                  {/* Charts on monitors */}
                  <path d="M 90 120 L 120 100 L 150 130 L 180 90" fill="none" stroke="#ffb000" strokeWidth="1" />
                  <path d="M 210 110 L 240 130 L 270 95 L 300 115" fill="none" stroke="#00ff66" strokeWidth="1" />
                  {/* Presenter drawing */}
                  {/* Body */}
                  <path d="M 170 240 C 170 180, 230 180, 230 240 Z" fill="#292d35" />
                  {/* Head */}
                  <circle cx="200" cy="165" r="20" fill="#e0ac93" />
                  {/* Hair */}
                  <path d="M 180 165 C 180 145, 220 145, 220 165 C 220 155, 180 155, 180 165 Z" fill="#4a3728" />
                </svg>
                {/* Glass Play Overlay */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: 'rgba(0,0,0,0.4)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer'
                }} onClick={onLaunchTerminal}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: '4px' }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '40px 0' }} />

          {/* TOP INDUSTRY CHALLENGES SECTION */}
          <section id="challenges" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#111' }}>
              Top industry challenges and what our customers are saying about how Bloomberg helps.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center', marginBottom: '40px' }}>
              <div>
                <div style={{ fontSize: '64px', fontWeight: '800', color: '#005aff', fontFamily: 'monospace' }}>97%</div>
                <div style={{ fontSize: '13px', color: '#333', marginTop: '12px', lineHeight: '1.5', padding: '0 20px' }}>
                  of customers say Bloomberg delivers access to high-quality data.
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #e1e4e8' }}>
                <div style={{ fontSize: '64px', fontWeight: '800', color: '#005aff', fontFamily: 'monospace' }}>91%</div>
                <div style={{ fontSize: '13px', color: '#333', marginTop: '12px', lineHeight: '1.5', padding: '0 20px' }}>
                  of customers say Bloomberg delivers the right tech for their jobs.
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #e1e4e8' }}>
                <div style={{ fontSize: '64px', fontWeight: '800', color: '#005aff', fontFamily: 'monospace' }}>88%</div>
                <div style={{ fontSize: '13px', color: '#333', marginTop: '12px', lineHeight: '1.5', padding: '0 20px' }}>
                  of customers turn to Bloomberg for research to make informed decisions.
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#888', marginBottom: '60px' }}>
              Source: 2024 Bloomberg customer survey
            </div>

            {/* Interstitial Contact Card (Screenshot 4) */}
            <div style={{ 
              backgroundColor: '#000000', 
              borderRadius: '8px', 
              padding: '40px 60px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Tilted Terminal Screen Graphic */}
              <div style={{ position: 'absolute', right: '-40px', top: '-10px', width: '220px', height: '160px', opacity: 0.15, transform: 'rotate(-15deg)' }}>
                <MiniScreenMockup feature="charts" />
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', maxWidth: '600px', lineHeight: '1.4', zIndex: 2 }}>
                Have more questions about Terminal access? Our Terminal Support team is here to help.
              </h2>
              <button 
                onClick={scrollToRequestForm}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                →
              </button>
            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '40px 0' }} />

          {/* INSIGHTS SECTION (Scraped Articles from Screenshot 5) */}
          <section id="insights" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111', margin: 0 }}>
                Research & Insights
              </h2>
              <a href="/insights/" onClick={(e) => { e.preventDefault(); alert('Redirecting to full Bloomberg Insights catalog...'); }} style={{ color: '#005aff', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all Insights ➔
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* SVG graphic of line chart */}
                  <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                    <path d="M10 50 L 30 35 L 50 40 L 70 15 L 90 20" fill="none" stroke="#ff3b30" strokeWidth="2" />
                    <circle cx="90" cy="20" r="3" fill="#ff3b30" />
                  </svg>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ color: '#005aff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>ARTICLE | Regulation</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    May 2026 Global Regulatory Brief: Risk, capital and financial stability (APRA operational...
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* SVG graphic of bar chart */}
                  <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                    <rect x="20" y="30" width="10" height="20" fill="#ffb000" />
                    <rect x="40" y="20" width="10" height="30" fill="#ffb000" />
                    <rect x="60" y="10" width="10" height="40" fill="#00ff66" />
                  </svg>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ color: '#005aff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>ARTICLE | Regulation</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    May 2026 Global Regulatory Brief: Trading and markets (MiFIR market structure, SGX dual listin...
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* SVG graphic of network cables */}
                  <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                    <path d="M 10 30 Q 30 10, 50 30 T 90 30" fill="none" stroke="#00e5ff" strokeWidth="1.5" />
                    <path d="M 10 20 Q 30 40, 50 20 T 90 20" fill="none" stroke="#ffb000" strokeWidth="1.5" />
                  </svg>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ color: '#005aff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>ARTICLE | Regulation</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    May 2026 Global Regulatory Brief: Digital finance (Prediction markets, digital collateral and...
                  </h3>
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>

      {/* REQUEST A DEMO / CONTACT US SECTION (Scraped Form layout from Screenshot 6) */}
      <section id="request-demo-section" style={{ backgroundColor: '#ffffff', color: '#111111', borderTop: '1px solid #e0e0e0', padding: '90px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px' }}>
          
          {/* Left Column: Contact details */}
          <div>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111', margin: '0 0 40px 0' }}>Contact us</h2>
            
            <div style={{ padding: '30px', backgroundColor: '#f4f6f9', borderRadius: '6px', border: '1px solid #e1e4e8', maxWidth: '420px' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#e2edff', color: '#005aff', fontWeight: 'bold', fontSize: '9px', letterSpacing: '0.5px', padding: '4px 8px', borderRadius: '3px', marginBottom: '16px' }}>HELP & SUPPORT</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', margin: '0 0 10px 0' }}>Already a customer?</h3>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                If you have queries regarding software installations, key replacements, or billing, connect with support.
              </p>
              <a 
                href="/login/" 
                onClick={(e) => { e.preventDefault(); onLaunchTerminal(); }} 
                style={{ color: '#005aff', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Get in touch with the support team ➔
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div style={{ padding: '10px 0' }}>
            
            {formSubmitted ? (
              <div style={{ padding: '40px', backgroundColor: '#f4fffa', border: '1.5px solid #00c853', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#00c853', display: 'block', marginBottom: '16px' }}>✓</span>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '10px' }}>Thank you, {firstName}!</h3>
                <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
                  We have received your Bloomberg Terminal demo request. A specialist will contact you shortly at <strong>{email}</strong> to review your system requirements.
                </p>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '6px', border: '1px solid #d4ecd5', display: 'inline-block' }}>
                  <p style={{ color: '#555', fontSize: '13px', margin: '0 0 16px 0' }}>
                    In the meantime, you can launch our interactive monospaced Terminal simulator:
                  </p>
                  <button 
                    onClick={onLaunchTerminal}
                    style={{ backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '14px 32px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Launch Terminal Simulator
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', margin: 0 }}>
                  Help us connect you to the right person
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    Please explain the business situation or problem you are trying to manage. *
                  </label>
                  <textarea 
                    value={businessSituation}
                    onChange={(e) => setBusinessSituation(e.target.value)}
                    required
                    rows="4" 
                    placeholder="Provide details about your firm's asset management, data feeds, or trading workflow..."
                    style={{ width: '100%', padding: '12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    Have you ever used the Bloomberg Professional Service? *
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {[
                      { val: 'no', label: 'No' },
                      { val: 'firm-customer', label: 'No, but my firm is a Bloomberg customer' },
                      { val: 'yes-previous', label: 'Yes, I have used it previously' },
                      { val: 'yes-current', label: 'Yes, I am currently a client' }
                    ].map((opt) => (
                      <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="usedBloomberg" 
                          value={opt.val}
                          checked={usedBloomberg === opt.val}
                          onChange={(e) => setUsedBloomberg(e.target.value)}
                          required
                          style={{ cursor: 'pointer' }} 
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', marginTop: '16px', margin: 0 }}>
                  Tell us about yourself
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>First name *</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Last name *</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Business email *</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Phone *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }}
                    >
                      <option value="US">United States (+1)</option>
                      <option value="UK">United Kingdom (+44)</option>
                      <option value="IN">India (+91)</option>
                      <option value="CA">Canada (+1)</option>
                      <option value="DE">Germany (+49)</option>
                    </select>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      placeholder="Phone number"
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Company *</label>
                    <input 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>City *</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Job role *</label>
                  <select 
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Trader">Trader</option>
                    <option value="Portfolio Manager">Portfolio Manager</option>
                    <option value="Risk Manager">Risk Manager</option>
                    <option value="CEO">Chief Executive Officer</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other / Not Applicable</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Company type *</label>
                  <select 
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="Asset Management">Asset Management Firm</option>
                    <option value="Broker Dealer">Broker Dealer</option>
                    <option value="Corporation">Corporation (Non-Financial)</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Hedge Fund">Hedge Fund</option>
                    <option value="Private Equity">Private Equity / Venture Capital</option>
                    <option value="RIA">RIA / Wealth Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Country or region *</label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {formError && (
                  <div style={{ color: '#ff3b30', fontSize: '13px', fontWeight: 'bold' }}>
                    {formError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  style={{ 
                    backgroundColor: '#005aff', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '14px', 
                    borderRadius: '4px', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {formSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Submitting Request...
                    </>
                  ) : 'Submit Request'}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>
      
      {/* Keyframe spinner style hack */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function SubpageView({ pageId, onLaunchTerminal, onBack }) {
  if (pageId === 'aegis-terminal' || pageId === 'terminal-overview') {
    return <TerminalSubpageView onLaunchTerminal={onLaunchTerminal} onBack={onBack} />;
  }

  const config = SUBPAGES_CONFIG[pageId] || {
    title: "Services Detail",
    subtitle: "Aegis Health Professional Services clinical databases and pipelines.",
    heroGradient: "radial-gradient(circle at top, #111 0%, #000 80%)",
    stats: [{ value: '99.9%', label: 'Active Service' }],
    capabilities: [{ title: "Interactive Telemetry", desc: "Access high-performance dashboards and secure records streams." }],
    widgetType: "default"
  };

  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'capabilities', 'sandbox'
  const isScrollingRef = useRef(false);

  // Demo request form state
  const [businessSituation, setBusinessSituation] = useState('');
  const [usedBloomberg, setUsedBloomberg] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('US');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [country, setCountry] = useState('');
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const sections = ['sub-overview', 'sub-capabilities', 'sub-sandbox'];
      const scrollPosition = window.scrollY + 180; // offset for headers

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId.replace('sub-', ''));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pageId]);

  const handleTabClick = (sectionId) => {
    setActiveSection(sectionId.replace('sub-', ''));
    isScrollingRef.current = true;
    const el = document.getElementById(sectionId);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !company || !city || !jobRole || !companyType || !country) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setFormError('');
    setFormSubmitting(true);
    
    // Simulate submission lag
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  const scrollToRequestForm = () => {
    const el = document.getElementById('request-demo-section');
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '80vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Subpage Hero with Custom Page Gradient */}
      <section style={{
        background: config.heroGradient || 'linear-gradient(105deg, #000000 45%, #cc8e08 100%)',
        padding: '90px 24px',
        borderBottom: '1px solid #111',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#ff9900', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1.5px', display: 'block', marginBottom: '16px' }}>
              Bloomberg Professional Services
            </span>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-0.5px' }}>
              {config.title}
            </h1>
            <p style={{ fontSize: '18px', color: '#dddddd', lineHeight: '1.6', marginBottom: '36px', maxWidth: '650px' }}>
              {config.subtitle}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" onClick={scrollToRequestForm} style={{ backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '16px 36px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                Request a Demo
              </button>
              <button className="btn-secondary" onClick={onBack} style={{ border: '1px solid #444', color: '#fff', padding: '15px 35px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}>
                Back to Directory
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <ClinicalDualMonitorSvg widgetType={config.widgetType} title={config.title} />
          </div>
        </div>
      </section>

      {/* Anchor Navigation Bar - White Background & Black Text */}
      <div style={{ 
        position: 'sticky', 
        top: '70px', 
        zIndex: 90, 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0', 
        padding: '0 24px' 
      }}>
        <div className="container" style={{ display: 'flex', gap: '30px' }}>
          {[
            { id: 'sub-overview', label: 'Overview' },
            { id: 'sub-capabilities', label: 'Enterprise Capabilities' },
            { id: 'sub-sandbox', label: 'Interactive Sandbox' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeSection === tab.id.replace('sub-', '') ? '3px solid #000000' : '3px solid transparent',
                color: activeSection === tab.id.replace('sub-', '') ? '#000000' : '#555555',
                padding: '16px 0',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT PANEL - Crisp White Background for Subpage Content */}
      <div style={{ backgroundColor: '#ffffff', color: '#111111', padding: '60px 0', minHeight: '500px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          
          {/* OVERVIEW SECTION */}
          <section id="sub-overview" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#333333', maxWidth: '1000px', marginBottom: '50px' }}>
              {config.subtitle} Deploy advanced data pipelines, low-latency telemetry feeds, and regulatory compliance indexes configured specifically for modern professional environments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${config.stats.length}, 1fr)`, gap: '24px' }}>
              {config.stats.map((s, idx) => (
                <div key={idx} style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: '800', color: '#005aff', fontFamily: 'monospace' }}>
                    {s.value}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: 0 }}>
                    {s.label}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '60px 0' }} />

          {/* CAPABILITIES SECTION */}
          <section id="sub-capabilities" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#111' }}>
              Capabilities included with {config.title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {config.capabilities.map((c, idx) => (
                <div key={idx} style={{ padding: '30px 24px', backgroundColor: '#f4f6f9', border: '1px solid #e1e4e8', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '4px', 
                    backgroundColor: '#e2edff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#005aff', 
                    fontSize: '18px', 
                    fontWeight: 'bold' 
                  }}>
                    {idx + 1}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', margin: 0 }}>
                    {c.title}
                  </h3>
                  <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr style={{ border: 'none', borderBottom: '1px solid #e5e5e5', margin: '60px 0' }} />

          {/* INTERACTIVE SANDBOX SECTION */}
          <section id="sub-sandbox" style={{ scrollMarginTop: '160px', paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', textAlign: 'center', marginBottom: '40px', color: '#111' }}>
              Interactive Demo Sandbox
            </h2>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '30px' }}>
              <SubpageWidget type={config.widgetType} />
            </div>
          </section>

        </div>
      </div>

      {/* REQUEST A DEMO / CONTACT US SECTION */}
      <section id="request-demo-section" style={{ backgroundColor: '#ffffff', color: '#111111', borderTop: '1px solid #e0e0e0', padding: '90px 24px', scrollMarginTop: '160px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px' }}>
          
          {/* Left Column: Contact details */}
          <div>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111', margin: '0 0 40px 0' }}>Contact us</h2>
            
            <div style={{ padding: '30px', backgroundColor: '#f4f6f9', borderRadius: '6px', border: '1px solid #e1e4e8', maxWidth: '420px' }}>
              <span style={{ display: 'inline-block', backgroundColor: '#e2edff', color: '#005aff', fontWeight: 'bold', fontSize: '9px', letterSpacing: '0.5px', padding: '4px 8px', borderRadius: '3px', marginBottom: '16px' }}>HELP & SUPPORT</span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', margin: '0 0 10px 0' }}>Already a customer?</h3>
              <p style={{ color: '#555', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                If you have queries regarding software installations, key replacements, or billing, connect with support.
              </p>
              <a 
                href="/login/" 
                onClick={(e) => { e.preventDefault(); onLaunchTerminal(); }} 
                style={{ color: '#005aff', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Get in touch with the support team ➔
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div style={{ padding: '10px 0' }}>
            
            {formSubmitted ? (
              <div style={{ padding: '40px', backgroundColor: '#f4fffa', border: '1.5px solid #00c853', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#00c853', display: 'block', marginBottom: '16px' }}>✓</span>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '10px' }}>Thank you, {firstName}!</h3>
                <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
                  We have received your Bloomberg Professional Services demo request. A specialist will contact you shortly at <strong>{email}</strong> to review your system requirements.
                </p>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '6px', border: '1px solid #d4ecd5', display: 'inline-block' }}>
                  <p style={{ color: '#555', fontSize: '13px', margin: '0 0 16px 0' }}>
                    In the meantime, you can launch our interactive monospaced Terminal simulator:
                  </p>
                  <button 
                    onClick={onLaunchTerminal}
                    style={{ backgroundColor: '#005aff', color: '#fff', border: 'none', padding: '14px 32px', fontSize: '14px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Launch Terminal Simulator
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', margin: 0 }}>
                  Help us connect you to the right person
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    Please explain the business situation or problem you are trying to manage. *
                  </label>
                  <textarea 
                    value={businessSituation}
                    onChange={(e) => setBusinessSituation(e.target.value)}
                    required
                    rows="4" 
                    placeholder="Provide details about your firm's asset management, data feeds, or trading workflow..."
                    style={{ width: '100%', padding: '12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    Have you ever used the Bloomberg Professional Service? *
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="usedBloomberg" 
                        value="yes" 
                        checked={usedBloomberg === 'yes'}
                        onChange={(e) => setUsedBloomberg(e.target.value)}
                        required 
                      /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="usedBloomberg" 
                        value="no" 
                        checked={usedBloomberg === 'no'}
                        onChange={(e) => setUsedBloomberg(e.target.value)}
                      /> No
                    </label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>First name *</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Last name *</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Work email *</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Phone *</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }}
                    >
                      <option value="US">United States (+1)</option>
                      <option value="UK">United Kingdom (+44)</option>
                      <option value="IN">India (+91)</option>
                      <option value="CA">Canada (+1)</option>
                      <option value="DE">Germany (+49)</option>
                    </select>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      placeholder="Phone number"
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Company *</label>
                    <input 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>City *</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required 
                      style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Job role *</label>
                  <select 
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Trader">Trader</option>
                    <option value="Portfolio Manager">Portfolio Manager</option>
                    <option value="Risk Manager">Risk Manager</option>
                    <option value="CEO">Chief Executive Officer</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other / Not Applicable</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Company type *</label>
                  <select 
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="Asset Management">Asset Management Firm</option>
                    <option value="Broker Dealer">Broker Dealer</option>
                    <option value="Corporation">Corporation (Non-Financial)</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Hedge Fund">Hedge Fund</option>
                    <option value="Private Equity">Private Equity / Venture Capital</option>
                    <option value="RIA">RIA / Wealth Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>Country or region *</label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Select one</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {formError && (
                  <div style={{ color: '#ff3b30', fontSize: '13px', fontWeight: 'bold' }}>
                    {formError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  style={{ 
                    backgroundColor: '#005aff', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '14px', 
                    borderRadius: '4px', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {formSubmitting ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Submitting Request...
                    </>
                  ) : 'Submit Request'}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>
      
      {/* Keyframe spinner style hack */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function BloombergWhiteFooter({ onLaunchTerminal }) {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      color: '#111111',
      padding: '80px 24px 60px 24px',
      fontSize: '13px',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      borderTop: '1px solid #e5e5e5',
      lineHeight: '1.5'
    }}>
      <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr) 1.5fr',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid #e5e5e5'
        }}>
          
          {/* Col 1: Contact & Press */}
          <div>
            <h4 style={{ fontWeight: '800', color: '#000000', fontSize: '11px', letterSpacing: '0.8px', marginBottom: '18px', textTransform: 'uppercase' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#555555' }}>
              <li>Americas +1 212 318 2000</li>
              <li>EMEA +44 20 7330 7500</li>
              <li>Asia Pacific +65 6212 1000</li>
            </ul>
            
            <h4 style={{ fontWeight: '800', color: '#000000', fontSize: '11px', letterSpacing: '0.8px', marginTop: '36px', marginBottom: '18px', textTransform: 'uppercase' }}>Press</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#555555' }}>
              <li style={{ cursor: 'pointer' }}>Announcements</li>
            </ul>
          </div>

          {/* Col 2: Customer Support */}
          <div>
            <h4 style={{ fontWeight: '800', color: '#000000', fontSize: '11px', letterSpacing: '0.8px', marginBottom: '18px', textTransform: 'uppercase' }}>Customer Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#555555' }}>
              <li style={{ cursor: 'pointer' }}>Software Updates</li>
              <li style={{ cursor: 'pointer' }}>Manage Products and Account Information</li>
              <li style={{ cursor: 'pointer' }} onClick={onLaunchTerminal}>B-Unit Setup</li>
              <li style={{ cursor: 'pointer' }}>FAQ</li>
            </ul>
          </div>

          {/* Col 3: Client Access */}
          <div>
            <h4 style={{ fontWeight: '800', color: '#000000', fontSize: '11px', letterSpacing: '0.8px', marginBottom: '18px', textTransform: 'uppercase' }}>Client Access</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#555555' }}>
              <li style={{ cursor: 'pointer' }} onClick={onLaunchTerminal}>Bloomberg Anywhere</li>
              <li style={{ cursor: 'pointer', color: '#005aff' }}>Bloomberg Legal Entity Identifier</li>
              <li style={{ cursor: 'pointer' }}>Bloomberg Vault</li>
              <li style={{ cursor: 'pointer' }}>Enterprise Console</li>
              <li style={{ cursor: 'pointer' }}>Entity Exchange</li>
              <li style={{ cursor: 'pointer' }}>Stay Connected</li>
              <li style={{ cursor: 'pointer' }}>Documentation</li>
              <li style={{ cursor: 'pointer' }}>API Library</li>
              <li style={{ cursor: 'pointer' }}>Webinars</li>
            </ul>
          </div>

          {/* Col 4: Regions */}
          <div>
            <h4 style={{ fontWeight: '800', color: '#000000', fontSize: '11px', letterSpacing: '0.8px', marginBottom: '18px', textTransform: 'uppercase' }}>Regions</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#555555' }}>
              <li style={{ cursor: 'pointer' }}>Brazil</li>
              <li style={{ cursor: 'pointer' }}>Simplified Chinese</li>
              <li style={{ cursor: 'pointer' }}>Traditional Chinese</li>
              <li style={{ cursor: 'pointer' }}>Japan</li>
              <li style={{ cursor: 'pointer' }}>Korea</li>
              <li style={{ cursor: 'pointer' }}>Latin America</li>
            </ul>
          </div>

          {/* Col 5: Description & Branding */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#333333', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px 0', fontWeight: '400' }}>
                Bloomberg Professional Services connect decision makers to a dynamic network of information, people and ideas.
              </p>
              <a href="#request-demo-section" style={{
                color: '#005aff',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px'
              }}>
                Contact Us <span style={{ fontSize: '16px' }}>→</span>
              </a>
            </div>
            
            {/* Bloomberg Wordmark in bottom right of this grid block or footer */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
              <span style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-1px', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
                Bloomberg
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Socials, Footer Links */}
        <div style={{ paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div style={{ color: '#888888', fontSize: '12px' }}>
              © 2026 Bloomberg Finance L.P. All rights reserved.
            </div>
            {/* Social Icons using text or clean symbols */}
            <div style={{ display: 'flex', gap: '20px', color: '#555555', fontSize: '16px', alignItems: 'center' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }} title="LinkedIn">in</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }} title="X">X</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }} title="Facebook">f</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} title="RSS">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 0 1 9 9" />
                  <path d="M4 4a16 16 0 0 1 16 16" />
                  <circle cx="5" cy="19" r="1" />
                </svg>
              </a>
            </div>
          </div>

          {/* Inline Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', fontSize: '12px', color: '#666666' }}>
            {['Privacy', 'Terms', 'Tradebook Compliance', 'Company', 'Press', 'Careers', 'AdChoices', 'Cookie Preferences'].map((link) => (
              <span key={link} style={{ cursor: 'pointer' }}>{link}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
