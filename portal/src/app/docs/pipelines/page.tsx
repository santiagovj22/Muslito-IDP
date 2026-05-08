import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CI/CD Pipelines',
  description: 'How the GitHub Actions and GitLab CI pipelines work, what secrets to set, and how to extend them.',
};

const githubSecrets = [
  { secret: 'AWS_ACCESS_KEY_ID', scope: 'CD only', description: 'IAM user access key for deploying to AWS.' },
  { secret: 'AWS_SECRET_ACCESS_KEY', scope: 'CD only', description: 'IAM user secret key.' },
  { secret: 'AWS_REGION', scope: 'CD only', description: 'Target AWS region (e.g. us-east-1).' },
  { secret: 'ECR_REGISTRY', scope: 'CD only', description: 'ECR registry URL (e.g. 123456.dkr.ecr.us-east-1.amazonaws.com).' },
  { secret: 'SNYK_TOKEN', scope: 'CI optional', description: 'Snyk API token for security scanning. Pipeline passes without it.' },
];

const gitlabVars = [
  { variable: 'AWS_ACCESS_KEY_ID', scope: 'CD only', description: 'Same as GitHub.' },
  { variable: 'AWS_SECRET_ACCESS_KEY', scope: 'CD only', description: 'Same as GitHub.' },
  { variable: 'AWS_REGION', scope: 'CD only', description: 'Same as GitHub.' },
  { variable: 'ECR_REGISTRY', scope: 'CD only', description: 'Same as GitHub.' },
];

const nodeStages = [
  { stage: 'lint', description: 'ESLint + Prettier check. Fails fast on style violations.' },
  { stage: 'typecheck', description: 'tsc --noEmit. Catches type errors without building.' },
  { stage: 'test:unit', description: 'Vitest unit tests with coverage threshold (≥80%).' },
  { stage: 'test:integration', description: 'Spins up Docker Compose, runs integration suite.' },
  { stage: 'security', description: 'npm audit + Snyk scan (non-blocking if no token).' },
  { stage: 'build', description: 'Multi-stage Docker build, tagged with commit SHA.' },
  { stage: 'push', description: 'Push image to ECR. Main branch only.' },
  { stage: 'deploy', description: 'Trigger CDK deploy for target environment. Main branch only.' },
];

const pythonStages = [
  { stage: 'lint', description: 'ruff check + black --check.' },
  { stage: 'typecheck', description: 'mypy with strict mode.' },
  { stage: 'test:unit', description: 'pytest unit tests with ≥80% coverage.' },
  { stage: 'test:integration', description: 'pytest integration suite with Docker Compose.' },
  { stage: 'security', description: 'bandit static analysis + safety dependency check.' },
  { stage: 'build', description: 'Multi-stage Docker build with Poetry.' },
  { stage: 'push', description: 'Push to ECR. Main branch only.' },
  { stage: 'deploy', description: 'CDK deploy. Main branch only.' },
];

const slackJobExample = [
  '  notify:',
  '    needs: [deploy]',
  '    runs-on: ubuntu-latest',
  '    if: success()',
  '    steps:',
  '      - name: Notify Slack',
  '        uses: slackapi/slack-github-action@v1',
  '        with:',
  "          payload: '{\"text\": \"Deployed ${{ github.sha }} to production\"}'",
  '        env:',
  '          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}',
].join('\n');

export default function PipelinesDocPage() {
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
          <GitBranch className="h-4 w-4" />
          CI/CD Pipelines
        </div>
        <h1 className="text-3xl font-bold text-gray-900">CI/CD pipelines</h1>
        <p className="mt-2 text-gray-500">
          Every scaffold ships with both GitHub Actions and GitLab CI pipelines pre-configured.
          This page explains the stages, what secrets to set, and how to extend the pipelines.
        </p>
      </div>

      <div className="space-y-12">

        {/* Pipeline files */}
        <section id="files">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Pipeline files</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">File</th>
                  <th className="px-4 py-3 text-left font-medium">Platform</th>
                  <th className="px-4 py-3 text-left font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  { file: '.github/workflows/ci.yml', platform: 'GitHub Actions', purpose: 'Runs on every push and PR — lint, test, security scan, build.' },
                  { file: '.github/workflows/cd.yml', platform: 'GitHub Actions', purpose: 'Runs on merge to main — push to ECR, deploy to AWS.' },
                  { file: '.gitlab-ci.yml', platform: 'GitLab CI', purpose: 'Combined CI + CD pipeline with environment-gated deploy job.' },
                ].map(({ file, platform, purpose }) => (
                  <tr key={file} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-brand-700">{file}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{platform}</td>
                    <td className="px-4 py-3 text-gray-500">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pipeline stages */}
        <section id="stages">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Pipeline stages</h2>
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Node.js</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Stage</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {nodeStages.map(({ stage, description }) => (
                      <tr key={stage} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-brand-700">{stage}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Python / FastAPI</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Stage</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {pythonStages.map(({ stage, description }) => (
                      <tr key={stage} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-brand-700">{stage}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Secrets */}
        <section id="secrets">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Required secrets</h2>
          <p className="mb-2 text-sm text-gray-500">
            CI stages (lint, test, security) need no secrets. Only the CD deploy stages require AWS credentials.
          </p>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">GitHub Actions — Settings → Secrets → Actions</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Secret</th>
                      <th className="px-4 py-3 text-left font-medium">Scope</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {githubSecrets.map(({ secret, scope, description }) => (
                      <tr key={secret} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{secret}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{scope}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">GitLab CI — Settings → CI/CD → Variables</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Variable</th>
                      <th className="px-4 py-3 text-left font-medium">Scope</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {gitlabVars.map(({ variable, scope, description }) => (
                      <tr key={variable} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{variable}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{scope}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              Use an IAM user with the minimum required permissions for your blueprint (e.g. only Lambda + DynamoDB for{' '}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">apigw-lambda-dynamodb</code>).
              Never use root credentials in CI.
            </span>
          </div>
        </section>

        {/* Extending pipelines */}
        <section id="extending">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Extending a pipeline</h2>
          <p className="mb-4 text-sm text-gray-500">
            To add a new job, append it to the relevant workflow file. Keep these rules in mind:
          </p>
          <ul className="space-y-2">
            {[
              'Add new CI jobs (e.g. e2e tests) to ci.yml — they run on every push.',
              'Add new CD jobs (e.g. notify Slack on deploy) to cd.yml after the deploy step.',
              'Use needs: [deploy] to make notification jobs depend on a successful deploy.',
              'Mark optional jobs with continue-on-error: true so they never block a release.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-gray-900 px-4 py-4">
            <p className="mb-2 text-xs text-gray-500"># Example: add a Slack notification after deploy (GitHub Actions)</p>
            <pre className="font-mono text-xs text-green-400">{slackJobExample}</pre>
          </div>
        </section>

        {/* Nav */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
          <Link href="/docs/blueprints" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Blueprints
          </Link>
          <Link href="/docs/cli" className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            CLI Reference <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
