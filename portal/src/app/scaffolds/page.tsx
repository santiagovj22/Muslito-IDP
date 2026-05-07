import type { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import { scaffolds } from '@/data/catalog';
import { ScaffoldCard } from '@/components/catalog/ScaffoldCard';

export const metadata: Metadata = {
  title: 'Scaffolds',
  description: 'Production-ready service scaffolds for Node.js, Python, and more.',
};

export default function ScaffoldsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-brand-600">
          <Code2 className="h-4 w-4" />
          Service Scaffolds
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Pick your starting point</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Each scaffold is a production-ready template with layered architecture, error handling, logging,
          security middleware, tests, and a CI/CD pipeline already wired up. Just add your business logic.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 flex flex-wrap gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-900">{scaffolds.length}</span> scaffolds available
        </span>
        <span className="text-gray-300">|</span>
        {['Node.js', 'Python'].map((lang) => (
          <span key={lang} className="text-gray-500">
            <span className="font-semibold text-gray-900">
              {scaffolds.filter((s) => s.language === lang).length}
            </span>{' '}
            {lang}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {scaffolds.map((scaffold) => (
          <ScaffoldCard key={scaffold.id} scaffold={scaffold} />
        ))}
      </div>

      {/* Coming soon callout */}
      <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-gray-500">More scaffolds coming soon</p>
        <p className="mt-1 text-xs text-gray-400">
          Go (Gin), Java (Spring Boot), .NET (Minimal API) — or{' '}
          <a href="/docs/contributing" className="text-brand-600 underline hover:text-brand-700">
            contribute your own
          </a>
          .
        </p>
      </div>
    </div>
  );
}
