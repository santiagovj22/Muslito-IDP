import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Puzzle, CheckCircle, GitBranch, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contributing',
  description: 'How to propose new scaffolds or blueprints, the review process, and coding conventions.',
};

const scaffoldChecklist = [
  'Follows the same layered architecture (routes → controllers → services → DAL)',
  'Global error handler using the shared AppError class',
  'Structured logging with request-ID correlation',
  'Pino (Node.js) or structlog (Python) — no console.log or print()',
  'Zod (Node.js) or pydantic-settings (Python) for env var validation',
  'GET /api/v1/health endpoint returning status, version, uptime',
  'Standardized { success, data, message } response envelope',
  'Unit tests with ≥80% coverage',
  'Integration test for the health endpoint',
  'Multi-stage Dockerfile',
  'GitHub Actions ci.yml + cd.yml',
  'GitLab CI .gitlab-ci.yml',
  'scaffold.json with version and minCliVersion',
  'Updated catalog.ts in portal/src/data/',
];

const blueprintChecklist = [
  'AWS CDK TypeScript stack',
  'Accepts serviceName and env context keys',
  'Environment-aware sizing (dev vs production)',
  'IAM least-privilege roles — no wildcard actions',
  'CloudWatch Log Groups with retention policies',
  'CloudWatch Alarms for key failure signals',
  'README.md with architecture diagram and deploy command',
  'No hardcoded account IDs or regions',
  'Passes cdk synth without errors or warnings',
  'Updated catalog.ts in portal/src/data/',
];

const prProcess = [
  { step: '1', title: 'Open an issue first', body: 'Describe the scaffold or blueprint you want to add. Tag it with scaffold-proposal or blueprint-proposal. This avoids duplicate work.' },
  { step: '2', title: 'Fork and branch', body: 'Branch from main. Use the naming convention: feat/scaffold-<name> or feat/blueprint-<name>.' },
  { step: '3', title: 'Build and test locally', body: 'Run idp scaffold new --type <your-type> and verify the generated service starts clean. For blueprints, run cdk synth.' },
  { step: '4', title: 'Open a pull request', body: 'Include a description of what the scaffold/blueprint does, why it\'s useful, and a screenshot of it working. The checklist in this page is the review criteria.' },
  { step: '5', title: 'Review and merge', body: 'A platform team member reviews within 2 business days. Feedback is given inline. Once approved, squash-merge into main.' },
];

