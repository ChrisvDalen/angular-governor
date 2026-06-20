import { defaultConfig } from '@angular-governor/core';
import type { ProjectFile, ScanContext } from '@angular-governor/core';

export function createScanContext(
  files: Record<string, string>,
  overrides: Partial<ScanContext> = {},
): ScanContext {
  const projectFiles: ProjectFile[] = Object.entries(files).map(
    ([path, content]) => {
      const dotIndex = path.lastIndexOf('.');
      return {
        path,
        content,
        extension: dotIndex >= 0 ? path.slice(dotIndex) : '',
      };
    },
  );
  const packageJsonContent = files['package.json'];
  return {
    rootPath: '/project',
    files: projectFiles,
    packageJson: packageJsonContent ? JSON.parse(packageJsonContent) : undefined,
    angularJson: files['angular.json'] ? JSON.parse(files['angular.json']) : undefined,
    config: defaultConfig(),
    ...overrides,
  };
}
