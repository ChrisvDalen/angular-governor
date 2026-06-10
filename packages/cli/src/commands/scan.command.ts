import * as path from 'node:path';
import { NodeFileSystem, defaultConfig, scanProject } from '@angular-governor/core';
import type { GovernorReport } from '@angular-governor/core';
import { allRules } from '@angular-governor/rules';
import { writeJsonReport } from '@angular-governor/reporters';

const CATEGORY_LABELS: Record<string, string> = {
  PROJECT_HEALTH: 'Project Health',
  MODERN_ANGULAR: 'Modern Angular',
  ARCHITECTURE: 'Architecture',
  MAINTAINABILITY: 'Maintainability',
  TESTING: 'Testing',
  PERFORMANCE: 'Performance',
  DEPENDENCIES: 'Dependencies',
};

export async function scanCommand(scanPath: string): Promise<void> {
  const rootPath = path.resolve(scanPath);
  const config = defaultConfig();

  const report = await scanProject({ rootPath, rules: allRules, config });
  const jsonReportPath = await writeJsonReport(
    report,
    rootPath,
    new NodeFileSystem(),
  );

  printSummary(report, [jsonReportPath]);
}

function printSummary(report: GovernorReport, reportPaths: string[]): void {
  console.log('Angular Governor Scan Complete');
  console.log(`Project: ${report.projectName}`);
  if (report.angularVersion) {
    console.log(`Angular version: ${report.angularVersion}`);
  }
  console.log(`Overall score: ${report.overallScore}/100`);
  console.log('Scores:');
  for (const { category, score } of report.categoryScores) {
    console.log(`- ${CATEGORY_LABELS[category] ?? category}: ${score}`);
  }
  if (report.findings.length > 0) {
    console.log(`Findings: ${report.findings.length}`);
  }
  console.log('Reports generated:');
  for (const reportPath of reportPaths) {
    console.log(`- ${reportPath}`);
  }
}
