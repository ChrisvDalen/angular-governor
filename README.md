# Angular Governor

Angular Governor is a CLI-first governance tool for Angular projects.
It scans your codebase for architecture risks, maintainability issues,
modern Angular adoption, testing gaps and performance risks.
It generates JSON, Markdown and static dashboard reports and can be used
locally or in CI through GitHub Actions.

> **Status:** early MVP. The first vertical slice is implemented: file discovery,
> project detection, rule engine, scoring, the first 5 rules and the JSON report.
> Markdown reports, the HTML dashboard, the remaining rules, configuration loading
> and the GitHub Action are next.

## Usage

```bash
pnpm install
pnpm build
node packages/cli/dist/bin.js scan <path-to-angular-project>
```

This generates `.angular-governor/report.json` in the scanned project and prints
a score summary to the console.

## Rules (current)

| Rule | Category | Default severity |
|---|---|---|
| `project.angular-json.exists` | Project Health | BLOCKER |
| `project.package-json.exists` | Project Health | BLOCKER |
| `project.src-app.exists` | Project Health | MAJOR |
| `dependencies.lockfile.exists` | Dependencies | MAJOR |
| `scripts.build.exists` | Dependencies | MAJOR |

## Scoring

Each category that had at least one rule executed starts at 100. Findings subtract
points: BLOCKER −40, MAJOR −20, MINOR −8, INFO −1. Category scores never drop
below 0. The overall score is the average of all executed category scores.

## Development

```bash
pnpm install
pnpm build   # builds all packages
pnpm test    # runs all Vitest suites
```

The repository is a pnpm monorepo:

- `packages/core` — domain model, scanner, scoring, file system abstraction
- `packages/rules` — rule implementations
- `packages/reporters` — JSON (and later Markdown) report generation
- `packages/cli` — CLI commands and orchestration
- `packages/dashboard` — static HTML dashboard generator (planned)
- `packages/github-action` — GitHub Action wrapper (planned)
