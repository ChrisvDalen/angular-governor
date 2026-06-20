import { describe, expect, it } from 'vitest';
import { packageJsonExistsRule } from './package-json-exists.rule.js';
import { createScanContext } from '../testing/scan-context.js';

describe('project.package-json.exists', () => {
  it('returns no findings when package.json exists', async () => {
    const context = createScanContext({ 'package.json': '{}' });
    expect(await packageJsonExistsRule.run(context)).toEqual([]);
  });

  it('returns a BLOCKER finding when package.json is missing', async () => {
    const context = createScanContext({});
    const findings = await packageJsonExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('project.package-json.exists');
    expect(findings[0].severity).toBe('BLOCKER');
  });
});
