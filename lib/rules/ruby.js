export const metadata = {
  language: 'Ruby',
  extensions: ['.rb', '.rake'],
  keywords: ['def ', 'end', 'class ', 'require', 'puts', 'attr_']
};

export function getRules() {
  return [
    {
      id: 'RB-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'eval() usage',
      description: 'Using eval() is dangerous as it executes arbitrary code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\beval\s*\(/.test(line) || /\beval\s/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid eval. Find alternative implementations.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'system()/exec() with interpolation',
      description: 'Shell commands with string interpolation are vulnerable to injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\b(?:system|exec)\s*\([^)]*#\{/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Pass arguments as separate array elements.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-SEC-003',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets',
      description: 'Do not hardcode secrets.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:password|secret|api_key)\s*=\s*['"][a-zA-Z0-9-_]+['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use ENV for secrets.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'rescue without specific exception',
      description: 'A generic rescue catches StandardError, hiding potential bugs.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*rescue\s*(?:=>\s*\w+)?$/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Rescue specific exceptions.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-BUG-002',
      category: 'bugs',
      severity: 'minor',
      title: 'method_missing without respond_to_missing?',
      description: 'If you override method_missing, you should also override respond_to_missing?.',
      check: (code, lines) => {
        const issues = [];
        if (/\bdef\s+method_missing\b/.test(code) && !/\bdef\s+respond_to_missing\?\b/.test(code)) {
          issues.push({ line: 1, match: 'method_missing', fix: 'Add respond_to_missing? when overriding method_missing.' });
        }
        return issues;
      }
    },
    {
      id: 'RB-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concat in loop',
      description: 'String concatenation inside loops creates many object allocations.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\b(?:each|map|while|for)\b.*do/.test(line) || /\{.*\|.*\|/.test(line)) inLoop = true;
          if (inLoop && /\+=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use array and join, or << (String#concat).' });
          }
          if (inLoop && /^\s*end\b/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'RB-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'puts/p debugging',
      description: 'Remove debugging output in production.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/^\s*(?:puts|p)\s+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a logger.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'Global variables ($var)',
      description: 'Global variables are discouraged in Ruby.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\$[a-zA-Z_]\w*/.test(line) && !/\$[!@_&~`\d]/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Refactor to avoid global variables.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing frozen_string_literal comment',
      description: 'Ruby files should start with frozen_string_literal: true magic comment.',
      check: (code, lines) => {
        const issues = [];
        if (!/frozen_string_literal:\s*true/.test(code)) {
          issues.push({ line: 1, match: 'File', fix: 'Add frozen_string_literal: true comment.' });
        }
        return issues;
      }
    },
    {
      id: 'RB-STY-001',
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
      id: 'RB-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines shouldn\'t exceed 120 characters.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Wrap line.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RB-STY-003',
      category: 'style',
      severity: 'info',
      title: 'Trailing whitespace',
      description: 'Avoid trailing whitespace.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\s+$/.test(line) && line.trim().length > 0) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove trailing whitespace.' });
          }
        });
        return issues;
      }
    }
  ];
}
