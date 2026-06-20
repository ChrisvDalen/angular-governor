export type Severity = 'BLOCKER' | 'MAJOR' | 'MINOR' | 'INFO';

export type Category =
  | 'PROJECT_HEALTH'
  | 'MODERN_ANGULAR'
  | 'ARCHITECTURE'
  | 'MAINTAINABILITY'
  | 'TESTING'
  | 'PERFORMANCE'
  | 'DEPENDENCIES';

export interface GovernorReport {
  projectName: string;
  scannedAt: string;
  angularVersion?: string;
  overallScore: number;
  categoryScores: CategoryScore[];
  findings: Finding[];
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  rootPath: string;
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
  angularJsonFound: boolean;
  packageJsonFound: boolean;
  srcAppFound: boolean;
  detectedTechnologies: string[];
  totalFilesScanned: number;
}

export interface CategoryScore {
  category: Category;
  score: number;
  findingCount: number;
}

export interface Finding {
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  category: Category;
  filePath?: string;
  line?: number;
  recommendation: string;
}
