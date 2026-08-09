export const metadata = {
  language: 'C#',
  extensions: ['.cs'],
  keywords: ['using', 'namespace', 'class', 'void', 'public', 'private']
};

export function getRules() {
  return [
    {
      id: 'CS-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'SQL string concatenation',
      description: 'Concatenating SQL strings can lead to SQL injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/SELECT|UPDATE|INSERT|DELETE/i.test(line) && /\+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use parameterized queries.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded connection strings',
      description: 'Connection strings should not be hardcoded in source files.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/(?:Server|Data Source)=.*(?:User Id|Password)=/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Move connection strings to appsettings.json or environment variables.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Empty catch block',
      description: 'Empty catch blocks silently swallow exceptions.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/catch\s*\(.*\)\s*\{\s*\}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Log the exception or handle it properly.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'async void method',
      description: 'async void should only be used for event handlers. Use async Task instead.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\basync\s+void\s+\w+/.test(line) && !/EventHandler/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Change return type to async Task.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Missing Dispose/using',
      description: 'IDisposable objects should be disposed, preferably via using statements.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'CS-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concat in loop (use StringBuilder)',
      description: 'String concatenation inside loops is inefficient. Use StringBuilder.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:for|while|foreach)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /\+=|\+/.test(line) && /\bstring\b/.test(code)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use StringBuilder.' });
          }
          if (inLoop && /}/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'CS-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'LINQ in tight loop',
      description: 'Heavy LINQ operations in loops can cause performance issues.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'CS-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'Console.WriteLine debugging',
      description: 'Console.WriteLine should be avoided in production. Use a logger.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bConsole\.WriteLine\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use ILogger.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'Public fields',
      description: 'Use properties instead of public fields.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/^\s*public\s+(?!const|readonly|class|struct|enum|record)\w+\s+\w+\s*;/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Convert public field to property.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME',
      description: 'Unresolved TODO/FIXME comments.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve the comment.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CS-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Avoid magic numbers in code.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'CS-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines are too long.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Break line.' });
          }
        });
        return issues;
      }
    }
  ];
}
