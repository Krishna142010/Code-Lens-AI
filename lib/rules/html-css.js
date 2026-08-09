export const metadata = {
  language: 'HTML/CSS',
  extensions: ['.html', '.htm', '.css', '.scss'],
  keywords: ['<!DOCTYPE', '<html', '<div', '<body', 'class=', '@media']
};

export function getRules() {
  return [
    {
      id: 'HTML-SEC-001',
      category: 'security',
      severity: 'minor',
      title: 'Inline event handlers (onclick etc.)',
      description: 'Inline event handlers violate CSP and separate concerns.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/\bon(?:click|mouseover|change|submit)\s*=/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use addEventListener in a separate script file' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'javascript: protocol in href',
      description: 'Using javascript: in href can lead to XSS.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/\bhref\s*=\s*['"]javascript:/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove javascript: protocol, handle with event listeners' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'Missing alt attribute on img',
      description: 'Images without alt attributes hurt accessibility.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<img\b(?!.*alt=)/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add a descriptive alt attribute' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'Missing lang attribute on html',
      description: 'Missing lang attribute causes issues for screen readers.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<html\b(?!.*lang=)/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add lang attribute (e.g., lang="en")' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BUG-003',
      category: 'bugs',
      severity: 'major',
      title: 'Missing <title> tag',
      description: 'Pages should have a title for SEO and accessibility.',
      check: (code, lines) => {
        const issues = [];
        if (code.includes('<head>') && !code.includes('<title>')) {
          lines.forEach((line, i) => {
             if (/<head>/i.test(line)) {
                issues.push({ line: i + 1, match: line.trim(), fix: 'Add a <title> tag inside <head>' });
             }
          });
        }
        return issues;
      }
    },
    {
      id: 'HTML-BUG-004',
      category: 'bugs',
      severity: 'minor',
      title: 'Empty href links',
      description: 'Empty href attributes can cause page reloads.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<a\b[^>]*\bhref\s*=\s*(?:""|'')/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Provide a valid URL or use a button if it is just an action' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BUG-005',
      category: 'bugs',
      severity: 'minor',
      title: 'Missing form labels',
      description: 'Inputs should have associated labels for accessibility.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<input\b(?!.*type=['"](?:hidden|submit|button)['"])(?!.*id=)/i.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure inputs have IDs and associated <label> elements' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'Using <b> instead of <strong>',
      description: '<strong> provides semantic meaning over <b>.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<b>/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Replace <b> with <strong>' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'Using <i> instead of <em>',
      description: '<em> provides semantic emphasis over <i>.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/<i>/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Replace <i> with <em>' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'Inline styles',
      description: 'Inline styles make maintenance harder and reduce reusability.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*<!--/.test(line)) return;
          if (/\bstyle\s*=\s*['"][^'"]+['"]/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Move styles to external CSS' });
          }
        });
        return issues;
      }
    },
    {
      id: 'HTML-BP-004',
      category: 'best-practices',
      severity: 'major',
      title: 'Missing viewport meta',
      description: 'Pages may not render well on mobile without the viewport meta tag.',
      check: (code, lines) => {
        const issues = [];
        if (code.includes('<head>') && !code.includes('name="viewport"')) {
           lines.forEach((line, i) => {
              if (/<head>/i.test(line)) {
                 issues.push({ line: i + 1, match: line.trim(), fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' });
              }
           });
        }
        return issues;
      }
    },
    {
      id: 'CSS-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: '!important overuse',
      description: 'Overuse of !important makes CSS highly unmaintainable.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\*/.test(line)) return;
          if (/\!important\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid !important, use CSS specificity' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CSS-PERF-001',
      category: 'performance',
      severity: 'info',
      title: '* universal selector',
      description: 'The universal selector can be slow to match.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\*/.test(line)) return;
          if (/^\s*\*\s*\{/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid relying too much on the universal selector' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CSS-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Use variables instead of hardcoded numbers for layout parameters.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*\/\*/.test(line)) return;
          if (/(?:width|height|margin|padding|font-size)\s*:\s*(?:[1-9][0-9]{2,})px/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Extract common values to CSS variables' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CSS-STY-002',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks left in CSS.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Address or track in issue tracker' });
          }
        });
        return issues;
      }
    }
  ];
}
