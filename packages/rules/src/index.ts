import type { Rule } from '@angular-governor/core';
import { angularJsonExistsRule } from './project/angular-json-exists.rule.js';
import { packageJsonExistsRule } from './project/package-json-exists.rule.js';
import { srcAppExistsRule } from './project/src-app-exists.rule.js';
import { lockfileExistsRule } from './dependencies/lockfile-exists.rule.js';
import { buildScriptExistsRule } from './dependencies/build-script-exists.rule.js';

export { angularJsonExistsRule } from './project/angular-json-exists.rule.js';
export { packageJsonExistsRule } from './project/package-json-exists.rule.js';
export { srcAppExistsRule } from './project/src-app-exists.rule.js';
export { lockfileExistsRule } from './dependencies/lockfile-exists.rule.js';
export { buildScriptExistsRule } from './dependencies/build-script-exists.rule.js';

export const allRules: Rule[] = [
  angularJsonExistsRule,
  packageJsonExistsRule,
  srcAppExistsRule,
  lockfileExistsRule,
  buildScriptExistsRule,
];
