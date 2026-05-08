import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Box, Layers, Settings, Terminal, AlertCircle } from 'lucide-react';
import { blueprints } from '@/data/catalog';

export const metadata: Metadata = {
  title: 'Blueprints',
  description: 'Understand the CDK patterns, environment-specific behaviour, and how to pass context keys.',
};

const envBehavior = [
  { env: 'dev', description: 'Single-AZ, smaller instance sizes, no automated backups, logs retained 7 days.' },
  { env: 'staging', description: 'Mirrors prod configuration but smaller capacity. Full backups enabled.' },
  { env: 'production', description: 'Multi-AZ, full backups, extended log retention (90 days), stricter alarms.' },
];

export default function BlueprintsDocPage() {
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
          <Box className="h-4 w-4" />
          Blueprints
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Infrastructure blueprints</h1>
        <p className="mt-2 text-gray-500">
          Each blueprint is an AWS CDK stack written in TypeScript. It provisions a complete, production-ready
          infrastructure pattern with sensible defaults for each environment.
        </p>
      </div>

      <div className="space-y-12">

        {/* Available blueprints */}
        <section id="catalog">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Available blueprints</h2>
          </div>
          <div className="space-y-3">
            {blueprints.map((bp) => (
              <Link
                key={bp.id}
                href={`/blueprints/${bp.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-brand-400 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-gray-900">{bp.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{bp.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-500" />
              </Link>
            ))}
          </div>
        </section>

        {/* How to deploy */}
        <section id="deploy">
          <div className="mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">How to deploy</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            All blueprints follow the same deploy pattern. Replace <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">{'<blueprint-id>'}</code> with the folder name.
          </p>
          <div className="space-y-2">
            {[
              { label: 'Go to the blueprint directory', cmd: 'cd blueprints/<blueprint-id>' },
              { label: 'Install dependencies', cmd: 'npm install' },
              { label: 'Bootstrap (once per account + region)', cmd: 'cdk bootstrap aws://<account-id>/<region>' },
              { label: 'Preview changes', cmd: 'cdk diff -c serviceName=my-api -c env=dev' },
              { label: 'Deploy', cmd: 'cdk deploy -c serviceName=my-api -c env=dev' },
              { label: 'Destroy (when done)', cmd: 'cdk destroy -c serviceName=my-api -c env=dev' },
            ].map(({ label, cmd }) => (
              <div key={label} className="rounded-lg bg-gray-900 px-4 py-3">
                <p className="mb-0.5 text-xs text-gray-500">{label}</p>
                <code className="font-mono text-sm text-green-400">{cmd}</code>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <span>
              Run <code className="rounded bg-blue-100 px-1 font-mono text-xs">cdk diff</code> before{' '}
              <code className="rounded bg-blue-100 px-1 font-mono text-xs">cdk deploy</code> to review all changes before they are applied.
            </span>
          </div>
        </section>

        {/* Context keys */}
        <section id="context">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Context keys</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Blueprints are parameterized via CDK context. Pass values with{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">-c key=value</code> on the deploy command.
            Each blueprint&apos;s detail page lists its specific keys — but all blueprints share these two:
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Key</th>
                  <th className="px-4 py-3 text-left font-medium">Required</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  { key: 'serviceName', required: 'Yes', description: 'Prefix for all AWS resource names. Use kebab-case (e.g. user-api).' },
                  { key: 'env', required: 'Yes', description: 'Target environment: dev | staging | production. Drives sizing and backup policies.' },
                ].map(({ key, required, description }) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{key}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{required}</td>
                    <td className="px-4 py-3 text-gray-500">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Environment behaviour */}
        <section id="environments">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Environment behaviour</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            The <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">env</code> context key changes resource sizing and resilience settings automatically.
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">env</th>
                  <th className="px-4 py-3 text-left font-medium">Behaviour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {envBehavior.map(({ env, description }) => (
                  <tr key={env} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{env}</td>
                    <td className="px-4 py-3 text-gray-500">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CDK tips */}
        <section id="cdk-tips">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">CDK tips</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'cdk bootstrap',
                body: 'Must be run once per AWS account + region before the first deploy. Creates the S3 bucket and IAM roles CDK needs.',
              },
              {
                title: 'cdk diff',
                body: 'Shows exactly what will change before you apply it. Always run this in production before deploying.',
              },
              {
                title: 'cdk watch',
                body: 'Streams Lambda code changes without a full deploy. Useful in dev. Not for production use.',
              },
              {
                title: 'cdk destroy',
                body: 'Tears down the stack and all its resources. Use --force to skip confirmation in CI.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="mb-1 font-mono text-sm font-semibold text-brand-700">{title}</p>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nav */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
          <Link href="/docs/scaffolds" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Scaffolds
          </Link>
          <Link href="/docs/pipelines" className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            CI/CD Pipelines <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
