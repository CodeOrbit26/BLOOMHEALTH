import React, { useState, useEffect } from 'react';

export default function NewsPanel() {
  const [newsList, setNewsList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        setNewsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">NEWS - Aegis Medical Wire</h2>
          <span className="panel-subtitle">BREAKING CLINICAL, RESEARCH AND BIOPHARMA INTELLIGENCE</span>
        </div>
        <div>
          <span style={{ color: 'var(--terminal-green)' }}>● WIRE ACTIVE</span>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--accent-gold)', borderBottom: '1px solid #333', paddingBottom: '6px', marginBottom: '12px' }}>
          LATEST REAL-TIME TELEGRAPH ARTICLES (Click headline to read full dispatch)
        </h3>

        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Connecting to medical news grid...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {newsList.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    backgroundColor: '#11141d',
                    border: isExpanded ? '1px solid var(--accent-gold)' : '1px solid #222',
                    borderRadius: '4px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10px' }}>
                    <span style={{ color: 'var(--terminal-cyan)', fontWeight: 'bold' }}>{item.category}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.time} | {item.source}</span>
                  </div>
                  
                  <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', lineHeight: '1.4' }}>
                    {item.headline}
                  </h4>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px dashed #333',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        lineHeight: '1.5'
                      }}
                    >
                      {item.content}
                    </div>
                  )}

                  <div style={{ textAlign: 'right', fontSize: '9px', color: 'var(--accent-gold)', marginTop: '8px' }}>
                    {isExpanded ? '▲ Collapse article' : '▼ Expand full dispatch'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
