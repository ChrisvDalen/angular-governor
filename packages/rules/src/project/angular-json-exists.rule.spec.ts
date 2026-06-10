import { describe, expect, it } from 'vitest';
import { angularJsonExistsRule } from './angular-json-exists.rule.js';
import { createScanContext } from '../testing/scan-context.js';

describe('project.angular-json.exists', () => {
  it('returns no findings when angular.json exists', async () => {
    const context = createScanContext({ 'angular.json': '{}' });
    expect(await angularJsonExistsRule.run(context)).toEqual([]);
  });

  it('returns a BLOCKER finding when angular.json is missing', async () => {
    const context = createScanContext({ 'package.json': '{}' });
    const findings = await angularJsonExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('project.angular-json.exists');
    expect(findings[0].severity).toBe('BLOCKER');
    expect(findings[0].category).toBe('PROJECT_HEALTH');
  });
});
