export const metadata = {
  language: 'C/C++',
  extensions: ['.c', '.h', '.cpp', '.hpp', '.cc', '.cxx'],
  keywords: ['#include', 'int main', 'printf', 'malloc', 'void', 'sizeof']
};

export function getRules() {
  return [
    {
      id: 'C-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'gets() usage',
      description: 'gets() does not check buffer length and causes buffer overflow vulnerabilities.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bgets\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use fgets() instead.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'strcpy without bounds check',
      description: 'strcpy() can cause buffer overflows. Consider strncpy().',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bstrcpy\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use strncpy() or strlcpy().' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-SEC-003',
      category: 'security',
      severity: 'major',
      title: 'sprintf without bounds',
      description: 'sprintf() can overflow buffers. Use snprintf() instead.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bsprintf\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use snprintf() instead.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-SEC-004',
      category: 'security',
      severity: 'major',
      title: 'printf format string vulnerability',
      description: 'printf without format strings can lead to format string vulnerabilities.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          // check if printf takes only one argument which is not a literal
          if (/\bprintf\s*\(\s*[a-zA-Z_]\w*\s*\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Pass "%s" as the first argument.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'malloc without NULL check',
      description: 'Memory allocation can fail. The return value of malloc must be checked.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bmalloc\s*\(/.test(line) && !/if\s*\([^)]*==\s*NULL\)/.test(code)) {
            // Very naive check
             issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure malloc return value is checked for NULL.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'malloc without corresponding free',
      description: 'Failing to free allocated memory leads to memory leaks.',
      check: (code, lines) => {
        const issues = [];
        let mallocs = 0;
        let frees = 0;
        lines.forEach(line => {
          if (/\bmalloc\s*\(/.test(line)) mallocs++;
          if (/\bfree\s*\(/.test(line)) frees++;
        });
        if (mallocs > frees) {
           issues.push({ line: 1, match: 'File wide', fix: 'Ensure all malloc calls have matching free calls.' });
        }
        return issues;
      }
    },
    {
      id: 'C-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Uninitialized variable usage',
      description: 'Local variables are not initialized by default in C.',
      check: (code, lines) => {
        return []; // placeholder
      }
    },
    {
      id: 'C-BUG-004',
      category: 'bugs',
      severity: 'minor',
      title: 'Array index out of bounds patterns',
      description: 'Accessing arrays outside bounds can cause segfaults.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'C-PERF-001',
      category: 'performance',
      severity: 'info',
      title: 'Recursive call without memoization pattern',
      description: 'Unoptimized recursion can be slow.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'C-BP-001',
      category: 'best-practices',
      severity: 'minor',
      title: 'Missing break in switch case',
      description: 'Fallthrough in switch cases is often unintentional.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'C-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'goto usage',
      description: 'goto statements lead to spaghetti code and should be avoided.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bgoto\s+\w+;/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Refactor using structured control flow.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Avoid magic numbers. Define them with #define or const.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'C-BP-004',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing const qualifier',
      description: 'Use const for variables that do not change.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'C-STY-001',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Unresolved TODO/FIXME comments.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve comment.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'C-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Very long lines',
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
    },
    {
      id: 'C-SEC-005',
      category: 'security',
      severity: 'major',
      title: 'system() call',
      description: 'system() can be vulnerable to command injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bsystem\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use exec() family functions instead.' });
          }
        });
        return issues;
      }
    }
  ];
}
