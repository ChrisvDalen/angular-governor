import type { GovernorReport } from '../domain/model.js';
import type { ProjectFile, Rule, ScanContext } from '../domain/rule.js';
import type { GovernorConfig } from '../config/governor-config.js';
import { discoverFiles } from './file-discovery.js';
import {
  detectAngularVersion,
  detectProject,
  detectProjectName,
} from './project-detector.js';
import { runRules } from './rule-runner.js';
import {
  calculateCategoryScores,
  calculateOverallScore,
} from '../scoring/scoring.js';

export interface ScanOptions {
  rootPath: string;
  rules: Rule[];
  config: GovernorConfig;
  now?: () => Date;
}

export async function scanProject(options: ScanOptions): Promise<GovernorReport> {
  const { rootPath, rules, config } = options;
  const now = options.now ?? (() => new Date());

  const files = await discoverFiles(rootPath);
  const packageJson = parseJsonFile(files, 'package.json');
  const angularJson = parseJsonFile(files, 'angular.json');

  const context: ScanContext = { rootPath, files, packageJson, angularJson, config };
  const metadata = detectProject(rootPath, files, packageJson);
  const { findings, executedCategories } = await runRules(rules, context);

  const categoryScores = calculateCategoryScores(findings, executedCategories);
  return {
    projectName: config.project.name ?? detectProjectName(packageJson, rootPath),
    scannedAt: now().toISOString(),
    angularVersion: detectAngularVersion(packageJson),
    overallScore: calculateOverallScore(categoryScores),
    categoryScores,
    findings,
    metadata,
  };
}

function parseJsonFile(files: ProjectFile[], filePath: string): unknown {
  const file = files.find((candidate) => candidate.path === filePath);
  if (!file) {
    return undefined;
  }
  try {
    return JSON.parse(file.content);
  } catch {
    return undefined;
  }
}
