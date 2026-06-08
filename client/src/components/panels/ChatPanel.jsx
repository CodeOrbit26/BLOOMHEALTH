import React, { useState, useEffect, useRef } from 'react';

export default function ChatPanel() {
  const [activeDoctor, setActiveDoctor] = useState('dr-carter');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [doctorInfo, setDoctorInfo] = useState({ name: '', title: '' });
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  const doctorsList = [
    { id: 'dr-carter', name: 'Dr. John Carter', title: 'MD, Trauma Chief', status: 'Online' },
    { id: 'dr-house', name: 'Dr. Gregory House', title: 'MD, Chief Diagnostics', status: 'Online' },
    { id: 'nurse-jackie', name: 'Jackie Peyton', title: 'RN, ICU Coordinator', status: 'Away' },
    { id: 'aegis-ai', name: 'Aegis Clinical AI', title: 'Diagnostic Neural Node', status: 'Online' }
  ];

  // Fetch Chat History
  const fetchHistory = (docId) => {
    fetch(`/api/chat/${docId}`)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data.history || []);
        setDoctorInfo({ name: data.name, title: data.title });
      })
      .catch((err) => console.error('Error fetching chat history:', err));
  };

  useEffect(() => {
    fetchHistory(activeDoctor);
  }, [activeDoctor]);

  // Scroll to bottom helper
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');

    // Append users message locally instantly
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);

    // POST to backend
    fetch(`/api/chat/${activeDoctor}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMsg })
    })
      .then((res) => res.json())
      .then(() => {
        // Wait 1 second and then pull history to catch the bot reply
        setTimeout(() => {
          fetchHistory(activeDoctor);
          setIsTyping(false);
        }, 800);
      })
      .catch((err) => {
        console.error('Error sending message:', err);
        setIsTyping(false);
      });
  };

  return (
    <div className="panel-container" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">MSG - Aegis Consultation Link</h2>
          <span className="panel-subtitle">SECURE CLINICAL COMMUNICATIONS ENVELOPE</span>
        </div>
        <div>
          <span style={{ color: 'var(--terminal-green)' }}>● SECURE LINK</span>
        </div>
      </div>

      <div className="chat-layout">
        {/* Left Doctor List */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">Clinical Directory</div>
          <ul className="chat-user-list">
            {doctorsList.map((doc) => (
              <li
                key={doc.id}
                className={`chat-user-item ${activeDoctor === doc.id ? 'active' : ''}`}
                onClick={() => setActiveDoctor(doc.id)}
              >
                <div className="chat-user-name">{doc.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="chat-user-title">{doc.title}</span>
                  <span style={{ fontSize: '8px', color: doc.status === 'Online' ? 'var(--terminal-green)' : 'var(--text-muted)' }}>
                    ● {doc.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Active Message Board */}
        <div className="chat-workspace">
          <div className="chat-workspace-header">
            <span className="chat-partner-name">{doctorInfo.name}</span>
            <span className="chat-partner-title" style={{ marginLeft: '12px' }}>
              {doctorInfo.title}
            </span>
          </div>

          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.sender === 'user' ? 'user' : 'partner'}`}>
                <div>{msg.text}</div>
                <div className="chat-msg-time">
                  {msg.sender === 'user' ? 'You' : doctorInfo.name.split(' ')[1]}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg partner" style={{ opacity: 0.7, fontStyle: 'italic' }}>
                Typing consult response...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <input
              type="text"
              className="chat-input-element"
              placeholder={`Send message to ${doctorInfo.name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              Transmit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
