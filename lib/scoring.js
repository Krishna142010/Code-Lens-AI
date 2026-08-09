const PENALTIES = {
  critical: -25,
  major: -15,
  minor: -5,
  info: -2
};

const CATEGORY_WEIGHTS = {
  security: 3.0,
  bugs: 2.5,
  performance: 2.0,
  'best-practices': 1.5,
  style: 1.0
};

function getGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function calculateScores(issues) {
  const categories = {};
  let totalIssues = issues.length;
  
  // Initialize categories
  for (const cat of Object.keys(CATEGORY_WEIGHTS)) {
    categories[cat] = { score: 100, issues: [], penalty: 0 };
  }

  // Group issues and calculate penalties
  for (const issue of issues) {
    const cat = issue.category || 'style'; // Default category
    if (!categories[cat]) {
      categories[cat] = { score: 100, issues: [], penalty: 0 };
    }
    
    categories[cat].issues.push(issue);
    
    const severity = issue.severity || 'info';
    categories[cat].penalty += (PENALTIES[severity] || 0);
  }

  let totalWeight = 0;
  let weightedScoreSum = 0;

  // Calculate final category scores
  for (const [cat, data] of Object.entries(categories)) {
    data.score = Math.max(0, 100 + data.penalty); // penalty is negative
    
    const weight = CATEGORY_WEIGHTS[cat] || 1.0;
    totalWeight += weight;
    weightedScoreSum += data.score * weight;
  }

  const overall = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 100;
  const grade = getGrade(overall);
  const passRate = totalIssues === 0 ? 100 : Math.round(((overall) / 100) * 100);

  // Clean up intermediate properties before returning
  for (const cat of Object.values(categories)) {
    delete cat.penalty;
  }

  return {
    overall,
    grade,
    categories,
    totalIssues,
    passRate
  };
}
