export const metadata = {
  language: 'Config (YAML/JSON)',
  extensions: ['.yaml', '.yml', '.json', '.toml'],
  keywords: ['{', ':', '- ', 'true', 'false', 'null']
};

export function getRules() {
  return [
    {
      id: 'CFG-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded passwords/secrets/tokens',
      description: 'Secrets should not be committed in configuration files.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/(?:password|secret|token|api_?key)\s*[:=]\s*["']?[a-zA-Z0-9_\-]{10,}["']?/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove and replace with environment variable references' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'Insecure URLs (http:// instead of https://)',
      description: 'Traffic should be encrypted using HTTPS.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/http:\/\//.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Switch to https://' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-SEC-003',
      category: 'security',
      severity: 'critical',
      title: 'Exposed API keys patterns',
      description: 'Common formats for tokens.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/(?:AIza[0-9A-Za-z-_]{35}|sk_[live|test]_[0-9a-zA-Z]{24})/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove leaked API key' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: 'Duplicate key patterns',
      description: 'Configuration keys redefined may be ignored or cause parsing errors.',
      check: (code, lines) => {
        const issues = [];
        const seen = new Set();
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          const match = line.match(/^\s*"?([a-zA-Z0-9_]+)"?\s*:/);
          if (match) {
             const key = match[1];
             if (seen.has(key)) {
               issues.push({ line: i + 1, match: line.trim(), fix: 'Remove duplicate key' });
             } else {
               seen.add(key);
             }
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-BUG-002',
      category: 'bugs',
      severity: 'info',
      title: 'Empty value patterns',
      description: 'Keys with missing or empty values.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/:\s*(?:""|''|null)$/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure value is intended to be empty' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'TODO/FIXME in config',
      description: 'Unresolved configurations.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Fix or remove comment' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'Debug/development mode left on',
      description: 'Production configs should not have debug enabled.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/(?:debug|dev_mode)\s*[:=]\s*true/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure debug is false for production' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-BP-003',
      category: 'best-practices',
      severity: 'major',
      title: 'Overly permissive CORS (*)',
      description: 'Allowing all origins via CORS can lead to security risks.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/(?:cors_allow_origin|Access-Control-Allow-Origin)\s*[:=]\s*["']?\*["']?/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Restrict CORS to specific domains' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Inconsistent indentation',
      description: 'YAML heavily relies on correct indentation.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#)/.test(line)) return;
          if (/^\s+/.test(line) && line.match(/^\s+/)[0].length % 2 !== 0 && !/\t/.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Use even spaces for indentation (2 or 4)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'CFG-STY-002',
      category: 'style',
      severity: 'minor',
      title: 'Trailing commas in JSON',
      description: 'JSON does not allow trailing commas.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/,(\s*)$/.test(line) && /[\}\]]\s*$/.test(lines[i+1] || '')) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove trailing comma before bracket or brace' });
          }
        });
        return issues;
      }
    }
  ];
}
