import type { FileSystem, GovernorReport } from '@angular-governor/core';
import { JSON_REPORT_FILENAME, joinReportPath } from './report-paths.js';

export async function writeJsonReport(
  report: GovernorReport,
  rootPath: string,
  fileSystem: FileSystem,
): Promise<string> {
  const reportPath = joinReportPath(rootPath, JSON_REPORT_FILENAME);
  await fileSystem.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  return reportPath;
}
