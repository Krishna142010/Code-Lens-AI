'use client';

import { useState } from 'react';

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyFix = async () => {
    try {
      await navigator.clipboard.writeText(issue.fix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = issue.fix;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const severityLabels = {
    critical: '🔴 Critical',
    major: '🟠 Major',
    minor: '🟡 Minor',
    info: '🔵 Info',
  };

  const categoryIcons = {
    security: '🔒',
    bugs: '🐛',
    performance: '⚡',
    'best-practices': '📏',
    style: '🎨',
  };

  return (
    <div className={`issue-card severity-${issue.severity} ${expanded ? 'expanded' : ''}`}>
      <div className="issue-card-header" onClick={() => setExpanded(!expanded)}>
        <span className="issue-severity-badge">
          {severityLabels[issue.severity] || issue.severity}
        </span>
        <span className="issue-title">{issue.title}</span>
        {issue.filename && (
          <span className="issue-category-badge" style={{ background: 'rgba(124,92,252,0.1)', color: 'var(--accent-light)' }}>
            {issue.filename}
          </span>
        )}
        <span className="issue-line">Line {issue.line}</span>
        <span className="issue-category-badge">
          {categoryIcons[issue.category] || ''} {issue.category}
        </span>
        <span className="issue-expand-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      <div className="issue-card-body">
        <div className="issue-card-body-inner">
          {/* What is the bug */}
          <div className="issue-description">
            <strong>What is wrong:</strong> {issue.description}
          </div>

          {/* The buggy code */}
          <div className="issue-code-block">
            <div className="issue-code-label bad">
              ❌ Problematic Code (Line {issue.line})
            </div>
            <pre className="issue-code-content">{issue.match}</pre>
          </div>

          {/* The fix */}
          <div className="issue-code-block" style={{ borderLeft: '3px solid var(--success)' }}>
            <div className="issue-code-label good" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>✅ How to Fix</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyFix(); }}
                style={{
                  background: copied ? 'rgba(16,185,129,0.2)' : 'var(--surface)',
                  color: copied ? 'var(--success)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✅ Copied!' : '📋 Copy Fix'}
              </button>
            </div>
            <pre className="issue-code-content" style={{ color: 'var(--success)' }}>{issue.fix}</pre>
          </div>

          {/* Rule ID */}
          <div className="issue-rule-id">
            Rule: {issue.id}
          </div>
        </div>
      </div>
    </div>
  );
}
