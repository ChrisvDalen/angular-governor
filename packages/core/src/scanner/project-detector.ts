import type { ProjectMetadata } from '../domain/model.js';
import type { ProjectFile } from '../domain/rule.js';

interface PackageJsonShape {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const TECHNOLOGY_MARKERS: Record<string, string> = {
  '@angular/core': 'angular',
  '@angular/material': 'angular-material',
  '@ngrx/store': 'ngrx',
  rxjs: 'rxjs',
  typescript: 'typescript',
  jest: 'jest',
  vitest: 'vitest',
  karma: 'karma',
  cypress: 'cypress',
  playwright: 'playwright',
  '@playwright/test': 'playwright',
  tailwindcss: 'tailwindcss',
  eslint: 'eslint',
  prettier: 'prettier',
  '@nx/angular': 'nx',
};

export function detectProject(
  rootPath: string,
  files: ProjectFile[],
  packageJson: unknown,
): ProjectMetadata {
  const filePaths = new Set(files.map((file) => file.path));
  return {
    rootPath,
    packageManager: detectPackageManager(filePaths),
    angularJsonFound: filePaths.has('angular.json'),
    packageJsonFound: filePaths.has('package.json'),
    srcAppFound: files.some((file) => file.path.startsWith('src/app/')),
    detectedTechnologies: detectTechnologies(packageJson),
    totalFilesScanned: files.length,
  };
}

export function detectAngularVersion(packageJson: unknown): string | undefined {
  const declared = allDependencies(packageJson)['@angular/core'];
  if (!declared) {
    return undefined;
  }
  return declared.replace(/^[\^~>=<\s]+/, '');
}

export function detectProjectName(packageJson: unknown, rootPath: string): string {
  const pkg = packageJson as PackageJsonShape | undefined;
  if (pkg?.name) {
    return pkg.name;
  }
  const segments = rootPath.replace(/[\\/]+$/, '').split(/[\\/]/);
  return segments[segments.length - 1] || 'unknown-project';
}

function detectPackageManager(
  filePaths: Set<string>,
): ProjectMetadata['packageManager'] {
  if (filePaths.has('pnpm-lock.yaml')) return 'pnpm';
  if (filePaths.has('yarn.lock')) return 'yarn';
  if (filePaths.has('bun.lockb')) return 'bun';
  if (filePaths.has('package-lock.json')) return 'npm';
  return undefined;
}

function detectTechnologies(packageJson: unknown): string[] {
  const dependencies = allDependencies(packageJson);
  const technologies = new Set<string>();
  for (const [dependencyName, technology] of Object.entries(TECHNOLOGY_MARKERS)) {
    if (dependencyName in dependencies) {
      technologies.add(technology);
    }
  }
  return [...technologies].sort();
}

function allDependencies(packageJson: unknown): Record<string, string> {
  const pkg = packageJson as PackageJsonShape | undefined;
  return { ...pkg?.dependencies, ...pkg?.devDependencies };
}
