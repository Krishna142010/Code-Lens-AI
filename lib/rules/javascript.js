export const metadata = {
  language: 'JavaScript',
  extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'],
  keywords: ['function', 'const', 'let', 'var', 'require', 'import', '=>']
};

export function getRules() {
  return [
    {
      id: 'JS-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'eval() usage',
      description: 'Using eval() is dangerous as it can execute arbitrary code and lead to XSS or remote code execution.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\beval\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove eval() and use alternative safer approaches.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'innerHTML assignment',
      description: 'Assigning to innerHTML can lead to Cross-Site Scripting (XSS) attacks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\.innerHTML\s*=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use textContent or a secure DOM manipulation library.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-SEC-003',
      category: 'security',
      severity: 'major',
      title: 'document.write',
      description: 'document.write can inject malicious scripts and negatively impacts page load performance.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bdocument\.write\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use standard DOM manipulation methods like appendChild.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: '== instead of ===',
      description: 'Using == allows type coercion, which can lead to unexpected equality bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/(?<![=!])==(?![=])/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Replace == with ===' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BUG-002',
      category: 'bugs',
      severity: 'minor',
      title: 'var instead of let/const',
      description: 'var is function-scoped and can lead to hoisting bugs. Use let or const for block scope.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bvar\s+\w+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use let or const instead of var.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'typeof === "undefined" check using ==',
      description: 'Avoid == when checking undefined.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/typeof\s+\w+\s*==\s*['"]undefined['"]/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use === for typeof comparisons.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-PERF-001',
      category: 'performance',
      severity: 'info',
      title: 'Array inside loop with push',
      description: 'Be careful of creating arrays inside loops or heavy push operations without pre-allocation.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:for|while)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /\.push\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Consider map() or pre-allocating the array.' });
          }
          if (inLoop && /}/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'JS-PERF-002',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation in loop',
      description: 'String concatenation in a tight loop can be slow. Consider array join.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:for|while)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /\+=\s*[^;]+/.test(line) && !/\d\s*;/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use an array and .join("") if the loop is large.' });
          }
          if (inLoop && /}/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'JS-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'console.log left in code',
      description: 'console.log statements should be removed in production.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bconsole\.log\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove or replace with a proper logger.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'alert() usage',
      description: 'alert() blocks the main thread and is a poor user experience.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\balert\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a custom modal or notification instead.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'Missing error handling in async',
      description: 'Async functions should use try/catch blocks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bawait\s+/.test(line) && !/catch/.test(code)) {
             // simplified check
             issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure await is wrapped in try/catch.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BP-004',
      category: 'best-practices',
      severity: 'critical',
      title: 'Hardcoded API keys/secrets',
      description: 'Never hardcode secrets in source code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/(?:api_?key|secret|password|token)\s*[:=]\s*['"][a-zA-Z0-9-_]{10,}['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Move secrets to environment variables.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Avoid magic numbers in code. Define them as constants.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\s[=<>]\s*\d{2,}/.test(line) && !/\bconst\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Extract magic number to a named constant.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-STY-002',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Unresolved TODO or FIXME comments.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve the TODO/FIXME.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-STY-003',
      category: 'style',
      severity: 'info',
      title: 'Very long lines > 120 chars',
      description: 'Lines shouldn\'t exceed 120 characters for readability.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Break line into multiple lines.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-SEC-004',
      category: 'security',
      severity: 'major',
      title: 'new Function() constructor',
      description: 'new Function() behaves like eval() and should be avoided.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bnew\s+Function\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use regular functions or closures instead.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JS-BUG-004',
      category: 'bugs',
      severity: 'minor',
      title: 'Assignment in conditional',
      description: 'Unexpected assignment in if-statement.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:if|while)\s*\([^=]*=(?!=)[^)]*\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure == or === is used for comparison.' });
          }
        });
        return issues;
      }
    }
  ];
}
