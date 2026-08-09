export const metadata = {
  language: 'Swift/Kotlin',
  extensions: ['.swift', '.kt', '.kts'],
  keywords: ['func ', 'fun ', 'var ', 'val ', 'let ', 'class ', 'import ']
};

export function getRules() {
  return [
    {
      id: 'SK-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets/API keys',
      description: 'Hardcoded credentials can be easily extracted from binaries.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/(?:api_?key|secret|password|token)\s*=\s*['"][a-zA-Z0-9_\-]{16,}['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use secure environment variables or keychain/keystore' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Force unwrap ! (Swift)',
      description: 'Force unwrapping optionals can lead to runtime crashes if the value is nil.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/[a-zA-Z0-9_]!\s*(?:\.|\)|$)/.test(line) && !/!=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use optional binding (if let / guard let) or default value' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'Force cast as! (Swift)',
      description: 'Force casting can lead to runtime crashes if the cast fails.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/\bas!\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use conditional cast (as?)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BUG-003',
      category: 'bugs',
      severity: 'major',
      title: '!! operator (Kotlin null assertion)',
      description: 'The !! operator will throw NullPointerException if the value is null.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/[a-zA-Z0-9_]!!/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use safe call (?) or Elvis operator (?:)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BUG-004',
      category: 'bugs',
      severity: 'minor',
      title: 'Implicitly unwrapped optional (Swift)',
      description: 'Implicitly unwrapped optionals can be dangerous if accessed before initialization.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/(?:var|let)\s+[a-zA-Z0-9_]+\s*:\s*[A-Z][a-zA-Z0-9_]*!/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use regular optional (?) if possible' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation in loop',
      description: 'Concatenating strings inside a loop can cause excessive memory allocations.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/\b(?:for|while)\s*\(?/.test(line)) inLoop = true;
          if (inLoop && /\+=/.test(line) && /String/.test(code)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use StringBuilder (Kotlin) or array join (Swift)' });
          }
          if (inLoop && /^\s*}\s*$/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'SK-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'print()/println() debugging',
      description: 'Standard output prints should be removed in production apps.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/\b(?:print|println)\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a robust logging framework instead' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks left in the codebase.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve or track in an issue tracker' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'Mutable global variables',
      description: 'Global state can lead to unpredictable behavior and concurrency bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/^\s*var\s+[a-zA-Z0-9_]+\s*(:|=)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Encapsulate state or use constants (val / let)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Hardcoded numbers obscure meaning.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/(?:==|!=|>|<|>=|<=|\+|-|\*|\/)\s*[0-9]{2,}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Extract to named constants' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Excessively long lines reduce readability.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.trim().substring(0, 40) + '...', fix: 'Break line into multiple lines' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SK-STY-003',
      category: 'style',
      severity: 'info',
      title: 'Empty function body',
      description: 'Empty functions often indicate unfinished code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*|\*)/.test(line)) return;
          if (/\b(?:func|fun)\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*(?:->\s*[A-Za-z0-9_]+\s*)?\{\s*\}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove if unused, or implement' });
          }
        });
        return issues;
      }
    }
  ];
}
