import type { Severity } from '../domain/model.js';

export interface GovernorConfig {
  project: {
    name?: string;
  };
  thresholds: {
    overall: number;
    componentMaxLines: number;
  };
  rules: {
    disabled: string[];
    severityOverrides: Record<string, Severity>;
  };
}

export function defaultConfig(): GovernorConfig {
  return {
    project: {},
    thresholds: {
      overall: 70,
      componentMaxLines: 300,
    },
    rules: {
      disabled: [],
      severityOverrides: {},
    },
  };
}
