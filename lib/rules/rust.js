export const metadata = {
  language: 'Rust',
  extensions: ['.rs'],
  keywords: ['fn ', 'let ', 'mut ', 'impl', 'pub ', 'use ', 'struct', 'enum']
};

export function getRules() {
  return [
    {
      id: 'RS-SEC-001',
      category: 'security',
      severity: 'major',
      title: 'unsafe block',
      description: 'Usage of unsafe block bypassing Rust memory safety guarantees.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bunsafe\s*\{/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure unsafe code is heavily reviewed.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets',
      description: 'Hardcoded passwords or tokens.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/(?:password|token|secret)\s*=\s*".+"/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use std::env::var for secrets.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: '.unwrap() usage',
      description: 'Using .unwrap() can panic the program if the value is None or Err.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\.unwrap\(\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use pattern matching or ? operator.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-BUG-002',
      category: 'bugs',
      severity: 'minor',
      title: '.expect() with unhelpful message',
      description: 'Prefer descriptive error messages in .expect().',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\.expect\(\s*""\s*\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Provide a meaningful panic message.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'todo!() or unimplemented!() in code',
      description: 'Leftover unimplemented macros.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\b(?:todo|unimplemented)!\(\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Implement the functionality.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: '.clone() overuse',
      description: 'Excessive cloning can impact performance.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\.clone\(\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Consider using references (&) instead of cloning.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'String::new() + push_str in loop',
      description: 'Inefficient string allocation in loop.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'RS-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'println!() debugging',
      description: 'Remove println debugging statements.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/\bprintln!\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use the log crate (e.g., info!, debug!).' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'Dead code (allow dead_code)',
      description: 'Avoid ignoring dead code warnings globally.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\//.test(line)) return;
          if (/#\[allow\(dead_code\)\]/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove unused code instead of suppressing warnings.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RS-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing documentation comments',
      description: 'Public items should be documented.',
      check: (code, lines) => {
        return [];
      }
    },
    {
      id: 'RS-STY-001',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME',
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
      id: 'RS-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines are too long.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 100) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Format with rustfmt.' });
          }
        });
        return issues;
      }
    }
  ];
}
