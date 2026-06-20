import { describe, expect, it } from 'vitest';
import { srcAppExistsRule } from './src-app-exists.rule.js';
import { createScanContext } from '../testing/scan-context.js';

describe('project.src-app.exists', () => {
  it('returns no findings when files exist under src/app', async () => {
    const context = createScanContext({
      'src/app/app.component.ts': 'export class AppComponent {}',
    });
    expect(await srcAppExistsRule.run(context)).toEqual([]);
  });

  it('returns a MAJOR finding when src/app has no files', async () => {
    const context = createScanContext({ 'src/main.ts': '' });
    const findings = await srcAppExistsRule.run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('project.src-app.exists');
    expect(findings[0].severity).toBe('MAJOR');
  });
});
