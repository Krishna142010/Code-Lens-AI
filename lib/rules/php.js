export const metadata = {
  language: 'PHP',
  extensions: ['.php', '.phtml'],
  keywords: ['<?php', 'function', 'echo', '$', 'class', 'namespace']
};

export function getRules() {
  return [
    {
      id: 'PHP-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'eval() usage',
      description: 'Using eval() is extremely dangerous as it can execute arbitrary PHP code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\beval\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove eval() and use safer alternatives' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'SQL injection (mysql_query with variables)',
      description: 'Directly concatenating variables into SQL queries can lead to SQL injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/mysql(?:i)?_query\s*\(\s*.*\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*.*\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use prepared statements with PDO or MySQLi' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-SEC-003',
      category: 'security',
      severity: 'critical',
      title: 'echo $_GET/$_POST (XSS)',
      description: 'Directly echoing user input can lead to Cross-Site Scripting (XSS).',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\becho\s+.*\$_(?:GET|POST|REQUEST)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use htmlspecialchars() or equivalent escaping' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-SEC-004',
      category: 'security',
      severity: 'major',
      title: 'file_get_contents with user input',
      description: 'Using user input in file_get_contents can lead to local file inclusion (LFI).',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\bfile_get_contents\s*\(\s*.*\$_(?:GET|POST|REQUEST)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Validate and sanitize file paths' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-SEC-005',
      category: 'security',
      severity: 'major',
      title: 'extract() from user input',
      description: 'Using extract() on untrusted data like $_GET can overwrite local variables.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\bextract\s*\(\s*\$_(?:GET|POST|REQUEST|COOKIE)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Do not extract user input variables, access them explicitly' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'mysql_ deprecated functions',
      description: 'The mysql_* functions are deprecated and removed in PHP 7.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\bmysql_(?:connect|query|fetch_assoc|error)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Upgrade to PDO or MySQLi' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'Empty catch block',
      description: 'Empty catch blocks silently swallow exceptions.',
      check: (code, lines) => {
        const issues = [];
        let inCatch = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\bcatch\s*\([^)]+\)\s*{\s*$/.test(line)) inCatch = true;
          else if (inCatch && /^\s*}\s*$/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Log the exception or handle it appropriately' });
            inCatch = false;
          } else if (inCatch && line.trim().length > 0) {
            inCatch = false;
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concat in loop',
      description: 'Extensive string concatenation in loops can be inefficient.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\b(?:for|while|foreach)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /\.\=/.test(line)) {
             issues.push({ line: i + 1, match: line.trim(), fix: 'Consider building an array and imploding it' });
          }
          if (inLoop && /^\s*}\s*$/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'PHP-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'var_dump/print_r debugging',
      description: 'Debugging output left in the code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\b(?:var_dump|print_r)\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Remove or replace with proper logging' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'error_reporting(0)',
      description: 'Suppressing all errors makes debugging extremely difficult.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|#|\*)/.test(line)) return;
          if (/\berror_reporting\s*\(\s*0\s*\)/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Log errors instead of ignoring them completely' });
          }
        });
        return issues;
      }
    },
    {
      id: 'PHP-STY-001',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks left in the codebase.',
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
      id: 'PHP-STY-002',
      category: 'style',
      severity: 'info',
      title: 'Long lines',
      description: 'Lines exceeding 120 characters are hard to read.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.trim().substring(0, 40) + '...', fix: 'Break line into multiple lines' });
          }
        });
        return issues;
      }
    }
  ];
}
