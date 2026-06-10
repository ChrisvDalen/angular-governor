import type { Category, CategoryScore, Finding, Severity } from '../domain/model.js';

const SEVERITY_PENALTIES: Record<Severity, number> = {
  BLOCKER: 40,
  MAJOR: 20,
  MINOR: 8,
  INFO: 1,
};

export function calculateCategoryScores(
  findings: Finding[],
  executedCategories: Category[],
): CategoryScore[] {
  return executedCategories.map((category) => {
    const categoryFindings = findings.filter(
      (finding) => finding.category === category,
    );
    const penalty = categoryFindings.reduce(
      (total, finding) => total + SEVERITY_PENALTIES[finding.severity],
      0,
    );
    return {
      category,
      score: Math.max(0, 100 - penalty),
      findingCount: categoryFindings.length,
    };
  });
}

export function calculateOverallScore(categoryScores: CategoryScore[]): number {
  if (categoryScores.length === 0) {
    return 100;
  }
  const total = categoryScores.reduce((sum, entry) => sum + entry.score, 0);
  return Math.round(total / categoryScores.length);
}
