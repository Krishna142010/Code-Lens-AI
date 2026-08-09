'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScoreGauge from '@/components/ScoreGauge';
import CategoryCard from '@/components/CategoryCard';
import IssueCard from '@/components/IssueCard';
import StatsBar from '@/components/StatsBar';
import LanguageBadge from '@/components/LanguageBadge';
import { LANGUAGES } from '@/lib/languages';

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const storedResults = sessionStorage.getItem('codelens_results');
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch (err) {
        console.error('Failed to parse results:', err);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h2>No Analysis Found</h2>
          <p>Submit some code for analysis to see results here.</p>
          <Link href="/" className="btn btn-primary">Analyze Code</Link>
        </div>
      </div>
    );
  }

  // Extract data from our analyzer's response shape
  const { language, scores, issues, linesAnalyzed } = results;
  const { overall, grade, categories, totalIssues, passRate } = scores;

  // Get language metadata
  const langMeta = language === 'multi'
    ? { name: `${results.fileResults?.length || 0} Files`, icon: '\uD83D\uDCC1', color: '#7c5cfc' }
    : (LANGUAGES[language] || { name: language, icon: '\uD83D\uDCC4', color: '#888' });

  // Count critical issues
  const criticalCount = issues.filter(i => i.severity === 'critical').length;

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    return matchesSeverity && matchesCategory;
  });

  return (
    <div className="container">

      {/* Score Section */}
      <div className="score-section">
        <ScoreGauge score={overall} grade={grade} />
        <LanguageBadge language={langMeta.name} icon={langMeta.icon} color={langMeta.color} />
      </div>

      {/* Stats Bar */}
      <StatsBar
        totalIssues={totalIssues}
        passRate={passRate}
        criticalCount={criticalCount}
        linesAnalyzed={linesAnalyzed || 0}
      />

      {/* Category Breakdown */}
      <div className="categories-section">
        <h2>Category Breakdown</h2>
        <div className="categories-grid">
          {Object.entries(categories).map(([cat, data], index) => (
            <CategoryCard
              key={cat}
              category={cat}
              score={data.score}
              issueCount={data.issues ? data.issues.length : 0}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Issues Section */}
      <div className="issues-section">
        <div className="issues-header">
          <h2>Detailed Findings ({filteredIssues.length})</h2>

          <div className="issues-filters">
            {['all', 'critical', 'major', 'minor', 'info'].map(sev => (
              <button
                key={sev}
                className={`filter-btn ${severityFilter === sev ? 'active' : ''}`}
                onClick={() => setSeverityFilter(sev)}
              >
                {sev === 'all' ? 'All Severities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="issues-filters" style={{ marginBottom: '16px' }}>
          {['all', 'security', 'bugs', 'performance', 'best-practices', 'style'].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {filteredIssues.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 24px' }}>
            <div className="empty-state-icon">✅</div>
            <h2>{totalIssues === 0 ? 'No Issues Found!' : 'No Matching Issues'}</h2>
            <p>{totalIssues === 0 ? 'Your code looks great!' : 'Try adjusting the filters above.'}</p>
          </div>
        ) : (
          <div className="issues-list">
            {filteredIssues.map((issue, index) => (
              <IssueCard key={`${issue.id}-${issue.line}-${index}`} issue={issue} />
            ))}
          </div>
        )}
      </div>

      {/* Back button */}
      <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
        <Link href="/" className="btn btn-secondary">← Analyze More Code</Link>
      </div>
    </div>
  );
}
