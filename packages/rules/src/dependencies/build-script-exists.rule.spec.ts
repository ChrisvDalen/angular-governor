import { describe, expect, it } from 'vitest';
import { buildScriptExistsRule } from './build-script-exists.rule.js';
import { createScanContext } from '../testing/scan-context.js';

describe('scripts.build.exists', () => {
  it('returns no findings when a build script exists', async () => {
    const context = createScanContext({
      'package.json': JSON.stringify({ scripts: { build: 'ng build' } }),
    });
    expect(await buildScriptExistsRule.run(context)).toEqual([]);
  });

  it('returns a MAJOR finding when the build script is missing', async () => {
    const context = createScanContext({
      'package.json': JSON.stringify({ scripts: { test: 'ng test' } }),
    });
    const findings = await buildScriptExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('scripts.build.exists');
    expect(findings[0].severity).toBe('MAJOR');
    expect(findings[0].filePath).toBe('package.json');
  });

  it('returns a finding when package.json is missing entirely', async () => {
    const context = createScanContext({});
    const findings = await buildScriptExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBeUndefined();
  });
});
