import { calculateScores } from './scoring.js';

const LANGUAGE_RULE_MODULES = {
  javascript: 'javascript',
  typescript: 'javascript',
  python: 'python',
  java: 'java',
  c: 'c-cpp',
  cpp: 'c-cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  ruby: 'ruby',
  php: 'php',
  swift: 'swift-kotlin',
  kotlin: 'swift-kotlin',
  html: 'html-css',
  css: 'html-css',
  sql: 'sql',
  shell: 'shell',
  r: 'r-perl',
  perl: 'r-perl',
  dart: 'dart-lua',
  lua: 'dart-lua',
  yaml: 'config',
  json: 'config',
};

/**
 * Load rules for a given language by dynamically importing the correct rule module.
 */
async function loadRules(languageId) {
  const moduleKey = LANGUAGE_RULE_MODULES[languageId];
  if (!moduleKey) return [];

  try {
    // Dynamic import of the rule module
    const ruleModule = await import(`./rules/${moduleKey}.js`);

    if (typeof ruleModule.getRules === 'function') {
      return ruleModule.getRules();
    }

    return [];
  } catch (err) {
    console.warn(`Failed to load rules for "${languageId}":`, err.message);
    return [];
  }
}

/**
 * Run all rules against the provided code and collect issues.
 */
function runRules(rules, code) {
  const lines = code.split('\n');
  const issues = [];

  for (const rule of rules) {
    try {
      const ruleIssues = rule.check(code, lines);
      if (Array.isArray(ruleIssues)) {
        for (const issue of ruleIssues) {
          issues.push({
            id: rule.id,
            category: rule.category,
            severity: rule.severity,
            title: rule.title,
            description: rule.description,
            line: issue.line,
            match: issue.match,
            fix: issue.fix,
          });
        }
      }
    } catch (err) {
      // Skip rules that throw errors — don't let one bad rule break the analysis
      console.warn(`Rule "${rule.id}" failed:`, err.message);
    }
  }

  // Sort issues by line number, then severity
  const severityOrder = { critical: 0, major: 1, minor: 2, info: 3 };
  issues.sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line;
    return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
  });

  return issues;
}

/**
 * Main analysis function.
 * Analyzes the provided code for the given language and returns a structured result.
 */
export async function analyzeCode(code, languageId) {
  if (!code || !code.trim()) {
    return {
      language: languageId || 'unknown',
      scores: {
        overall: 100,
        grade: 'A+',
        categories: {},
        totalIssues: 0,
        passRate: 100,
      },
      issues: [],
      summary: 'No code provided for analysis.',
      linesAnalyzed: 0,
    };
  }

  const rules = await loadRules(languageId);

  if (rules.length === 0) {
    return {
      language: languageId || 'unknown',
      scores: {
        overall: 100,
        grade: 'A+',
        categories: {},
        totalIssues: 0,
        passRate: 100,
      },
      issues: [],
      summary: `No analysis rules available for "${languageId}". Please select a supported language.`,
      linesAnalyzed: code.split('\n').length,
    };
  }

  const issues = runRules(rules, code);
  const scores = calculateScores(issues);
  const linesAnalyzed = code.split('\n').length;

  return {
    language: languageId,
    scores,
    issues,
    summary: `Analyzed ${linesAnalyzed} lines of ${languageId}. Found ${scores.totalIssues} issue${scores.totalIssues !== 1 ? 's' : ''} across ${Object.keys(scores.categories).length} categories.`,
    linesAnalyzed,
    rulesApplied: rules.length,
  };
}
