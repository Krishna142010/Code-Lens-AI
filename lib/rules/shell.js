export const metadata = {
  language: 'Shell/Bash',
  extensions: ['.sh', '.bash', '.zsh'],
  keywords: ['#!/bin/bash', 'echo', 'if [', 'then', 'fi', 'done']
};

export function getRules() {
  return [
    {
      id: 'SH-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'eval usage',
      description: 'eval executes arbitrary commands and is prone to injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\beval\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid eval, use alternative structures' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'rm -rf /',
      description: 'Dangerous recursive delete commands.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/rm\s+-rf\s+(?:\/|\$)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure paths are well-defined and validated' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-SEC-003',
      category: 'security',
      severity: 'major',
      title: 'Unquoted variables in commands',
      description: 'Variables should be quoted to prevent word splitting and globbing.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          // Rough regex to find unquoted variables used as args
          if (/(?:^|\s)\$[A-Za-z0-9_]+(?:\s|$)/.test(line) && !/["']/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Wrap variable in double quotes (e.g., "$VAR")' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-SEC-004',
      category: 'security',
      severity: 'critical',
      title: 'curl | bash (piping to shell)',
      description: 'Piping web content directly into a shell is a major security risk.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:curl|wget).*\|\s*(?:bash|sh)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Download script, inspect it, then execute' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: 'Missing set -e (error exit)',
      description: 'Scripts should exit on error to prevent cascading failures.',
      check: (code, lines) => {
        const issues = [];
        if (!/set\s+(?:-[^ ]*e|-[^ ]*\s+-e|-[^ ]*\s+-.*e)/.test(code)) {
           // only flag on line 1 for simplicity if not present
           issues.push({ line: 1, match: lines[0] || '', fix: 'Add set -e near top of script' });
        }
        return issues;
      }
    },
    {
      id: 'SH-BUG-002',
      category: 'bugs',
      severity: 'info',
      title: '[ vs [[',
      description: '[[ is preferred in Bash for conditionals.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/(?:^|\s)\[\s+/.test(line) && !/\[\[/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use bash [[ ... ]] for safer condition tests' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Unquoted variable expansion',
      description: 'Expansion without quotes may cause empty string parsing errors.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\[\s*\$[a-zA-Z0-9_]+\s*(?:=|!=)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Double-quote the variable expansion' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-PERF-001',
      category: 'performance',
      severity: 'info',
      title: 'cat file | grep (useless cat)',
      description: 'Piping cat into grep is inefficient.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/cat\s+[^\s]+\s*\|\s*grep/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Pass filename directly to grep' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'echo for debugging',
      description: 'Debug prints left in script.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*#/.test(line)) return;
          if (/\becho\s+["']?(?:debug|test|here)/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove debug output' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks left in the script.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Address or track in issue tracker' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SH-BP-003',
      category: 'best-practices',
      severity: 'minor',
      title: 'Missing shebang line',
      description: 'Scripts should declare their interpreter at the top.',
      check: (code, lines) => {
        const issues = [];
        if (lines.length > 0 && !/^#!/.test(lines[0])) {
           issues.push({ line: 1, match: lines[0], fix: 'Add shebang line, e.g., #!/usr/bin/env bash' });
        }
        return issues;
      }
    },
    {
      id: 'SH-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Excessively long lines reduce readability.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.trim().substring(0, 40) + '...', fix: 'Break line into multiple lines with \\' });
          }
        });
        return issues;
      }
    }
  ];
}
