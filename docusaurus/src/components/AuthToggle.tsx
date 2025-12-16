import React, { useState, useEffect } from "react";
import { useSession, signOut } from "@site/src/lib/auth-client";
import { useHistory } from "@docusaurus/router";

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path
      d="M12.0003 12.7937L12.0003 11.2063L23.1098 11.2063C23.1362 11.9056 23.1843 12.4495 23.1843 13.1111C23.1843 15.0855 22.6514 17.7001 20.8175 19.5781C18.9836 21.4561 16.3315 22.5623 12.0003 22.5623C6.31936 22.5623 1.50024 17.9048 1.50024 12.1667C1.50024 6.42858 6.31936 1.77109 12.0003 1.77109C14.6974 1.77109 16.8978 2.89312 18.3972 4.30132L17.1523 5.48529C16.142 4.45642 14.5097 3.52834 12.0003 3.52834C7.30066 3.52834 3.32837 7.2023 3.32837 12.1667C3.32837 17.1311 7.30066 20.8051 12.0003 20.8051C15.6053 20.8051 17.8422 19.1624 18.9568 18.0055C19.6738 17.2541 20.1554 16.2758 20.4079 15.1118L12.0003 15.1118L12.0003 12.7937Z"
      fill="currentColor"
    ></path>
  </svg>
);

// Inline SVG for GitHub Icon
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.372 0 0 5.372 0 12c0 5.309 3.438 9.8 8.205 11.385.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.04-1.612-4.04-1.612-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.083-.728.083-.728 1.205.085 1.838 1.237 1.838 1.237 1.07 1.83 2.805 1.302 3.49.998.108-.775.42-1.303.762-1.603-2.665-.304-5.466-1.334-5.466-5.932 0-1.31.465-2.38 1.235-3.22-.125-.304-.535-1.524.117-3.18 0 0 1.008-.322 3.301 1.23A11.49 11.49 0 0112 5.86c1.02.002 2.046.136 3.003.402 2.29-1.554 3.297-1.23 3.297-1.23.653 1.657.243 2.876.12 3.18.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.475 5.92.43.37.817 1.102.817 2.22 0 1.605-.015 2.895-.015 3.284 0 .32.22.695.825.577C20.564 21.8 24 17.308 24 12c0-6.628-5.372-12-12-12z"
    ></path>
  </svg>
);

