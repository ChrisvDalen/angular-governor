import { describe, expect, it } from 'vitest';
import { InMemoryFileSystem } from '@angular-governor/core';
import type { GovernorReport } from '@angular-governor/core';
import { writeJsonReport } from './json-reporter.js';

const report: GovernorReport = {
  projectName: 'demo-app',
  scannedAt: '2026-06-09T12:00:00.000Z',
  angularVersion: '21.0.0',
  overallScore: 72,
  categoryScores: [{ category: 'PROJECT_HEALTH', score: 80, findingCount: 1 }],
  findings: [
    {
      ruleId: 'project.src-app.exists',
      title: 'src/app directory is missing',
      description: 'No files were found under src/app.',
      severity: 'MAJOR',
      category: 'PROJECT_HEALTH',
      recommendation: 'Place application code under src/app.',
    },
  ],
  metadata: {
    rootPath: '/project',
    packageManager: 'pnpm',
    angularJsonFound: true,
    packageJsonFound: true,
    srcAppFound: false,
    detectedTechnologies: ['angular'],
    totalFilesScanned: 12,
  },
};

describe('writeJsonReport', () => {
  it('writes the full report to .angular-governor/report.json', async () => {
    const fileSystem = new InMemoryFileSystem();
    const reportPath = await writeJsonReport(report, '/project', fileSystem);

    expect(reportPath).toBe('/project/.angular-governor/report.json');
    const written = JSON.parse(await fileSystem.readFile(reportPath));
    expect(written).toEqual(report);
  });

  it('normalizes a trailing slash in the root path', async () => {
    const fileSystem = new InMemoryFileSystem();
    const reportPath = await writeJsonReport(report, '/project/', fileSystem);
    expect(reportPath).toBe('/project/.angular-governor/report.json');
  });
});
