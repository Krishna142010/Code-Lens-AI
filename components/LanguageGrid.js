export default function LanguageGrid() {
  const languages = [
    { name: 'JavaScript', icon: '🟨' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'Python', icon: '🐍' },
    { name: 'Java', icon: '☕' },
    { name: 'C', icon: '⚙️' },
    { name: 'C++', icon: '⚙️' },
    { name: 'C#', icon: '💜' },
    { name: 'Go', icon: '🔵' },
    { name: 'Rust', icon: '🦀' },
    { name: 'Ruby', icon: '💎' },
    { name: 'PHP', icon: '🐘' },
    { name: 'Swift', icon: '🍎' },
    { name: 'Kotlin', icon: '🟣' },
    { name: 'HTML', icon: '🌐' },
    { name: 'CSS', icon: '🎨' },
    { name: 'SQL', icon: '🗃️' },
    { name: 'Shell', icon: '💻' },
    { name: 'R', icon: '📊' },
    { name: 'Dart', icon: '🎯' },
    { name: 'Lua', icon: '🌙' },
    { name: 'Perl', icon: '🐪' },
    { name: 'YAML/JSON', icon: '📄' },
  ];

  return (
    <div className="language-grid">
      {languages.map((lang) => (
        <div key={lang.name} className="language-chip">
          <span className="language-chip-icon">{lang.icon}</span>
          <span className="language-chip-name">{lang.name}</span>
        </div>
      ))}
    </div>
  );
}
