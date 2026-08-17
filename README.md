<div align="center">

# 🏛️ Angular Governor

**CLI-first governance for Angular projects.**

Angular Governor is a CLI-first governance tool for Angular projects.
It scans your codebase for architecture risks, maintainability issues,
modern Angular adoption, testing gaps and performance risks.
It generates JSON, Markdown and static dashboard reports and can be used
locally or in CI through GitHub Actions.

[Getting Started](#-getting-started) ·
[CLI Commands](#-cli-commands) ·
[Rules](#-rules) ·
[Scoring](#-scoring) ·
[GitHub Action](#-github-action) ·
[Roadmap](#-roadmap)

</div>

---

## Why Angular Governor?

Linters catch syntax-level issues. Angular Governor looks at the **project level**:

- 🩺 **Project health** — is this a well-formed, buildable Angular workspace?
- ⚡ **Modern Angular adoption** — standalone components, signals, new control flow
- 🧱 **Architecture** — feature isolation, no cross-feature imports
- 🧹 **Maintainability** — oversized components, smells that slow teams down
- 🧪 **Testing** — are there tests at all, and where are the gaps?
- 🚀 **Performance** — change detection strategy, lazy loading
- 📦 **Dependencies** — lockfiles, scripts, version hygiene

One command. A score per category. Reports you can read, diff and gate CI on.

## 🚀 Getting Started

```bash
npx angular-governor scan .
```

That's it. Angular Governor detects your workspace, runs its rules and writes
reports to `.angular-governor/`.

> **Status — early MVP.** The first vertical slice is implemented and working:
> file discovery, project detection, the rule engine, scoring, the first 5 rules,
> the JSON report and the `scan` command. Items marked 🔜 below are planned and
> on the [roadmap](#-roadmap). Until the package is published to npm, run it
> from this repository (see [Development](#-development)).

### Example output

```text
Angular Governor Scan Complete
Project: my-angular-app
Angular version: 21.0.0
Overall score: 72/100
Scores:
- Project Health: 85
- Modern Angular: 70
- Architecture: 65
- Maintainability: 68
- Testing: 55
- Performance: 75
- Dependencies: 90
Reports generated:
- .angular-governor/report.json
- .angular-governor/report.md
- .angular-governor/dashboard.html
```

### Generated reports

Every scan writes its results to a `.angular-governor/` folder in the scanned
project:

| File | Contents | Status |
|---|---|---|
| `report.json` | The full machine-readable `GovernorReport` — scores, findings, metadata | ✅ |
| `report.md` | Human-readable Markdown summary, ideal for PR comments | 🔜 |
| `dashboard.html` | Self-contained static dashboard with filters — no server needed | 🔜 |

## 💻 CLI Commands

| Command | Description | Status |
|---|---|---|
| `angular-governor scan .` | Scan the current directory and generate reports | ✅ |
| `angular-governor scan <path>` | Scan a specific project path | ✅ |
| `angular-governor report` | Show the latest report summary from `.angular-governor/report.json` | 🔜 |
| `angular-governor rules list` | List all available rules | 🔜 |
| `angular-governor init` | Create an `angular-governor.yml` config file | 🔜 |

`ng-governor` works as an alias for `angular-governor`.

## 📏 Rules

Every rule has an id, a category and a default severity. Rules never print —
they return findings, and the CLI and reporters decide how to present them.

### Available today

| Rule | Category | Severity | Checks |
|---|---|---|---|
| `project.angular-json.exists` | Project Health | 🟥 BLOCKER | `angular.json` exists in the project root |
| `project.package-json.exists` | Project Health | 🟥 BLOCKER | `package.json` exists in the project root |
| `project.src-app.exists` | Project Health | 🟧 MAJOR | the conventional `src/app` layout is present |
| `dependencies.lockfile.exists` | Dependencies | 🟧 MAJOR | a lockfile is committed (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` or `bun.lockb`) |
| `scripts.build.exists` | Dependencies | 🟧 MAJOR | `package.json` defines a `build` script |

### Coming next 🔜

| Rule | Category | Checks |
|---|---|---|
| `scripts.test.exists` | Dependencies | `package.json` defines a `test` script |
| `modern.standalone-components.detected` | Modern Angular | standalone components are used |
| `modern.signals.detected` | Modern Angular | Angular signals (`signal`, `computed`, `effect`, `input`, `output`, `model`) are used |
| `architecture.feature-to-feature-imports` | Architecture | features don't import directly from other features |
| `maintainability.component-max-lines` | Maintainability | component files stay under a configurable line limit |
| `testing.spec-files.exists` | Testing | the project contains `.spec.ts` files |

After that: template rules, OnPush detection, `no-any`, lazy loading, e2e
detection and more — see the [roadmap](#-roadmap).

### Configuration 🔜

Rules will be configurable through `angular-governor.yml` (created by
`angular-governor init`):

```yaml
# angular-governor.yml
project:
  name: my-angular-app
thresholds:
  overall: 70
  componentMaxLines: 300
rules:
  disabled: []
  severityOverrides: {}
```

The rule engine already supports `disabled` and `severityOverrides`; loading
the YAML file ships together with the `init` command.

## 🧮 Scoring

Scoring is simple and transparent:

1. Every category in which at least one rule ran starts at **100**.
2. Each finding subtracts points from its category:

   | Severity | Penalty |
   |---|---:|
   | 🟥 BLOCKER | −40 |
   | 🟧 MAJOR | −20 |
   | 🟨 MINOR | −8 |
   | 🟦 INFO | −1 |

3. A category score never drops below **0**.
4. The **overall score** is the average of all executed category scores.

Categories without any executed rules don't count, so a project is never
penalized for checks that weren't run.

## 🤖 GitHub Action

> 🔜 Planned — the action wrapper is part of the MVP and lands after the
> dashboard.

```yaml
name: Angular Governor
on:
  pull_request:
  push:
    branches:
      - main
jobs:
  angular-governor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Angular Governor
        uses: ChrisvDalen/angular-governor-action@v1
        with:
          path: '.'
          fail-on-blocker: true
          min-score: 70
```

The action runs a scan, **fails the build** when the overall score drops below
`min-score` or when blocker findings exist (with `fail-on-blocker: true`), and
uploads the `.angular-governor/` reports as a build artifact.

## 🛠 Development

Angular Governor is a pnpm monorepo:

```text
angular-governor/
├── packages/
│   ├── cli/            # CLI commands and orchestration
│   ├── core/           # Domain model, scanner, scoring, fs abstraction
│   ├── rules/          # All rule implementations
│   ├── reporters/      # JSON & Markdown report generation
│   ├── dashboard/      # Static HTML dashboard generator (planned)
│   └── github-action/  # GitHub Action wrapper (planned)
├── examples/           # Demo Angular app for scan testing (planned)
└── docs/
```

```bash
pnpm install
pnpm build    # builds all packages (TypeScript, strict mode)
pnpm test     # runs all Vitest suites

# run the CLI against any Angular project
node packages/cli/dist/bin.js scan <path-to-angular-project>
```

### Design principles

- **Rules return findings, nothing else.** No console output from rules or the
  scanner — presentation belongs to the CLI and reporters.
- **Scanning and reporting are separate.** The scanner produces a
  `GovernorReport`; reporters serialize it.
- **File system access is abstracted** behind a `FileSystem` interface, so
  every reporter and rule is testable in memory.
- **Small, independently testable units.** Every rule ships with its own spec.

### Writing a rule

A rule is a plain object implementing the `Rule` interface:

```ts
import type { Rule } from '@angular-governor/core';

export const myRule: Rule = {
  id: 'category.my-rule',
  name: 'My rule',
  category: 'PROJECT_HEALTH',
  defaultSeverity: 'MINOR',
  async run(context) {
    // inspect context.files / context.packageJson / context.angularJson
    return []; // return findings, never print
  },
};
```

Register it in `packages/rules/src/index.ts` and add a spec next to it.

## 🗺 Roadmap

- [x] pnpm monorepo, strict TypeScript, Vitest
- [x] Core domain model (`GovernorReport`, `Finding`, `Rule`, `ScanContext`)
- [x] File discovery and Angular project detection
- [x] Rule engine with disable & severity overrides
- [x] First 5 rules (project health & dependencies)
- [x] Severity-based scoring
- [x] JSON report (`.angular-governor/report.json`)
- [x] `scan` CLI command
- [ ] Markdown report (`report.md`)
- [ ] Remaining first-10 rules (signals, standalone, architecture, max-lines, specs)
- [ ] Static HTML dashboard (`dashboard.html`)
- [ ] `report`, `rules list` and `init` commands + YAML config loading
- [ ] GitHub Action with `min-score` / `fail-on-blocker` gates
- [ ] Demo Angular app with intentional violations
- [ ] npm publish (`npx angular-governor scan .`)
- [ ] Extended rule set: templates, OnPush, `no-any`, lazy loading, e2e, harnesses

## 📄 License

**All rights reserved.** Copyright (c) 2026 Chris van Dalen.

This project is source-available for reading, but it is not open source. No
permission is granted to use, copy, modify or distribute it. Licensing terms
may be announced later.
