import type { Metadata } from 'next';
import { Box } from 'lucide-react';
import { blueprints } from '@/data/catalog';
import { BlueprintCard } from '@/components/catalog/BlueprintCard';

export const metadata: Metadata = {
  title: 'Blueprints',
  description: 'AWS CDK infrastructure blueprints, ready to deploy in minutes.',
};

const categoryLabels: Record<string, string> = {
  serverless: 'Serverless',
  containers: 'Containers',
  addon: 'Add-ons',
  data: 'Data',
};

export default function BlueprintsPage() {
  const categories = [...new Set(blueprints.map((b) => b.category))];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-brand-600">
          <Box className="h-4 w-4" />
          Infrastructure Blueprints
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AWS CDK patterns, ready to deploy</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Each blueprint is a fully-configured AWS CDK stack. Pick one, run the deploy command, and get
          production-grade infrastructure with alarms, encryption, and IAM least privilege — no guesswork.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 flex flex-wrap gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-900">{blueprints.length}</span> blueprints available
        </span>
        <span className="text-gray-300">|</span>
        {categories.map((cat) => (
          <span key={cat} className="text-gray-500">
            <span className="font-semibold text-gray-900">
              {blueprints.filter((b) => b.category === cat).length}
            </span>{' '}
            {categoryLabels[cat] ?? cat}
          </span>
        ))}
      </div>

      {/* Grouped by category */}
      {categories.map((category) => {
        const group = blueprints.filter((b) => b.category === category);
        return (
          <section key={category} className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">{categoryLabels[category] ?? category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((blueprint) => (
                <BlueprintCard key={blueprint.id} blueprint={blueprint} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Coming soon */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-gray-500">More blueprints coming soon</p>
        <p className="mt-1 text-xs text-gray-400">
          MSK (Kafka), OpenSearch, WAF + CloudFront, Aurora Serverless — or{' '}
          <a href="/docs/contributing" className="text-brand-600 underline hover:text-brand-700">
            contribute your own
          </a>
          .
        </p>
      </div>
    </div>
  );
}
