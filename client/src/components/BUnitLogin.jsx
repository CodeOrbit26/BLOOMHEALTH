import React, { useState, useEffect, useRef } from 'react';

export default function BUnitLogin({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('aegis_director');
  const [password, setPassword] = useState('admin123');
  const [otpInput, setOtpInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // B-Unit Device State
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fingerprintPressed, setFingerprintPressed] = useState(false);
  const [bUnitCode, setBUnitCode] = useState('------');
  const [timeRemaining, setTimeRemaining] = useState(30);

  const otpTimerRef = useRef(null);

  // Function to generate a random 6-digit code formatted as "XXX XXX"
  const generateOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return `${code.slice(0, 3)} ${code.slice(3, 6)}`;
  };

  // B-Unit Power Toggle
  const handlePowerClick = () => {
    if (isPowerOn) {
      // Turn off
      setIsPowerOn(false);
      setIsSyncing(false);
      setFingerprintPressed(false);
      setBUnitCode('------');
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    } else {
      // Turn on
      setIsPowerOn(true);
      setIsSyncing(true);
      setFingerprintPressed(false);
      setBUnitCode('WAITING...');
    }
  };

  // Fingerprint Scan Touch
  const handleFingerprintTouch = () => {
    if (!isPowerOn || !isSyncing || fingerprintPressed) return;

    setFingerprintPressed(true);
    setBUnitCode('SYNCING...');

    setTimeout(() => {
      const code = generateOTP();
      setBUnitCode(code);
      setIsSyncing(false);
      setTimeRemaining(30);
    }, 1500);
  };

  // OTP Countdown Timer
  useEffect(() => {
    if (isPowerOn && !isSyncing && fingerprintPressed && bUnitCode !== '------') {
      otpTimerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Regenerate
            setBUnitCode(generateOTP());
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    };
  }, [isPowerOn, isSyncing, fingerprintPressed, bUnitCode]);

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Username and password are required.');
      return;
    }

    if (!isPowerOn || bUnitCode === '------' || isSyncing) {
      setErrorMessage('B-Unit token is offline or not synchronized.');
      return;
    }

    // Strip spaces to verify code
    const cleanInput = otpInput.replace(/\s+/g, '');
    const cleanBUnit = bUnitCode.replace(/\s+/g, '');

    if (cleanInput !== cleanBUnit) {
      setErrorMessage('AUTHENTICATION ERROR: B-Unit signature verification failed.');
      return;
    }

    // Success!
    setErrorMessage('');
    onLoginSuccess();
  };

  // Auto-fill B-Unit code helper for developer convenience
  const handleAutofill = () => {
    if (bUnitCode && bUnitCode !== '------' && bUnitCode !== 'SYNCING...' && bUnitCode !== 'WAITING...') {
      setOtpInput(bUnitCode.replace(/\s+/g, ''));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        {/* Left Form Side */}
        <div className="login-form-side">
          <div className="login-header">
            <h2>Secure Access Portal</h2>
            <p>Aegis Health Professional Services Authentication</p>
          </div>

          {errorMessage && <div className="login-error">{errorMessage}</div>}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>System Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter clinical ID"
              />
            </div>

            <div className="form-group">
              <label>Network Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>B-Unit Security Code</label>
                {bUnitCode !== '------' && bUnitCode !== 'SYNCING...' && bUnitCode !== 'WAITING...' && (
                  <span
                    onClick={handleAutofill}
                    style={{ fontSize: '10px', color: 'var(--accent-gold)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Auto-fill Code
                  </span>
                )}
              </div>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="6-Digit token code"
                maxLength={8}
                style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '2px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                Verify & Log In
              </button>
              <button type="button" className="btn-secondary" onClick={onBackToHome}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right B-Unit Device Side */}
        <div className="bunit-side">
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '16px', letterSpacing: '1px' }}>
            Biometric Hardware
          </h3>
          <div className={`bunit-device ${isPowerOn ? 'active' : ''} ${isSyncing ? 'syncing' : ''}`}>
            {/* LED Status Light */}
            <div className="bunit-biometric-ring" onClick={handleFingerprintTouch}>
              <span className="bunit-fingerprint">👆</span>
            </div>

            {/* B-Unit LCD Screen */}
            <div className="bunit-screen">
              <span className="bunit-screen-status">
                {!isPowerOn
                  ? 'UNIT POWER OFF'
                  : isSyncing
                  ? fingerprintPressed
                    ? 'AUTHORIZING...'
                    : 'TAP SCANNER'
                  : 'AEGIS SECURE'}
              </span>
              <span className="bunit-screen-code">{bUnitCode}</span>
              
              {isPowerOn && !isSyncing && fingerprintPressed && (
                <div
                  className="bunit-screen-progress"
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                ></div>
              )}
            </div>

            {/* B-Unit Hardware Keypad */}
            <div className="bunit-keyboard">
              <button type="button" className="bunit-key">1</button>
              <button type="button" className="bunit-key">2</button>
              <button type="button" className="bunit-key">3</button>
              <button type="button" className="bunit-key">4</button>
              <button type="button" className="bunit-key">5</button>
              <button type="button" className="bunit-key">6</button>
              <button type="button" className="bunit-key">7</button>
              <button type="button" className="bunit-key">8</button>
              <button type="button" className="bunit-key">9</button>
              <button
                type="button"
                className={`bunit-key power ${isPowerOn ? 'active' : ''}`}
                onClick={handlePowerClick}
              >
                ⏻
              </button>
              <button type="button" className="bunit-key">0</button>
              <button type="button" className="bunit-key">↵</button>
            </div>
          </div>

          <div className="bunit-device-hint">
            <strong>B-Unit Instructions:</strong><br />
            1. Click the red power button (⏻).<br />
            2. Tap the fingerprint reader (👆).<br />
            3. Enter the generated 6-digit code on the form.
          </div>
        </div>
      </div>
    </div>
  );
}
