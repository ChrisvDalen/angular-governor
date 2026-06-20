import type { Rule } from '@angular-governor/core';

export const packageJsonExistsRule: Rule = {
  id: 'project.package-json.exists',
  name: 'package.json exists',
  category: 'PROJECT_HEALTH',
  defaultSeverity: 'BLOCKER',
  async run(context) {
    if (context.files.some((file) => file.path === 'package.json')) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        title: 'package.json is missing',
        description:
          'No package.json was found in the project root. Dependencies and scripts cannot be analyzed.',
        severity: this.defaultSeverity,
        category: this.category,
        recommendation:
          'Run the scan from the project root, or initialize the project with "npm init".',
      },
    ];
  },
};
