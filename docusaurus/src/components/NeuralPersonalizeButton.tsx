import React, { useState } from 'react';
import { useSession } from '../lib/auth-client';

interface NeuralPersonalizeButtonProps {
  contentSelector?: string;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 style="color: var(--pro-accent); font-size: 1.2rem; margin: 1.5rem 0 0.75rem 0; font-weight: 600;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="color: var(--pro-primary); font-size: 1.4rem; margin: 1.5rem 0 0.75rem 0; font-weight: 700;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="color: var(--pro-text-light); font-size: 1.6rem; margin: 1.5rem 0 0.75rem 0; font-weight: 700;">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--pro-text-light); font-weight: 600;">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em style="color: var(--pro-text-body);">$1</em>');

  // Code blocks
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(59,130,246,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--ifm-font-family-monospace); color: var(--pro-primary); font-size: 0.9em;">$1</code>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p style="margin: 1rem 0; line-height: 1.75;">');
  html = html.replace(/\n/g, '<br/>');

  // Wrap in paragraph
  html = '<p style="margin: 1rem 0; line-height: 1.75;">' + html + '</p>';

  return html;
}

export default function NeuralPersonalizeButton({ contentSelector = '.markdown' }: NeuralPersonalizeButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [personalized, setPersonalized] = useState(false);

  const handlePersonalize = async () => {
    if (!session) {
      alert("Please sign in to personalize content.");
      return;
    }

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) {
        console.error("Content not found");
        return;
    }

    const content = contentElement.textContent || "";
    if (!content) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/personalize-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            lesson_url: window.location.pathname  // Send URL for deterministic UUID generation
        }),
        credentials: 'include'
      });

      if (res.ok) {
          const data = await res.json();
          const renderedContent = markdownToHtml(data.output);

          const personalizedHtml = `
            <div class="personalized-content-card">
                <div class="personalized-header">
                  <div class="personalized-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pro-primary)" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="personalized-title">Personalized for Your Level</h3>
                    <p class="personalized-subtitle">AI-adapted content based on your profile</p>
                  </div>
                </div>
                <div class="personalized-body">
                    ${renderedContent}
                </div>
            </div>
            <style>
              .personalized-content-card {
                background: var(--pro-panel);
                border: 1px solid var(--pro-border);
                border-radius: 12px;
                padding: 1.5rem;
                margin: 2rem 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
              .personalized-header {
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid var(--pro-border);
                padding-bottom: 12px;
                margin-bottom: 16px;
              }
              .personalized-icon {
                width: 40px;
                height: 40px;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .personalized-title {
                color: var(--pro-text-light);
                font-family: Inter, system-ui, sans-serif;
                font-size: 1rem;
                margin: 0;
                font-weight: 600;
              }
              .personalized-subtitle {
                color: var(--pro-text-body);
                font-size: 0.8rem;
                margin: 0;
              }
              .personalized-body {
                color: var(--pro-text-body);
                line-height: 1.75;
                font-size: 1rem;
              }
            </style>
          `;

          contentElement.insertAdjacentHTML('afterbegin', personalizedHtml);
          setPersonalized(true);
      }
    } catch (e) {
        console.error(e);
        alert("Failed to personalize content. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (personalized) {
    return (
      <div className="personalize-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pro-success)" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Content personalized for your level</span>
        <style>{`
          .personalize-success {
            margin: 1.5rem 0;
            padding: 1rem;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.25);
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--pro-success);
            font-family: Inter, system-ui, sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="personalize-container">
      <button
        onClick={handlePersonalize}
        disabled={loading}
        className={`personalize-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <svg className="personalize-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
            <span>Personalizing...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Personalize Content</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
      <style>{`
        .personalize-container {
          margin: 2rem 0;
        }
        .personalize-btn {
          width: 100%;
          padding: 14px 24px;
          font-size: 0.95rem;
          background: var(--pro-primary);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 600;
          font-family: Inter, system-ui, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .personalize-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        .personalize-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .personalize-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
