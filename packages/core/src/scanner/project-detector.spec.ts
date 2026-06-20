import { describe, expect, it } from 'vitest';
import type { ProjectFile } from '../domain/rule.js';
import {
  detectAngularVersion,
  detectProject,
  detectProjectName,
} from './project-detector.js';

function file(path: string, content = ''): ProjectFile {
  const dotIndex = path.lastIndexOf('.');
  return { path, content, extension: dotIndex >= 0 ? path.slice(dotIndex) : '' };
}

describe('detectProject', () => {
  it('detects an Angular project layout', () => {
    const files = [
      file('angular.json'),
      file('package.json'),
      file('pnpm-lock.yaml'),
      file('src/app/app.component.ts'),
    ];
    const metadata = detectProject('/repo', files, {
      dependencies: { '@angular/core': '^21.0.0', rxjs: '^7.8.0' },
    });

    expect(metadata.angularJsonFound).toBe(true);
    expect(metadata.packageJsonFound).toBe(true);
    expect(metadata.srcAppFound).toBe(true);
    expect(metadata.packageManager).toBe('pnpm');
    expect(metadata.detectedTechnologies).toContain('angular');
    expect(metadata.detectedTechnologies).toContain('rxjs');
    expect(metadata.totalFilesScanned).toBe(4);
  });

  it('handles a non-Angular project', () => {
    const metadata = detectProject('/repo', [file('index.js')], undefined);
    expect(metadata.angularJsonFound).toBe(false);
    expect(metadata.packageJsonFound).toBe(false);
    expect(metadata.srcAppFound).toBe(false);
    expect(metadata.packageManager).toBeUndefined();
    expect(metadata.detectedTechnologies).toEqual([]);
  });

  it('detects npm from package-lock.json', () => {
    const metadata = detectProject('/repo', [file('package-lock.json')], undefined);
    expect(metadata.packageManager).toBe('npm');
  });
});

describe('detectAngularVersion', () => {
  it('strips semver range prefixes', () => {
    expect(
      detectAngularVersion({ dependencies: { '@angular/core': '^21.0.0' } }),
    ).toBe('21.0.0');
  });

  it('returns undefined without @angular/core', () => {
    expect(detectAngularVersion({ dependencies: {} })).toBeUndefined();
    expect(detectAngularVersion(undefined)).toBeUndefined();
  });
});

describe('detectProjectName', () => {
  it('prefers the package.json name', () => {
    expect(detectProjectName({ name: 'my-app' }, '/repo/my-dir')).toBe('my-app');
  });

  it('falls back to the directory name', () => {
    expect(detectProjectName(undefined, '/repo/my-dir')).toBe('my-dir');
  });
});