const AuthToggle = () => {
  const { data: session, isPending } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  // Onboarding Redirect Check
  useEffect(() => {
    const checkOnboarding = async () => {
      if (session && !isPending) {
        try {
          const res = await fetch("/api/users/me/onboarding", {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            if (!data || Object.keys(data).length === 0) {
              if (window.location.pathname !== "/onboarding") {
                history.push("/onboarding");
              }
            }
          }
        } catch (e) {
          console.error("Failed to check onboarding status", e);
        }
      }
    };
    checkOnboarding();
  }, [session, isPending, history]);

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const endpoint =
      view === "login" ? "/api/auth/sign-in/email" : "/api/auth/sign-up/email";

    const payload =
      view === "login" ? { email, password } : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

          const data = await res.json();

          if (!res.ok) {
              throw new Error(data.detail || "Authentication failed");
          }

          // Manual Cookie Fallback for Localhost Stability
          if (data.token) {
              document.cookie = `session_token=${data.token}; path=/; samesite=lax; max-age=1800`;
          }

          window.location.reload(); 
      } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    fetch("/api/auth/sign-in/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "google",
        callbackURL: window.location.href,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
      });
  };

  const handleGitHubLogin = () => {
    window.location.href = "/api/auth/sign-in/github";
  };

  if (isPending)
    return (
      <button style={{
        padding: '8px 16px',
        background: 'var(--pro-primary)',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: '500',
        fontFamily: 'Inter, system-ui, sans-serif',
        marginLeft: '15px',
      }}>
        <span style={{ opacity: 0.7 }}>Loading...</span>
      </button>
    );

  return (
    <>
      {/* NAVBAR TOGGLE BUTTON */}
      <button
        onClick={() => (session ? handleLogout() : setShowModal(true))}
        title={session ? "Sign Out" : "Sign In"}
        className={`auth-btn ${session ? 'signed-in' : 'signed-out'}`}
        style={{
          marginLeft: '15px',
          padding: '8px 16px',
          background: session ? 'transparent' : 'var(--pro-primary)',
          border: session ? '1px solid var(--pro-border)' : 'none',
          borderRadius: '6px',
          color: session ? 'var(--pro-text-body)' : '#fff',
          fontSize: '0.8rem',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {session ? "Sign Out" : "Sign In"}
      </button>

      {/* AUTH MODAL */}
      {showModal && !session && (
        <div
          className="auth-modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="auth-modal-close"
              title="Close"
            >
              ×
            </button>

            {/* Header */}
            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--pro-primary)" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className="auth-modal-title">Welcome Back</h2>
              <p className="auth-modal-subtitle">Sign in to access your account</p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <div
                onClick={() => setView("login")}
                className={`auth-tab ${view === 'login' ? 'active' : ''}`}
              >
                Sign In
              </div>
              <div
                onClick={() => setView("signup")}
                className={`auth-tab ${view === 'signup' ? 'active' : ''}`}
              >
                Register
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <div className="auth-form">
              {view === "signup" && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                    </svg>
                    Processing...
                  </>
                ) : view === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span>or continue with</span>
              <div className="auth-divider-line"></div>
            </div>

            {/* Social Buttons */}
            <div className="auth-social">
              <button type="button" onClick={handleGitHubLogin} className="auth-social-btn">
                <GitHubIcon />
                <span>Continue with GitHub</span>
              </button>
              <button type="button" onClick={handleGoogleLogin} className="auth-social-btn">
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .auth-btn.signed-in:hover {
          border-color: var(--pro-primary) !important;
          color: var(--pro-primary) !important;
        }
        .auth-btn.signed-out:hover {
          background: #2563eb !important;
        }
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .auth-modal {
          width: 100%;
          max-width: 420px;
          background: var(--pro-panel);
          border: 1px solid var(--pro-border);
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          position: relative;
          overflow: hidden;
        }
        .auth-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 50%;
          color: var(--pro-text-body);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 20;
        }
        .auth-modal-close:hover {
          background: var(--pro-border);
          color: var(--pro-text-light);
        }
        .auth-modal-header {
          text-align: center;
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid var(--pro-border);
        }
        .auth-modal-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          margin-bottom: 1rem;
        }
        .auth-modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--pro-text-light);
          font-family: Inter, system-ui, sans-serif;
          margin: 0;
        }
        .auth-modal-subtitle {
          font-size: 0.9rem;
          color: var(--pro-text-body);
          margin-top: 0.5rem;
        }
        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--pro-border);
        }
        .auth-tab {
          flex: 1;
          text-align: center;
          padding: 12px;
          cursor: pointer;
          font-family: Inter, system-ui, sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--pro-text-body);
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        .auth-tab.active {
          color: var(--pro-primary);
          border-bottom-color: var(--pro-primary);
        }
        .auth-error {
          margin: 1rem 1.5rem 0;
          padding: 12px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--pro-alert);
          font-size: 0.85rem;
        }
        .auth-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-field label {
          display: block;
          font-size: 0.85rem;
          color: var(--pro-text-body);
          font-weight: 500;
          margin-bottom: 6px;
        }
        .auth-input {
          width: 100%;
          padding: 12px 14px;
          background: var(--pro-bg);
          border: 1px solid var(--pro-border);
          border-radius: 8px;
          color: var(--pro-text-light);
          font-size: 0.9rem;
          font-family: Inter, system-ui, sans-serif;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .auth-input:focus {
          border-color: var(--pro-primary);
        }
        .auth-submit-btn {
          width: 100%;
          padding: 12px 24px;
          background: var(--pro-primary);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: Inter, system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: #2563eb;
        }
        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          margin-bottom: 1rem;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: var(--pro-border);
        }
        .auth-divider span {
          padding: 0 1rem;
          font-size: 0.8rem;
          color: var(--pro-text-body);
        }
        .auth-social {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .auth-social-btn {
          width: 100%;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--pro-border);
          border-radius: 8px;
          color: var(--pro-text-light);
          font-size: 0.9rem;
          font-weight: 500;
          font-family: Inter, system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .auth-social-btn:hover {
          border-color: var(--pro-primary);
          color: var(--pro-primary);
        }
      `}</style>
    </>
  );
};

export default AuthToggle;
