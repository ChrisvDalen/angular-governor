import { describe, expect, it } from 'vitest';
import type { Finding } from '../domain/model.js';
import { calculateCategoryScores, calculateOverallScore } from './scoring.js';

function finding(overrides: Partial<Finding>): Finding {
  return {
    ruleId: 'test.rule',
    title: 'Test finding',
    description: 'A test finding',
    severity: 'MINOR',
    category: 'PROJECT_HEALTH',
    recommendation: 'Fix it',
    ...overrides,
  };
}

describe('calculateCategoryScores', () => {
  it('gives 100 to an executed category without findings', () => {
    const scores = calculateCategoryScores([], ['PROJECT_HEALTH']);
    expect(scores).toEqual([
      { category: 'PROJECT_HEALTH', score: 100, findingCount: 0 },
    ]);
  });

  it('applies severity penalties', () => {
    const findings = [
      finding({ severity: 'BLOCKER' }),
      finding({ severity: 'MAJOR' }),
      finding({ severity: 'MINOR' }),
      finding({ severity: 'INFO' }),
    ];
    const scores = calculateCategoryScores(findings, ['PROJECT_HEALTH']);
    expect(scores[0].score).toBe(100 - 40 - 20 - 8 - 1);
    expect(scores[0].findingCount).toBe(4);
  });

  it('never drops a category score below 0', () => {
    const findings = [
      finding({ severity: 'BLOCKER' }),
      finding({ severity: 'BLOCKER' }),
      finding({ severity: 'BLOCKER' }),
    ];
    const scores = calculateCategoryScores(findings, ['PROJECT_HEALTH']);
    expect(scores[0].score).toBe(0);
  });

  it('only scores executed categories', () => {
    const findings = [finding({ category: 'TESTING' })];
    const scores = calculateCategoryScores(findings, ['PROJECT_HEALTH']);
    expect(scores).toHaveLength(1);
    expect(scores[0].category).toBe('PROJECT_HEALTH');
    expect(scores[0].findingCount).toBe(0);
  });
});

describe('calculateOverallScore', () => {
  it('returns 100 when no categories were executed', () => {
    expect(calculateOverallScore([])).toBe(100);
  });

  it('averages category scores and rounds', () => {
    const overall = calculateOverallScore([
      { category: 'PROJECT_HEALTH', score: 80, findingCount: 1 },
      { category: 'TESTING', score: 55, findingCount: 2 },
    ]);
    expect(overall).toBe(68);
  });
});
