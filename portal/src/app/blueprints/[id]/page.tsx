import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Terminal, Settings, Network, CheckCircle } from 'lucide-react';
import { getBlueprint, blueprints } from '@/data/catalog';
import { Badge } from '@/components/ui/Badge';
import { DeployBlock } from '@/components/catalog/DeployBlock';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return blueprints.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blueprint = getBlueprint(params.id);
  if (!blueprint) return {};
  return {
    title: blueprint.name,
    description: blueprint.description,
  };
}

const categoryVariant = {
  serverless: 'purple',
  containers: 'default',
  addon: 'amber',
  data: 'green',
} as const;

export default function BlueprintDetailPage({ params }: Props) {
  const blueprint = getBlueprint(params.id);
  if (!blueprint) notFound();

  const variant = categoryVariant[blueprint.category] ?? 'default';

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Back */}
      <Link
        href="/blueprints"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to blueprints
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — detail */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge label={blueprint.category} variant={variant} />
              {blueprint.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="default" />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{blueprint.name}</h1>
            <p className="mt-2 max-w-2xl text-gray-500 leading-relaxed">{blueprint.description}</p>
          </div>

          {/* Resources */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">What gets created</h2>
            </div>
            <ul className="space-y-2">
              {blueprint.resources.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-green-500">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* Architecture */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Network className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Architecture</h2>
            </div>
            <div className="rounded-xl bg-gray-900 px-6 py-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400">
                {blueprint.architecture}
              </pre>
            </div>
          </section>

          {/* Configuration */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Configuration keys</h2>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Pass these via <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">-c key=value</code> on the CDK deploy command.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Key</th>
                    <th className="px-4 py-3 text-left font-medium">Default</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {blueprint.configKeys.map(({ key, default: def, description }) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{key}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{def}</td>
                      <td className="px-4 py-3 text-gray-500">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right — deploy */}
        <div>
          <div className="sticky top-24 space-y-4">
            {/* Deploy command card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-brand-600" />
                <h2 className="text-base font-semibold text-gray-900">Deploy</h2>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Make sure you have the AWS CDK installed and credentials configured.
              </p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">1. Clone the blueprints repo</p>
                <div className="rounded-lg bg-gray-900 px-3 py-2.5">
                  <code className="font-mono text-xs text-green-400">
                    cd blueprints/{blueprint.id}
                  </code>
                </div>

                <p className="mt-3 text-xs font-medium text-gray-600">2. Install dependencies</p>
                <div className="rounded-lg bg-gray-900 px-3 py-2.5">
                  <code className="font-mono text-xs text-green-400">npm install</code>
                </div>

                <p className="mt-3 text-xs font-medium text-gray-600">3. Deploy</p>
                <DeployBlock command={blueprint.deployCommand} />
              </div>
            </div>

            {/* CDK guide callout */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
              <p className="font-medium text-gray-700">First time with CDK?</p>
              <p className="mt-1">
                Run <code className="font-mono">cdk bootstrap</code> once per AWS account + region before
                deploying. See{' '}
                <a
                  href="https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline"
                >
                  CDK bootstrapping docs
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
