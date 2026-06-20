export const REPORT_DIRECTORY = '.angular-governor';
export const JSON_REPORT_FILENAME = 'report.json';

export function joinReportPath(rootPath: string, filename: string): string {
  const normalizedRoot = rootPath.replace(/[\\/]+$/, '');
  return `${normalizedRoot}/${REPORT_DIRECTORY}/${filename}`;
}
