export default function StatsBar({ totalIssues, passRate, criticalCount, linesAnalyzed }) {
  return (
    <div className="stats-bar">
      <div className="glass-card stats-bar-card">
        <span className="stats-bar-icon">🐛</span>
        <div className="stats-bar-number">{totalIssues}</div>
        <div className="stats-bar-label">Total Issues</div>
      </div>
      
      <div className="glass-card stats-bar-card">
        <span className="stats-bar-icon">✅</span>
        <div className="stats-bar-number">{passRate}%</div>
        <div className="stats-bar-label">Pass Rate</div>
      </div>
      
      <div className="glass-card stats-bar-card">
        <span className="stats-bar-icon">🔴</span>
        <div className="stats-bar-number">{criticalCount}</div>
        <div className="stats-bar-label">Critical</div>
      </div>
      
      <div className="glass-card stats-bar-card">
        <span className="stats-bar-icon">📝</span>
        <div className="stats-bar-number">{linesAnalyzed}</div>
        <div className="stats-bar-label">Lines Analyzed</div>
      </div>
    </div>
  );
}
