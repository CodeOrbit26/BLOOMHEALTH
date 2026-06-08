import React, { useState } from 'react';
import Homepage from './components/Homepage';
import BUnitLogin from './components/BUnitLogin';
import Terminal from './components/Terminal';

function App() {
  // Navigation: 'home' | 'login' | 'terminal'
  const [screen, setScreen] = useState('home');

  return (
    <>
      {screen === 'home' && (
        <Homepage onLaunchTerminal={() => setScreen('login')} />
      )}
      
      {screen === 'login' && (
        <BUnitLogin
          onLoginSuccess={() => setScreen('terminal')}
          onBackToHome={() => setScreen('home')}
        />
      )}
      
      {screen === 'terminal' && (
        <Terminal onLogout={() => setScreen('home')} />
      )}
    </>
  );
}

export default App;
