export const metadata = {
  language: 'Java',
  extensions: ['.java'],
  keywords: ['public', 'class', 'void', 'private', 'protected', 'import java']
};

export function getRules() {
  return [
    {
      id: 'JAVA-SEC-001',
      category: 'security',
      severity: 'critical',
      title: 'SQL concatenation',
      description: 'String concatenation in SQL queries can lead to SQL Injection.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/SELECT|UPDATE|INSERT|DELETE/i.test(line) && /\+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use PreparedStatement instead of string concatenation.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-SEC-002',
      category: 'security',
      severity: 'critical',
      title: 'Hardcoded passwords',
      description: 'Never hardcode secrets in source code.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/(?:password|secret|pwd)\s*=\s*".+"/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Externalize credentials to secure configuration files or vaults.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BUG-001',
      category: 'bugs',
      severity: 'major',
      title: 'String comparison with ==',
      description: 'Strings should be compared using .equals(), not ==.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          // Naive check for == where Strings might be involved
          if (/\b(?:String)\s+\w+/.test(code) && /==/.test(line)) {
             // Let's just do a simpler pattern for demo purposes
          }
          if (/\w+\s*==\s*".*"|".*"\s*==\s*\w+/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use .equals() for string comparison.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BUG-002',
      category: 'bugs',
      severity: 'major',
      title: 'Empty catch block',
      description: 'Empty catch blocks silently swallow exceptions.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/catch\s*\([^)]+\)\s*\{\s*\}/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Handle the exception or log it.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BUG-003',
      category: 'bugs',
      severity: 'minor',
      title: 'Null pointer - no null check before method call pattern',
      description: 'Unchecked method calls might cause NullPointerException.',
      check: (code, lines) => {
        const issues = [];
        // very basic placeholder rule
        return issues;
      }
    },
    {
      id: 'JAVA-BUG-004',
      category: 'bugs',
      severity: 'major',
      title: 'System.exit() in library code',
      description: 'System.exit() forcefully terminates the JVM and shouldn\'t be used in standard execution flows.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bSystem\.exit\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Throw an exception instead of exiting the JVM.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-PERF-001',
      category: 'performance',
      severity: 'minor',
      title: 'String concatenation in loop',
      description: 'String concatenation in a loop creates many temporary objects.',
      check: (code, lines) => {
        const issues = [];
        let inLoop = false;
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:for|while)\s*\(/.test(line)) inLoop = true;
          if (inLoop && /\+=|\+/.test(line) && /\bString\b/.test(code)) {
             // simplified
          }
          if (inLoop && /}/.test(line)) inLoop = false;
        });
        return issues;
      }
    },
    {
      id: 'JAVA-PERF-002',
      category: 'performance',
      severity: 'info',
      title: 'Using Vector instead of ArrayList',
      description: 'Vector is synchronized and slower than ArrayList.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bVector\b/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use ArrayList instead unless thread safety is required.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BP-001',
      category: 'best-practices',
      severity: 'info',
      title: 'System.out.println debugging',
      description: 'Standard output shouldn\'t be used for logging.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\bSystem\.(?:out|err)\.println\s*\(/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use a logging framework like SLF4J or Log4j.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BP-002',
      category: 'best-practices',
      severity: 'minor',
      title: 'Raw types usage',
      description: 'Avoid using raw types. Use generics to ensure type safety.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\b(?:List|Set|Map|ArrayList|HashMap)\s+\w+\s*=/.test(line) && !/</.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Use generic type arguments, e.g., List<String>.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-BP-003',
      category: 'best-practices',
      severity: 'info',
      title: 'Missing @Override annotation',
      description: 'Overridden methods should have @Override annotation.',
      check: (code, lines) => {
        return []; // placeholder logic
      }
    },
    {
      id: 'JAVA-BP-004',
      category: 'best-practices',
      severity: 'minor',
      title: 'Public fields instead of getters/setters',
      description: 'Fields should be private and accessed via getters/setters.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/^\s*public\s+(?!static\s+final|class|interface|enum)\w+\s+\w+\s*;/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Make field private and provide getter/setter.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-STY-001',
      category: 'style',
      severity: 'info',
      title: 'Magic numbers',
      description: 'Avoid magic numbers. Define them as static final constants.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/^\s*(?:\/\/|\/\*)/.test(line)) return;
          if (/\s[=<>]\s*\d{2,}/.test(line) && !/static\s+final/.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Extract magic number to a constant.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-STY-002',
      category: 'style',
      severity: 'info',
      title: 'TODO/FIXME comments',
      description: 'Unresolved TODO or FIXME comments.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (/\b(?:TODO|FIXME)\b/i.test(line)) {
            issues.push({ line: i + 1, match: line.trim(), fix: 'Resolve the TODO/FIXME.' });
          }
        });
        return issues;
      }
    },
    {
      id: 'JAVA-STY-003',
      category: 'style',
      severity: 'info',
      title: 'Very long lines > 120 chars',
      description: 'Lines shouldn\'t exceed 120 characters.',
      check: (code, lines) => {
        const issues = [];
        lines.forEach((line, i) => {
          if (line.length > 120) {
            issues.push({ line: i + 1, match: line.substring(0, 30) + '...', fix: 'Format line to fit 120 characters.' });
          }
        });
        return issues;
      }
    }
  ];
}
