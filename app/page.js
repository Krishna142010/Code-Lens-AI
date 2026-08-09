import Hero from '@/components/Hero';
import CodeInput from '@/components/CodeInput';
import LanguageGrid from '@/components/LanguageGrid';

export default function Home() {
  return (
    <main>
      <div className="container">
        <Hero />
        <CodeInput />
        
        <section className="features-section">
          <h2 className="gradient-text">Why use CodeLens AI?</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <span className="feature-icon">⚡</span>
              <h3>Instant Analysis</h3>
              <p>Get results in seconds. No waiting for long CI/CD pipelines to finish.</p>
            </div>
            <div className="feature-card glass-card">
              <span className="feature-icon">🔒</span>
              <h3>Security First</h3>
              <p>Detect vulnerabilities, exposed secrets, and bad practices automatically.</p>
            </div>
            <div className="feature-card glass-card">
              <span className="feature-icon">💡</span>
              <h3>Smart Fixes</h3>
              <p>Don't just find bugs, get AI-powered suggestions on how to fix them.</p>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card glass-card">
              <span className="stat-number">20+</span>
              <span className="stat-label">Languages</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-number">0</span>
              <span className="stat-label">Config Required</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free to Use</span>
            </div>
            <div className="stat-card glass-card">
              <span className="stat-number">∞</span>
              <span className="stat-label">Lines of Code</span>
            </div>
          </div>
        </section>

        <section className="language-grid-section">
          <h2 className="gradient-text">Supported Languages</h2>
          <LanguageGrid />
        </section>
      </div>
    </main>
  );
}
