export const metadata = {
  language: 'SQL',
  extensions: ['.sql'],
  keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE']
};

export function getRules() {
  return [
    {
      id: 'SQL-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'String concatenation in queries',
      description: 'Building SQL strings with variables inside the code (or scripts) often leads to injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/['"]\s*(?:\+|||&)\s*[a-zA-Z0-9_]+\s*(?:\+|||&)\s*['"]/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use parameterized queries' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-SEC-002',
      category: 'security',
      severity: 'major',
      title: 'DROP TABLE without IF EXISTS',
      description: 'Dropping a table that doesn\'t exist will cause an error.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/DROP\s+TABLE\s+(?!IF\s+EXISTS)/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add IF EXISTS' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-SEC-003',
      category: 'security',
      severity: 'major',
      title: 'GRANT ALL PRIVILEGES',
      description: 'Granting all privileges is rarely needed and violates least privilege.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/GRANT\s+ALL\s+PRIVILEGES\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Grant only necessary permissions' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-BUG-001',
      category: 'bugs',
      severity: 'minor',
      title: 'SELECT * usage',
      description: 'SELECT * fetches unneeded data and can break if schema changes.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/SELECT\s+\*\s+FROM\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Specify required columns explicitly' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-BUG-002',
      category: 'bugs',
      severity: 'critical',
      title: 'DELETE without WHERE',
      description: 'Deleting without a WHERE clause empties the entire table.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/DELETE\s+FROM\b/i.test(line) && !/WHERE\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add a WHERE clause or use TRUNCATE if intentional' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-BUG-003',
      category: 'bugs',
      severity: 'critical',
      title: 'UPDATE without WHERE',
      description: 'Updating without a WHERE clause updates all rows.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/UPDATE\s+[A-Za-z0-9_]+\s+SET\b/i.test(line) && !/WHERE\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add a WHERE clause' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-PERF-001',
      category: 'performance',
      severity: 'info',
      title: 'Missing index hint (SELECT without WHERE on large tables)',
      description: 'Queries without WHERE clauses cause full table scans.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/SELECT\b/i.test(line) && /FROM\b/i.test(line) && !/WHERE\b/i.test(code)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Ensure there is pagination or a WHERE clause for large tables' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-PERF-002',
      category: 'performance',
      severity: 'minor',
      title: 'Using LIKE with leading wildcard',
      description: 'LIKE "%term" prevents the use of indexes.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/LIKE\s+['"]%/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Avoid leading wildcards if possible, or use full-text search' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'Using deprecated syntax',
      description: 'Avoid deprecated join syntaxes.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/(?:,)\s*[a-zA-Z_]+\s*(?:WHERE)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use ANSI JOIN syntax (INNER JOIN, LEFT JOIN, etc.)' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-BP-002',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing table alias in JOIN',
      description: 'Using table aliases makes queries more readable and avoids ambiguous columns.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/JOIN\s+[a-zA-Z_]+\s+ON\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Add a short alias for the table' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Inconsistent keyword casing',
      description: 'SQL keywords should typically be uppercase for readability.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:--|\/\*)/.test(line)) return;
          if (/\b(?:select|from|where|insert|update|delete)\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Uppercase SQL keywords' });
          }
        });
        return issues;
      }
    },
    {
      id: 'SQL-STY-002',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Outstanding tasks left in the query.',
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
