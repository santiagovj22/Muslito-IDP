import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Terminal, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Install the IDP CLI, generate your first scaffold, and deploy a blueprint in under 10 minutes.',
};

const steps = [
  {
    number: '01',
    title: 'Prerequisites',
    content: (
      <ul className="space-y-2 text-sm text-gray-600">
        {[
          'Node.js ≥ 20 installed',
          'Git installed',
          'AWS CLI configured (only needed for blueprint deployment)',
          'AWS CDK v2 installed: npm install -g aws-cdk (only for blueprints)',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function GettingStartedPage() {
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
          <Terminal className="h-4 w-4" />
          Getting Started
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Up and running in 10 minutes</h1>
        <p className="mt-2 text-gray-500">
          Install the CLI, generate a production-ready service scaffold, and have a running health endpoint — no configuration required.
        </p>
      </div>

      <div className="space-y-10">

        {/* Step 1 — Prerequisites */}
        <section id="prerequisites">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">1</span>
            <h2 className="text-xl font-semibold text-gray-900">Prerequisites</h2>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Node.js ≥ 20',
                'Git',
                'AWS CLI configured with valid credentials (blueprints only)',
                'AWS CDK v2 — npm install -g aws-cdk (blueprints only)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/(npm install -g aws-cdk)/g, '<code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">$1</code>') }} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Step 2 — Install CLI */}
        <section id="install">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">2</span>
            <h2 className="text-xl font-semibold text-gray-900">Install the IDP CLI</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Clone the IDP monorepo, build the CLI, and link it globally. You only do this once.
          </p>
          <div className="space-y-2">
            {[
              { label: 'Go to the CLI directory', cmd: 'cd path/to/Muslito-IDP/cli' },
              { label: 'Install dependencies', cmd: 'npm install' },
              { label: 'Build', cmd: 'npm run build' },
              { label: 'Link globally', cmd: 'npm link' },
              { label: 'Verify', cmd: 'idp --help' },
            ].map(({ label, cmd }, i) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <code className="font-mono text-sm text-green-400">{cmd}</code>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>
              After editing CLI source code, run <code className="rounded bg-amber-100 px-1 font-mono text-xs">npm run build</code> again inside{' '}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">cli/</code>. No need to re-link.
            </span>
          </div>
        </section>

        {/* Step 3 — Generate scaffold */}
        <section id="generate">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">3</span>
            <h2 className="text-xl font-semibold text-gray-900">Generate your first service</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Pick a scaffold type and give your service a name. The CLI copies the template and replaces all tokens.
          </p>
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Node.js / Fastify</p>
              <div className="rounded-xl bg-gray-900 px-4 py-3">
                <code className="font-mono text-sm text-green-400">
                  idp scaffold new --type nodejs --name my-service
                </code>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Python / FastAPI</p>
              <div className="rounded-xl bg-gray-900 px-4 py-3">
                <code className="font-mono text-sm text-green-400">
                  idp scaffold new --type fastapi --name my-service
                </code>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            A <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">my-service/</code> folder
            is created in your current directory with all files pre-configured and a{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">.idp.json</code> manifest.
          </p>
        </section>

        {/* Step 4 — Run it */}
        <section id="run">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">4</span>
            <h2 className="text-xl font-semibold text-gray-900">Start the service</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Node.js */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-gray-700">Node.js / Fastify</p>
              <div className="space-y-2">
                {[
                  'cd my-service',
                  'npm install',
                  'cp .env.example .env',
                  'npm run dev',
                ].map((cmd) => (
                  <div key={cmd} className="rounded-lg bg-gray-900 px-3 py-2">
                    <code className="font-mono text-xs text-green-400">{cmd}</code>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Health check →{' '}
                <code className="font-mono">http://localhost:3000/api/v1/health</code>
              </p>
            </div>

            {/* FastAPI */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-gray-700">Python / FastAPI</p>
              <div className="space-y-2">
                {[
                  'cd my-service',
                  'poetry install',
                  'cp .env.example .env',
                  'uvicorn app.main:app --reload',
                ].map((cmd) => (
                  <div key={cmd} className="rounded-lg bg-gray-900 px-3 py-2">
                    <code className="font-mono text-xs text-green-400">{cmd}</code>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Health check →{' '}
                <code className="font-mono">http://localhost:8000/api/v1/health</code>
              </p>
            </div>
          </div>
        </section>

        {/* Step 5 — Optional: deploy blueprint */}
        <section id="blueprint">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-white">5</span>
            <h2 className="text-xl font-semibold text-gray-900">
              Deploy infrastructure{' '}
              <span className="text-sm font-normal text-gray-400">(optional)</span>
            </h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Pair your service with an AWS infrastructure blueprint. Requires AWS CDK and configured credentials.
          </p>
          <div className="space-y-2">
            {[
              { label: 'Go to the blueprint', cmd: 'cd path/to/Muslito-IDP/blueprints/apigw-lambda-dynamodb' },
              { label: 'Install CDK deps', cmd: 'npm install' },
              { label: 'Bootstrap (first time per account/region)', cmd: 'cdk bootstrap' },
              { label: 'Deploy', cmd: 'cdk deploy -c serviceName=my-service -c env=dev' },
            ].map(({ label, cmd }) => (
              <div key={label} className="rounded-lg bg-gray-900 px-4 py-3">
                <p className="mb-0.5 text-xs text-gray-500">{label}</p>
                <code className="font-mono text-sm text-green-400">{cmd}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-2xl bg-gray-900 px-8 py-8 text-white">
          <h2 className="mb-4 text-lg font-bold">What to read next</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Scaffold architecture', href: '/docs/scaffolds' },
              { label: 'Blueprint reference', href: '/docs/blueprints' },
              { label: 'CLI command reference', href: '/docs/cli' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3 text-sm text-gray-200 transition hover:bg-gray-700"
              >
                {label}
                <ArrowRight className="h-4 w-4 text-brand-400" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
