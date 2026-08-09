export const metadata = {
  language: 'Python',
  extensions: ['.py', '.pyw', '.pyi'],
  keywords: ['def', 'import', 'from', 'class', 'self', 'elif', 'print']
};

export function getRules() {
  return [
    {
      id: 'PY-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'exec() or eval() usage',
      description: 'exec() and eval() can execute arbitrary strings as Python code, leading to severe security risks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\b(?:eval|exec)\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid using eval/exec. Consider safe alternatives like ast.literal_eval.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'pickle.loads from untrusted',
      description: 'pickle is not secure against erroneous or maliciously constructed data.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bpickle\.loads?\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use safer serialization formats like JSON.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-SEC-003',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded passwords/secrets',
      description: 'Never hardcode secrets in source code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:password|secret|api_key|token)\s*=\s*['"][a-zA-Z0-9-_]{10,}['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use environment variables or a secrets manager.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-SEC-004',
      category: 'security',
      severity: 'major',
      title: 'os.system() / subprocess with shell=True',
      description: 'Executing commands with shell=True can be vulnerable to shell injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bos\.system\s*\(|\bsubprocess\..*shell\s*=\s*True/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use subprocess without shell=True and pass arguments as a list.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Bare except clause',
      description: 'A bare except catches SystemExit and KeyboardInterrupt, making it hard to kill the program.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*except\s*:/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Catch specific exceptions or use except Exception:' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'Mutable default arguments',
      description: 'Mutable default arguments (like list or dict) retain their state between function calls.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bdef\s+\w+\s*\(.*=\s*(?:\[\]|\{\})/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use None as default and initialize inside the function.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BUG-003',
      category: 'bugs',
      severity: 'major',
      title: 'except: pass (suppressing errors)',
      description: 'Silently suppressing errors can hide critical bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*except.*:\s*pass/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Log the error or handle it properly.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation with + in loop',
      description: 'Repeated string concatenation using + in a loop is inefficient.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*(?:for|while)\b/.test(line)) inLoop = true;
          // rudimentary check
          if (inLoop && /\+=/.test(line) && typeof line === 'string') {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Append to a list and use "".join(list) outside the loop.' });
          }
          if (/^\s*[^\s]/.test(line) && !/^\s*(?:for|while)\b/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'PY-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'Using list when set would be better (for \'in\' checks)',
      description: 'Membership testing is O(N) for lists but O(1) for sets.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bif\s+.*\s+in\s+\[.*\]:/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Convert the list to a set for membership testing.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'print() debugging left in code',
      description: 'print() statements should be removed in production.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*print\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use logging module instead of print.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'import * usage',
      description: 'Wildcard imports pollute the namespace.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*from\s+\w+\s+import\s+\*/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Explicitly import only what you need.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing docstring',
      description: 'Classes and functions should have docstrings.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*(?:def|class)\s+\w+.*:/.test(line)) {
            // Simplified check, normally would look at next lines
            if (i + 1 < lines.length && !/"""|'''/.test(lines[i+1])) {
              issues.push({ line: i + 1, match: line.trim(), fix: 'Add a docstring to this function or class.' });
            }
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BP-004',
      category: 'best-practices',
      severity: 'minor',
      title: 'Global variable usage',
      description: 'Using the global keyword can lead to messy, hard-to-maintain code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*global\s+\w+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid global variables. Pass state via arguments or class attributes.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Lines > 79 chars (PEP 8)',
      description: 'PEP 8 recommends limiting all lines to a maximum of 79 characters.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 79) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Wrap line to be under 79 characters.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-STY-002',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME/HACK comments',
      description: 'Unresolved TODO/FIXME/HACK comments.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME|HACK)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve the comment.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PY-BUG-004',
      category: 'bugs',
      severity: 'minor',
      title: 'Comparison to None using == instead of \'is\'',
      description: 'Comparisons to singletons like None should always be done with is or is not.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/==\s*None|\bNone\s*==/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use "is None" instead of "== None".' });
          }
        });
        return issues;
      }
    }
  ];
}
