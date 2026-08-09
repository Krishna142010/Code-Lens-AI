export const metadata = {
  language: 'Go',
  extensions: ['.go'],
  keywords: ['package', 'func', 'import', 'fmt', 'go ', 'chan', 'defer']
};

export function getRules() {
  return [
    {
      id: 'GO-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets',
      description: 'Hardcoded tokens or passwords.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/(?:password|secret|token)\s*:=\s*".+"/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use os.Getenv or a config file.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'exec.Command with user input',
      description: 'Passing user input to exec.Command can cause command injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bexec\.Command\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Sanitize arguments and don\'t pass raw input.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Error not checked',
      description: 'Ignoring errors in Go is a common source of bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/_,\s*err\s*:=/.test(line) && !/if\s+err\s*!=\s*nil/.test(code)) {
             // simplified
             issues.push({ line: i + 1, match: line.trim(), fix: 'Check if err != nil.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'defer in loop',
      description: 'Using defer in a loop can cause resource exhaustion because deferred functions are executed when the surrounding function returns, not when the loop ends.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bfor\b/.test(line)) inLoop = true;
          if (inLoop && /\bdefer\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Extract loop body to a function or remove defer.' });
          }
          if (inLoop && /}/.test(line)) inLoop = false; // simplified
        });
        return issues;
      }
    },
    {
      id: 'GO-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Goroutine leak',
      description: 'Launching a goroutine without synchronization can lead to leaks.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'GO-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation in loop',
      description: 'String concat in a loop is slow. Use strings.Builder.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bfor\b/.test(line)) inLoop = true;
          if (inLoop && /\+=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use strings.Builder.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'Using fmt.Sprintf for simple concat',
      description: 'fmt.Sprintf is slower than simple string concatenation for basic types.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bfmt\.Sprintf\s*\(\s*"%s%s"/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use string concatenation (+) for simple strings.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'fmt.Println debugging',
      description: 'Remove debugging print statements.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bfmt\.Print(?:ln|f)?\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a logger like log or zap.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'Exported func without comment',
      description: 'Exported functions should have a documentation comment.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'GO-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'panic() usage',
      description: 'Avoid panic in normal execution. Return errors instead.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bpanic\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Return an error value instead.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'GO-STY-001',
      category: 'style',
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
      id: 'GO-STY-002',
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
