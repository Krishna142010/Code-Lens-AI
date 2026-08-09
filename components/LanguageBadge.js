export default function LanguageBadge({ language, icon, color }) {
  return (
    <div 
      className="language-badge" 
      style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '100px',
        background: 'var(--surface)',
        border: '1px solid',
        borderColor: color || 'var(--border)',
        fontSize: '0.85rem'
      }}
    >
      <span className="language-badge-icon">{icon}</span>
      <span>{language}</span>
    </div>
  );
}
