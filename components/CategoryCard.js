export default function CategoryCard({ category, score, issueCount, index }) {
  const icons = {
    'security': '🔒',
    'bugs': '🐛',
    'performance': '⚡',
    'best-practices': '📏',
    'style': '🎨'
  };

  const icon = icons[category] || '📦';
  const staggerClass = `stagger-${Math.min(index + 1, 5)}`;
  
  let scoreColor = 'var(--critical)';
  if (score >= 90) scoreColor = 'var(--success)';
  else if (score >= 75) scoreColor = '#34d399';
  else if (score >= 60) scoreColor = 'var(--warning)';
  else if (score >= 40) scoreColor = 'var(--error)';

  return (
    <div className={`glass-card category-card ${staggerClass}`}>
      <span className="category-icon">{icon}</span>
      <div className="category-name">{category.replace('-', ' ')}</div>
      <div className="category-score">{score}%</div>
      <div className="category-bar-track">
        <div 
          className="category-bar-fill" 
          style={{ width: `${score}%`, backgroundColor: scoreColor }}
        ></div>
      </div>
      <div className="category-issues">{issueCount} {issueCount === 1 ? 'issue' : 'issues'}</div>
    </div>
  );
}
