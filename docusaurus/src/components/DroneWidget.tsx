import React, { useState, useRef, useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Typing effect component for the bot
const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index.current));
      index.current++;
      if (index.current >= text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 15);

    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
};

const DroneWidget: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'drone'; text: string; isTyping?: boolean }[]>([
    { role: 'drone', text: 'Hello! I\'m your AI assistant. How can I help you today?', isTyping: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("DroneWidget Mounted. Session:", session);
  }, [session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (loading || !input.trim()) return;

    const userMsg = input;
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/drone/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          history: history
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Link Failure');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'drone', text: data.answer, isTyping: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'drone', text: 'Sorry, I couldn\'t connect to the server. Please try again.', isTyping: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drone-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="drone-chat-window"
          >
            {/* Header */}
            <div className="drone-header">
              <div className="drone-header-left">
                <div className={`drone-status-dot ${session ? 'online' : 'offline'}`} />
                <span className="drone-title">
                  {session ? 'AI Assistant' : 'Sign In Required'}
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="drone-close-btn">
                Close
              </button>
            </div>

            {/* Content Area */}
            {!session ? (
              // LOCKED STATE
              <div className="drone-locked">
                <div className="drone-lock-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pro-alert)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="drone-lock-title">Sign In Required</h3>
                  <p className="drone-lock-text">
                    Please sign in to access<br/>the AI assistant.
                  </p>
                </div>
              </div>
            ) : (
              // UNLOCKED CHAT STATE
              <>
                <div ref={scrollRef} className="drone-messages">
                  {messages.map((msg, i) => (
                    <div key={i} className={`drone-message ${msg.role}`}>
                      <div className={`drone-bubble ${msg.role}`}>
                        <div className="drone-bubble-content">
                          {msg.role === 'drone' && msg.isTyping ? (
                            <TypewriterText text={msg.text} />
                          ) : (
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="drone-message drone">
                      <div className="drone-bubble drone loading">
                        <svg className="drone-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pro-primary)" strokeWidth="2">
                          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                        </svg>
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="drone-input-area">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="drone-input"
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="drone-send-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="drone-toggle-btn"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </motion.button>

      <style>{`
        .drone-widget-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }
        .drone-chat-window {
          width: 380px;
          height: 520px;
          background: var(--pro-panel);
          border: 1px solid var(--pro-border);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .drone-header {
          padding: 1rem 1.25rem;
          background: rgba(59, 130, 246, 0.05);
          border-bottom: 1px solid var(--pro-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drone-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .drone-status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .drone-status-dot.online {
          background-color: var(--pro-success);
          box-shadow: 0 0 8px var(--pro-success);
        }
        .drone-status-dot.offline {
          background-color: var(--pro-alert);
          box-shadow: 0 0 8px var(--pro-alert);
        }
        .drone-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--pro-text-light);
        }
        .drone-close-btn {
          color: var(--pro-text-body);
          background: transparent;
          border: 1px solid var(--pro-border);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .drone-close-btn:hover {
          border-color: var(--pro-primary);
          color: var(--pro-primary);
        }
        .drone-locked {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        .drone-lock-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .drone-lock-title {
          color: var(--pro-text-light);
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .drone-lock-text {
          color: var(--pro-text-body);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .drone-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: var(--pro-bg);
        }
        .drone-message {
          display: flex;
          margin-bottom: 0.75rem;
        }
        .drone-message.user {
          justify-content: flex-end;
        }
        .drone-message.drone {
          justify-content: flex-start;
        }
        .drone-bubble {
          max-width: 85%;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .drone-bubble.user {
          background: var(--pro-primary);
          color: #ffffff;
          border-radius: 12px 12px 4px 12px;
        }
        .drone-bubble.drone {
          background: rgba(59, 130, 246, 0.1);
          color: var(--pro-text-light);
          border-radius: 12px 12px 12px 4px;
        }
        .drone-bubble.loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--pro-text-body);
        }
        .drone-input-area {
          padding: 1rem;
          border-top: 1px solid var(--pro-border);
          background: var(--pro-panel);
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .drone-input {
          flex: 1;
          background: var(--pro-bg);
          border: 1px solid var(--pro-border);
          color: var(--pro-text-light);
          font-size: 0.9rem;
          padding: 10px 14px;
          outline: none;
          border-radius: 8px;
          font-family: 'Inter', system-ui, sans-serif;
          transition: border-color 0.2s ease;
        }
        .drone-input:focus {
          border-color: var(--pro-primary);
        }
        .drone-input::placeholder {
          color: var(--pro-text-body);
        }
        .drone-send-btn {
          color: #ffffff;
          background: var(--pro-primary);
          border: none;
          padding: 10px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .drone-send-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }
        .drone-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .drone-toggle-btn {
          width: 56px;
          height: 56px;
          background: var(--pro-primary);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
          cursor: pointer;
          position: relative;
          z-index: 50;
          transition: all 0.3s ease;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .drone-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DroneWidget;
