import type { Rule } from '@angular-governor/core';

export const srcAppExistsRule: Rule = {
  id: 'project.src-app.exists',
  name: 'src/app exists',
  category: 'PROJECT_HEALTH',
  defaultSeverity: 'MAJOR',
  async run(context) {
    if (context.files.some((file) => file.path.startsWith('src/app/'))) {
      return [];
    }
    return [
      {
        ruleId: this.id,
        title: 'src/app directory is missing',
        description:
          'No files were found under src/app. The conventional Angular application source layout was not detected.',
        severity: this.defaultSeverity,
        category: this.category,
        recommendation:
          'Place application code under src/app, the conventional Angular CLI layout.',
      },
    ];
  },
};