export default function ContributingDocPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/docs"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to docs
      </Link>

      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-600">
          <Puzzle className="h-4 w-4" />
          Contributing
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Contributing to the IDP</h1>
        <p className="mt-2 text-gray-500">
          The platform grows through contributions. Anyone on the engineering team can add a new scaffold or blueprint.
          This page explains the standards, checklists, and review process.
        </p>
      </div>

      <div className="space-y-12">

        {/* PR process */}
        <section id="process">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Contribution process</h2>
          </div>
          <div className="space-y-4">
            {prProcess.map(({ step, title, body }) => (
              <div key={step} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Adding a scaffold */}
        <section id="add-scaffold">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Adding a scaffold</h2>
          <p className="mb-4 text-sm text-gray-500">
            New scaffolds live in <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">scaffolds/{'<language>'}/</code>.
            Follow the existing Node.js or FastAPI scaffold as a reference.
          </p>

          <div className="mb-5 rounded-xl bg-gray-900 px-4 py-4">
            <p className="mb-2 text-xs text-gray-500"># Minimum required structure</p>
            <pre className="font-mono text-sm text-green-400">{`scaffolds/
└── my-language/
    ├── scaffold.json          ← version + minCliVersion
    ├── Dockerfile
    ├── docker-compose.yml
    ├── .env.example
    ├── .github/
    │   └── workflows/
    │       ├── ci.yml
    │       └── cd.yml
    ├── .gitlab-ci.yml
    └── src/  (or app/)        ← layered architecture`}</pre>
          </div>

          <p className="mb-3 text-sm font-semibold text-gray-700">Acceptance checklist</p>
          <ul className="space-y-2">
            {scaffoldChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-gray-700">Register in the CLI and portal</p>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs text-gray-400">cli/src/commands/scaffold.ts — add to SCAFFOLDS</p>
                <div className="rounded-xl bg-gray-900 px-4 py-3">
                  <pre className="font-mono text-xs text-green-400">{`'my-language': {
  name: 'My Language / Framework',
  description: 'Short description shown in idp scaffold list.',
  sourceDir: 'my-language',
},`}</pre>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-400">portal/src/data/catalog.ts — add to scaffolds array</p>
                <div className="rounded-xl bg-gray-900 px-4 py-3">
                  <pre className="font-mono text-xs text-green-400">{`{
  id: 'my-language',
  version: '1.0.0',
  name: 'My Language / Framework',
  language: 'My Language',
  framework: 'My Framework',
  description: '...',
  tags: [...],
  features: [...],
  stack: [...],
  quickstart: [...],
  structure: [...],
},`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Adding a blueprint */}
        <section id="add-blueprint">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Adding a blueprint</h2>
          <p className="mb-4 text-sm text-gray-500">
            New blueprints live in <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">blueprints/{'<id>'}/</code>.
            Follow the <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">apigw-lambda-dynamodb</code> blueprint as a reference.
          </p>

          <div className="mb-5 rounded-xl bg-gray-900 px-4 py-4">
            <p className="mb-2 text-xs text-gray-500"># Minimum required structure</p>
            <pre className="font-mono text-sm text-green-400">{`blueprints/
└── my-blueprint/
    ├── README.md
    ├── package.json
    ├── cdk.json
    ├── bin/
    │   └── my-blueprint.ts    ← CDK app entry point
    └── lib/
        └── stack.ts           ← CDK stack definition`}</pre>
          </div>

          <p className="mb-3 text-sm font-semibold text-gray-700">Acceptance checklist</p>
          <ul className="space-y-2">
            {blueprintChecklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Versioning */}
        <section id="versioning">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Versioning scaffolds</h2>
          <p className="mb-4 text-sm text-gray-500">
            When you update an existing scaffold, bump its version in{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">scaffold.json</code> and update the
            matching entry in <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">portal/src/data/catalog.ts</code>.
            Use semantic versioning:
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Change type</th>
                  <th className="px-4 py-3 text-left font-medium">Version bump</th>
                  <th className="px-4 py-3 text-left font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  { type: 'Breaking structural change', bump: 'Major (x.0.0)', example: 'Rename src/dal/ to src/repositories/' },
                  { type: 'New feature or layer added', bump: 'Minor (1.x.0)', example: 'Add rate limiting middleware' },
                  { type: 'Dependency update or bug fix', bump: 'Patch (1.0.x)', example: 'Update Fastify to 4.27.0' },
                ].map(({ type, bump, example }) => (
                  <tr key={type} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-700">{bump}</td>
                    <td className="px-4 py-3 text-gray-500">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Scaffolds are not automatically applied to existing services. A version bump triggers a notice in{' '}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">idp scaffold check</code> — teams upgrade manually on their own timeline.
            </span>
          </div>
        </section>

        {/* Coding conventions */}
        <section id="conventions">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Coding conventions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'No console.log / print()', body: 'Use the scaffold\'s structured logger (Pino or structlog). Every log line must include a request ID when inside a request context.' },
              { title: 'No magic strings', body: 'Error codes, status values, and config keys go in constants or enums. Never inline a raw string like "NOT_FOUND".' },
              { title: 'One thing per file', body: 'Each route, controller, service, and repository file handles exactly one domain entity. Keep files small.' },
              { title: 'No circular imports', body: 'Lower layers (DAL, service) must never import from upper layers (controller, route). Enforce this with ESLint import/no-cycle.' },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="mb-1 font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nav */}
        <div className="flex items-center justify-start rounded-xl border border-gray-200 bg-white px-6 py-4">
          <Link href="/docs/cli" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> CLI Reference
          </Link>
        </div>
      </div>
    </div>
  );
}
