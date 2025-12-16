import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { useSession } from '../lib/auth-client';
import { setGlobalContentMode } from './ContentTransformer';

export default function NavbarAIControls() {
  const { data: session } = useSession();
  const location = useLocation();
  const [activeMode, setActiveMode] = React.useState<'original' | 'summary' | 'urdu'>('original');

  // Reset state when location changes
  useEffect(() => {
    setActiveMode('original');
  }, [location.pathname]);

  const handleModeChange = (mode: 'original' | 'summary' | 'urdu') => {
    if (!session && mode !== 'original') {
      alert("Please sign in to use this feature.");
      return;
    }

    // Toggle functionality
    if (activeMode === mode) {
      setActiveMode('original');
      setGlobalContentMode('original');
    } else {
      setActiveMode(mode);
      setGlobalContentMode(mode);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: '16px',
    }}>
      {/* Summary Button */}
      <button
        onClick={() => handleModeChange('summary')}
        disabled={!session}
        title={!session ? "Login required" : activeMode === 'summary' ? "Return to original" : "View Summary"}
        className={`navbar-ai-btn ${activeMode === 'summary' ? 'active-primary' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: activeMode === 'summary' ? 'var(--pro-primary)' : 'transparent',
          border: `1px solid ${activeMode === 'summary' ? 'var(--pro-primary)' : 'var(--pro-border)'}`,
          borderRadius: '6px',
          color: activeMode === 'summary' ? 'white' : 'var(--pro-text-body)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.8rem',
          fontWeight: '500',
          cursor: !session ? 'not-allowed' : 'pointer',
          opacity: !session ? 0.4 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <span>Summary</span>
        {!session && <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>🔒</span>}
      </button>

      {/* Urdu Button */}
      <button
        onClick={() => handleModeChange('urdu')}
        disabled={!session}
        title={!session ? "Login required" : activeMode === 'urdu' ? "Return to original" : "View Urdu Translation"}
        className={`navbar-ai-btn ${activeMode === 'urdu' ? 'active-accent' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: activeMode === 'urdu' ? 'var(--pro-accent)' : 'transparent',
          border: `1px solid ${activeMode === 'urdu' ? 'var(--pro-accent)' : 'var(--pro-border)'}`,
          borderRadius: '6px',
          color: activeMode === 'urdu' ? 'white' : 'var(--pro-text-body)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.8rem',
          fontWeight: '500',
          cursor: !session ? 'not-allowed' : 'pointer',
          opacity: !session ? 0.4 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
        </svg>
        <span>Urdu</span>
        {!session && <span style={{ fontSize: '0.6rem', marginLeft: '2px' }}>🔒</span>}
      </button>

      {/* Active Indicator Dot */}
      {activeMode !== 'original' && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: activeMode === 'summary' ? 'var(--pro-primary)' : 'var(--pro-accent)',
        }}></div>
      )}
    </div>
  );
}
