import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <div className="container">
        
        <div className="about-hero">
          <h1 className="gradient-text">About CodeLens AI</h1>
          <p>
            An advanced AI-powered static code analysis tool designed to help developers 
            find bugs, security vulnerabilities, and code quality issues instantly.
          </p>
        </div>

        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="glass-card step-card stagger-1">
              <div className="step-number">1</div>
              <h3>Paste Your Code</h3>
              <p>Simply paste your JavaScript, TypeScript, or Python code into our secure editor.</p>
            </div>
            
            <div className="glass-card step-card stagger-2">
              <div className="step-number">2</div>
              <h3>Instant Analysis</h3>
              <p>Our AI engines quickly scan your code for security, performance, and style issues.</p>
            </div>
            
            <div className="glass-card step-card stagger-3">
              <div className="step-number">3</div>
              <h3>Fix & Improve</h3>
              <p>Review the actionable feedback and apply the suggested fixes to improve your code quality.</p>
            </div>
          </div>
        </div>

        <div className="language-grid-section">
          <h2>Supported Languages</h2>
          <div className="language-grid">
            <div className="language-chip">
              <span className="language-chip-icon">🟨</span>
              <span className="language-chip-name">JavaScript</span>
            </div>
            <div className="language-chip">
              <span className="language-chip-icon">🟦</span>
              <span className="language-chip-name">TypeScript</span>
            </div>
            <div className="language-chip">
              <span className="language-chip-icon">🐍</span>
              <span className="language-chip-name">Python</span>
            </div>
            <div className="language-chip">
              <span className="language-chip-icon">⚛️</span>
              <span className="language-chip-name">React</span>
            </div>
            <div className="language-chip">
              <span className="language-chip-icon">🟢</span>
              <span className="language-chip-name">Node.js</span>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h2>Tech Stack</h2>
          <div className="tech-grid">
            <div className="glass-card text-center">
              <h3>Next.js 14</h3>
              <p className="text-muted">React Framework</p>
            </div>
            <div className="glass-card text-center">
              <h3>Vanilla CSS</h3>
              <p className="text-muted">Custom Styling</p>
            </div>
            <div className="glass-card text-center">
              <h3>AI Analyzer</h3>
              <p className="text-muted">Code Scanning</p>
            </div>
          </div>
        </div>

        <div className="text-center text-muted" style={{ padding: '40px 0' }}>
          <p>Created for Iris Hacks IV.</p>
        </div>
        
      </div>
    </div>
  );
}
