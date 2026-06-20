import type { Category, Finding } from '../domain/model.js';
import type { Rule, ScanContext } from '../domain/rule.js';

export interface RuleRunResult {
  findings: Finding[];
  executedCategories: Category[];
}

export async function runRules(
  rules: Rule[],
  context: ScanContext,
): Promise<RuleRunResult> {
  const disabled = new Set(context.config.rules.disabled);
  const overrides = context.config.rules.severityOverrides;
  const enabledRules = rules.filter((rule) => !disabled.has(rule.id));

  const findings: Finding[] = [];
  const executedCategories = new Set<Category>();

  for (const rule of enabledRules) {
    executedCategories.add(rule.category);
    const ruleFindings = await rule.run(context);
    for (const finding of ruleFindings) {
      const severityOverride = overrides[finding.ruleId];
      findings.push(
        severityOverride ? { ...finding, severity: severityOverride } : finding,
      );
    }
  }

  return { findings, executedCategories: [...executedCategories] };
}
