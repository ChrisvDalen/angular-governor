import type { Rule } from '@angular-governor/core';

export const angularJsonExistsRule: Rule = {
  id: 'project.angular-json.exists',
  name: 'angular.json exists',
  category: 'PROJECT_HEALTH',
  defaultSeverity: 'BLOCKER',
  async run(context) {
    if (context.files.some((file) => file.path === 'angular.json')) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        title: 'angular.json is missing',
        description:
          'No angular.json was found in the project root. Angular Governor could not identify this as an Angular CLI workspace.',
        severity: this.defaultSeverity,
        category: this.category,
        recommendation:
          'Run the scan from the root of an Angular CLI workspace, or create the workspace with "ng new".',
      },
    ];
  },
};
