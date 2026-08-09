'use client';

import { useState } from 'react';

export default function IssueCard({ issue }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`issue-card severity-${issue.severity} ${expanded ? 'expanded' : ''}`}>
      <div className="issue-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="issue-severity-badge">{issue.severity}</div>
        <div className="issue-title">{issue.title}</div>
        <div className="issue-line">Line {issue.line}</div>
        <div className="issue-category-badge">{issue.category}</div>
        <div className="issue-expand-icon">▼</div>
      </div>
      
      <div className="issue-card-body">
        <div className="issue-card-body-inner">
          <p className="issue-description">{issue.description}</p>
          
          {issue.match && (
            <div className="issue-code-block">
              <div className="issue-code-label bad">
                <span>❌ Found</span>
              </div>
              <div className="issue-code-content">{issue.match}</div>
            </div>
          )}
          
          {issue.fix && (
            <div className="issue-code-block">
              <div className="issue-code-label good">
                <span>✅ Fix</span>
              </div>
              <div className="issue-code-content">{issue.fix}</div>
            </div>
          )}
          
          {issue.id && <div className="issue-rule-id">Rule ID: {issue.id}</div>}
        </div>
      </div>
    </div>
  );
}
