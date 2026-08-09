export const LANGUAGES = {
  javascript: { name: 'JavaScript', icon: '🟨', color: '#f7df1e', extensions: ['.js', '.jsx', '.mjs', '.cjs'], aliases: ['js', 'node'] },
  typescript: { name: 'TypeScript', icon: '🔷', color: '#3178c6', extensions: ['.ts', '.tsx'], aliases: ['ts'] },
  python: { name: 'Python', icon: '🐍', color: '#3776ab', extensions: ['.py', '.pyw', '.pyi'], aliases: ['py', 'python3'] },
  java: { name: 'Java', icon: '☕', color: '#b07219', extensions: ['.java', '.class', '.jar'], aliases: ['java'] },
  c: { name: 'C', icon: '🔵', color: '#555555', extensions: ['.c', '.h'], aliases: ['c'] },
  cpp: { name: 'C++', icon: '🟦', color: '#f34b7d', extensions: ['.cpp', '.cxx', '.cc', '.hpp', '.hxx', '.hh'], aliases: ['cpp', 'c++'] },
  csharp: { name: 'C#', icon: '🟣', color: '#178600', extensions: ['.cs', '.csx'], aliases: ['csharp', 'c#'] },
  go: { name: 'Go', icon: '🐹', color: '#00ADD8', extensions: ['.go'], aliases: ['go', 'golang'] },
  rust: { name: 'Rust', icon: '🦀', color: '#dea584', extensions: ['.rs'], aliases: ['rust'] },
  ruby: { name: 'Ruby', icon: '♦️', color: '#701516', extensions: ['.rb', '.ru'], aliases: ['ruby'] },
  php: { name: 'PHP', icon: '🐘', color: '#4F5D95', extensions: ['.php', '.phtml', '.php3', '.php4', '.php5', '.php7', '.phps'], aliases: ['php'] },
  swift: { name: 'Swift', icon: '🦅', color: '#F05138', extensions: ['.swift'], aliases: ['swift'] },
  kotlin: { name: 'Kotlin', icon: '🟪', color: '#A97BFF', extensions: ['.kt', '.kts'], aliases: ['kotlin'] },
  html: { name: 'HTML', icon: '🌐', color: '#e34c26', extensions: ['.html', '.htm'], aliases: ['html'] },
  css: { name: 'CSS', icon: '🎨', color: '#563d7c', extensions: ['.css'], aliases: ['css'] },
  sql: { name: 'SQL', icon: '🛢️', color: '#e38c00', extensions: ['.sql'], aliases: ['sql'] },
  shell: { name: 'Shell', icon: '🐚', color: '#89e051', extensions: ['.sh', '.bash', '.zsh', '.fish'], aliases: ['shell', 'bash', 'zsh', 'sh'] },
  r: { name: 'R', icon: '📉', color: '#198CE7', extensions: ['.r', '.R'], aliases: ['r'] },
  dart: { name: 'Dart', icon: '🎯', color: '#00B4AB', extensions: ['.dart'], aliases: ['dart'] },
  lua: { name: 'Lua', icon: '🌙', color: '#000080', extensions: ['.lua'], aliases: ['lua'] },
  perl: { name: 'Perl', icon: '🐪', color: '#0298c3', extensions: ['.pl', '.pm', '.t'], aliases: ['perl'] },
  yaml: { name: 'YAML', icon: '📝', color: '#cb171e', extensions: ['.yml', '.yaml'], aliases: ['yaml', 'yml'] },
  json: { name: 'JSON', icon: '📋', color: '#292929', extensions: ['.json'], aliases: ['json'] },
};

export function getLanguageById(id) {
  return LANGUAGES[id] || null;
}

export function getLanguageByExtension(ext) {
  if (!ext.startsWith('.')) ext = '.' + ext;
  for (const [id, lang] of Object.entries(LANGUAGES)) {
    if (lang.extensions.includes(ext.toLowerCase())) {
      return LANGUAGES[id];
    }
  }
  return null;
}

export function getAllLanguages() {
  return LANGUAGES;
}
