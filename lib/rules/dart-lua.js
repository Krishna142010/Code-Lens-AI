export const metadata = {
  language: 'Dart/Lua',
  extensions: ['.dart', '.lua'],
  keywords: ['void main', 'Widget', 'function', 'local', 'require']
};

export function getRules() {
  return [
    {
      id: 'DL-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets',
      description: 'Hardcoded credentials can be easily extracted.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/(?:api_?key|secret|password|token)\s*=\s*['"][a-zA-Z0-9_\-]{16,}['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use secure environment variables' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Force unwrap ! (Dart)',
      description: 'Force unwrapping nullables can lead to runtime exceptions.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/[a-zA-Z0-9_]!\s*(?:\.|\)|;)/.test(line) && !/!=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use safe access (?.) or null-aware operators (??)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BUG-002',
      category: 'bugs',
      severity: 'info',
      title: 'print() in production',
      description: 'Print statements should be removed or replaced with robust logging.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/\bprint\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a logger or remove debug prints' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Global variable without local (Lua)',
      description: 'Omitting local makes variables global, leading to conflicts.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          // Simple heuristic for lua globals assignments without local
          if (/^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/.test(line) && !/\blocal\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use local keyword' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation in loop (both)',
      description: 'Concatenating strings inside a loop is inefficient.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/\b(?:for|while)\s*\(?/.test(line)) inLoop = true;
          if (inLoop && /(?:\+=|\.\.)/.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Use string builders or table.concat' });
          }
          if (inLoop && /(?:^\s*}|^\s*end)/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'DL-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'Lua table.insert vs #',
      description: 'Using table.insert is slightly slower than t[#t+1] in Lua.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*--/.test(line)) return;
          if (/\btable\.insert\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use t[#t+1] = v if order doesn\'t matter' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve or track' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'Empty function body',
      description: 'Functions with no code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/(?:\{\s*\}|\bfunction[^{]*\n\s*end)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove or implement' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'Mutable global state',
      description: 'Global state can lead to tricky bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/\b(?:var|late)\s+[a-zA-Z_]+\s*=/.test(line) && !/^\s+/.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Encapsulate in classes or make constants' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Unexplained numbers.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|--|\/\*|\*)/.test(line)) return;
          if (/(?:==|!=|>|<|>=|<=|\+|-|\*|\/)\s*[0-9]{3,}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use named constants' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines too wide to read.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.trim().substring(0, 40) + '...', fix: 'Break into multiple lines' });
          }
        });
        return issues;
      }
    },
    {
      id: 'DL-STY-003',
      category: 'style',
      severity: 'info',
      title: 'Trailing whitespace',
      description: 'Invisible spaces at end of lines.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/[ \t]+$/.test(line)) {
            issues.push({ line: i + 1, match: line.trim() + '<spaces>', fix: 'Remove trailing whitespace' });
          }
        });
        return issues;
      }
    }
  ];
}
