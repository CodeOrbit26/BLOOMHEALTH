import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import BUnitLogin from './components/BUnitLogin';
import Terminal from './components/Terminal';

function App() {
  const getScreenFromPath = (path) => {
    if (path === '/login' || path === '/login/') return 'login';
    if (path === '/terminal' || path === '/terminal/') return 'terminal';
    return 'home';
  };

  const [screen, setScreen] = useState(() => getScreenFromPath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setScreen(getScreenFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (targetScreen, urlPath) => {
    window.history.pushState({ screen: targetScreen }, '', urlPath);
    setScreen(targetScreen);
  };

  return (
    <>
      {screen === 'home' && (
        <Homepage onLaunchTerminal={() => navigateTo('login', '/login/')} />
      )}
      
      {screen === 'login' && (
        <BUnitLogin
          onLoginSuccess={() => navigateTo('terminal', '/terminal/')}
          onBackToHome={() => navigateTo('home', '/')}
        />
      )}
      
      {screen === 'terminal' && (
        <Terminal onLogout={() => navigateTo('home', '/')} />
      )}
    </>
  );
}

export default App;
