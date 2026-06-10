import type { Rule } from '@angular-governor/core';

interface PackageJsonWithScripts {
  scripts?: Record<string, string>;
}

export const buildScriptExistsRule: Rule = {
  id: 'scripts.build.exists',
  name: 'Build script exists',
  category: 'DEPENDENCIES',
  defaultSeverity: 'MAJOR',
  async run(context) {
    const packageJson = context.packageJson as PackageJsonWithScripts | undefined;
    if (packageJson?.scripts?.['build']) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        title: 'No build script in package.json',
        description:
          'package.json does not define a "build" script, so the project cannot be built with a standard command.',
        severity: this.defaultSeverity,
        category: this.category,
        filePath: context.files.some((file) => file.path === 'package.json')
          ? 'package.json'
          : undefined,
        recommendation:
          'Add a "build" script to package.json, for example "build": "ng build".',
      },
    ];
  },
};
