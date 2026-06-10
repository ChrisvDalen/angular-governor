import type { Category, Finding, Severity } from './model.js';
import type { GovernorConfig } from '../config/governor-config.js';

export interface ProjectFile {
  path: string;
  content: string;
  extension: string;
}

export interface ScanContext {
  rootPath: string;
  files: ProjectFile[];
  packageJson?: unknown;
  angularJson?: unknown;
  config: GovernorConfig;
}

export interface Rule {
  id: string;
  name: string;
  category: Category;
  defaultSeverity: Severity;
  run(context: ScanContext): Promise<Finding[]>;
}
