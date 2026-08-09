export const metadata = {
  language: 'R/Perl',
  extensions: ['.r', '.R', '.pl', '.pm', '.perl'],
  keywords: ['library(', '<-', 'function(', 'use strict', 'my ', 'sub ']
};

export function getRules() {
  return [
    {
      id: 'RP-SEC-001',
      category: 'security',
      severity: 'major',
      title: 'system() call (R and Perl)',
      description: 'Executing system commands can be a security vulnerability if not sanitized.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bsystem\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure command args are strictly sanitized' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'eval() / eval "string"',
      description: 'Evaluating dynamic code can execute arbitrary strings.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\beval\s*\(?/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Do not use eval. Rewrite logic' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-SEC-003',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded secrets',
      description: 'Storing API keys in plain text scripts is insecure.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:api_?key|secret|password|token)\s*(?:<-|=)\s*['"][a-zA-Z0-9_\-]{16,}['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Load from environment variables' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: '<<- global assignment (R)',
      description: 'Superassignment modifies global state implicitly, causing side-effects.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/<<-/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Return values instead or manage state explicitly' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-BUG-002',
      category: 'bugs',
      severity: 'minor',
      title: 'T/F instead of TRUE/FALSE (R)',
      description: 'T and F can be overwritten in R. TRUE/FALSE cannot.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:<-|=|,|\()\s*[TF]\s*(?:,|$|\))/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use TRUE or FALSE explicitly' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-BUG-003',
      category: 'bugs',
      severity: 'major',
      title: 'No use strict/warnings (Perl)',
      description: 'Perl scripts should always enforce strict compilation.',
      check: (code, lines) => {
        const issues = [];
        if (code.includes('my ') && !/use strict;/.test(code)) {
           issues.push({ line: 1, match: lines[0], fix: 'Add "use strict;" and "use warnings;"' });
        }
        return issues;
      }
    },
    {
      id: 'RP-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'Growing vector in loop (R)',
      description: 'Appending to a vector inside a loop copies the object repeatedly.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\b(?:for|while)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /(?:<-|=)\s*c\(/.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Preallocate vector length before loop' });
          }
          if (inLoop && /(?:^\s*}|^\s*end)/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'RP-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'cat()/print() debugging (R)',
      description: 'Leftover debugging lines.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\b(?:cat|print)\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove debug output' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'print debugging (Perl)',
      description: 'Leftover debugging lines.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\bprint\s+["']/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a logging module instead' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME',
      description: 'Unresolved tasks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve or track issue' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines too long to read comfortably.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.trim().substring(0, 40) + '...', fix: 'Wrap lines' });
          }
        });
        return issues;
      }
    },
    {
      id: 'RP-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Unnamed hardcoded constants obscure intent.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:==|!=|>|<|>=|<=|\+|-|\*|\/)\s*[0-9]{3,}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Assign numeric values to descriptive variable names' });
          }
        });
        return issues;
      }
    }
  ];
}
