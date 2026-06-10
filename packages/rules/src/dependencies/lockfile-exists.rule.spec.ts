import { describe, expect, it } from 'vitest';
import { lockfileExistsRule } from './lockfile-exists.rule.js';
import { createScanContext } from '../testing/scan-context.js';

describe('dependencies.lockfile.exists', () => {
  it.each(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb'])(
    'returns no findings when %s exists',
    async (lockfile) => {
      const context = createScanContext({ [lockfile]: '' });
      expect(await lockfileExistsRule.run(context)).toEqual([]);
    },
  );

  it('returns a MAJOR finding when no lockfile exists', async () => {
    const context = createScanContext({ 'package.json': '{}' });
    const findings = await lockfileExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('dependencies.lockfile.exists');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].category).toBe('DEPENDENCIES');
  });
});
