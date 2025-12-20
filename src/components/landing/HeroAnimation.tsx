import { useEffect, useState } from "react";

export default function HeroAnimation() {
  const [activeDocument, setActiveDocument] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDocument((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-animation-container">
      {/* Central Lens */}
      <div className="lens-core">
        <div className="lens-ring lens-ring-1" />
        <div className="lens-ring lens-ring-2" />
        <div className="lens-ring lens-ring-3" />
        <div className="lens-center">
          <div className="lens-scanner" />
          <svg viewBox="0 0 24 24" className="lens-icon" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Research Documents (Left) */}
      <div className="documents-stack documents-left">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`research-document ${activeDocument === i ? 'document-active' : ''}`}
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div className="document-header">
              <div className="document-dot" />
              <div className="document-title-bar" />
            </div>
            <div className="document-lines">
              <div className="document-line line-1" />
              <div className="document-line line-2" />
              <div className="document-line line-3" />
            </div>
            <div className="scan-beam" />
          </div>
        ))}
      </div>

      {/* Comparison Chart (Top Right) */}
      <div className="comparison-panel">
        <div className="comparison-header">
          <div className="comparison-icon">⚖️</div>
          <span>Trial Comparison</span>
        </div>
        <div className="comparison-bars">
          <div className="comparison-bar-row">
            <span className="bar-label">A</span>
            <div className="bar-track">
              <div className="bar-fill bar-fill-1" />
            </div>
          </div>
          <div className="comparison-bar-row">
            <span className="bar-label">B</span>
            <div className="bar-track">
              <div className="bar-fill bar-fill-2" />
            </div>
          </div>
          <div className="comparison-bar-row">
            <span className="bar-label">C</span>
            <div className="bar-track">
              <div className="bar-fill bar-fill-3" />
            </div>
          </div>
        </div>
        <div className="comparison-verdict">
          <div className="verdict-check">✓</div>
          <span>Trial A Optimal</span>
        </div>
      </div>

      {/* Regulatory AI (Bottom Right) */}
      <div className="regulatory-panel">
        <div className="regulatory-header">
          <div className="shield-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span>Regulatory AI</span>
        </div>
        <div className="regulatory-chat">
          <div className="chat-bubble chat-user">GMP compliance?</div>
          <div className="chat-bubble chat-ai">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
        <div className="compliance-badges">
          <div className="compliance-badge badge-fda">FDA</div>
          <div className="compliance-badge badge-ema">EMA</div>
          <div className="compliance-badge badge-ich">ICH</div>
        </div>
      </div>

      {/* Insights (Bottom) */}
      <div className="insights-panel">
        <div className="insights-header">
          <div className="sparkle-icon">✨</div>
          <span>Live Insights</span>
        </div>
        <div className="insights-feed">
          <div className="insight-item insight-1">
            <div className="insight-dot insight-dot-trend" />
            <span>New CAR-T breakthrough detected</span>
          </div>
          <div className="insight-item insight-2">
            <div className="insight-dot insight-dot-alert" />
            <span>FDA guideline update</span>
          </div>
          <div className="insight-item insight-3">
            <div className="insight-dot insight-dot-info" />
            <span>3 trials match criteria</span>
          </div>
        </div>
        <div className="insight-pulse-ring" />
      </div>

      {/* Connecting Lines */}
      <svg className="connection-lines" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="data-flow-line line-to-docs" d="M300,200 Q200,200 120,180" />
        <path className="data-flow-line line-to-compare" d="M300,200 Q400,150 480,100" />
        <path className="data-flow-line line-to-regulatory" d="M300,200 Q420,280 480,320" />
        <path className="data-flow-line line-to-insights" d="M300,200 Q300,300 300,360" />
        
        {/* Animated particles */}
        <circle className="data-particle particle-1" r="3" fill="hsl(var(--primary))">
          <animateMotion dur="2s" repeatCount="indefinite" path="M300,200 Q200,200 120,180" />
        </circle>
        <circle className="data-particle particle-2" r="3" fill="hsl(var(--primary))">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M300,200 Q400,150 480,100" />
        </circle>
        <circle className="data-particle particle-3" r="3" fill="hsl(var(--primary))">
          <animateMotion dur="2.2s" repeatCount="indefinite" path="M300,200 Q420,280 480,320" />
        </circle>
        <circle className="data-particle particle-4" r="3" fill="hsl(var(--primary))">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M300,200 Q300,300 300,360" />
        </circle>
      </svg>
    </div>
  );
}
