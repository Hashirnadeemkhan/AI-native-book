import React, { useState } from 'react';
import { useSession } from '../lib/auth-client';
import { useHistory } from '@docusaurus/router';

const SettingsButton = () => {
  const { data: session } = useSession();
  const history = useHistory();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!session) {
    return null; // Only show to authenticated users
  }

  const handleClick = () => {
    history.push('/onboarding');
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={handleClick}
        className="settings-btn"
        style={{
          padding: '8px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: 'auto',
          transition: 'all 0.2s ease',
          background: 'transparent',
          border: '1px solid var(--pro-border)',
          borderRadius: '6px',
          color: 'var(--pro-text-body)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: '500',
          cursor: 'pointer',
        }}
        aria-label="Update Personalization Settings"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="settings-gear"
        >
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            marginTop: '8px',
            right: 0,
            zIndex: 50,
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              background: 'var(--pro-panel)',
              border: '1px solid var(--pro-border)',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              color: 'var(--pro-text-light)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
            }}>
              Update Profile Settings
            </div>
          </div>
        </div>
      )}

      <style>{`
        .settings-gear {
          transition: transform 0.4s ease;
        }
        .settings-btn:hover {
          border-color: var(--pro-primary) !important;
          color: var(--pro-primary) !important;
        }
        .settings-btn:hover .settings-gear {
          transform: rotate(90deg);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsButton;
