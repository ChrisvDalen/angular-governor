import type { Rule } from '@angular-governor/core';

const LOCKFILES = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb'];

export const lockfileExistsRule: Rule = {
  id: 'dependencies.lockfile.exists',
  name: 'Lockfile exists',
  category: 'DEPENDENCIES',
  defaultSeverity: 'MAJOR',
  async run(context) {
    const hasLockfile = context.files.some((file) => LOCKFILES.includes(file.path));
    if (hasLockfile) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        title: 'No dependency lockfile found',
        description:
          'None of package-lock.json, pnpm-lock.yaml, yarn.lock or bun.lockb was found. Builds are not reproducible without a lockfile.',
        severity: this.defaultSeverity,
        category: this.category,
        recommendation:
          'Install dependencies with your package manager and commit the generated lockfile.',
      },
    ];
  },
};
