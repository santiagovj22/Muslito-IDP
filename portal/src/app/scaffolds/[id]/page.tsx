import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Terminal, FolderTree, Layers } from 'lucide-react';
import { getScaffold, scaffolds } from '@/data/catalog';
import { Badge } from '@/components/ui/Badge';
import { GeneratorWizard } from '@/components/catalog/GeneratorWizard';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return scaffolds.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scaffold = getScaffold(params.id);
  if (!scaffold) return {};
  return {
    title: scaffold.name,
    description: scaffold.description,
  };
}

export default function ScaffoldDetailPage({ params }: Props) {
  const scaffold = getScaffold(params.id);
  if (!scaffold) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Back */}
      <Link
        href="/scaffolds"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to scaffolds
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column — detail */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title block */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {scaffold.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="default" />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{scaffold.name}</h1>
            <p className="mt-2 max-w-2xl text-gray-500 leading-relaxed">{scaffold.description}</p>
          </div>

          {/* Features */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">What's included</h2>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {scaffold.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-green-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {/* Tech stack */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tech stack</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Tool</th>
                    <th className="px-4 py-3 text-left font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {scaffold.stack.map(({ tool, purpose }) => (
                    <tr key={tool} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-800">{tool}</td>
                      <td className="px-4 py-3 text-gray-500">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quickstart */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Quick start</h2>
            </div>
            <div className="space-y-2">
              {scaffold.quickstart.map(({ label, command }, i) => (
                <div key={label} className="flex items-start gap-3 rounded-lg bg-gray-900 px-4 py-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <code className="font-mono text-sm text-green-400">{command}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project structure */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Project structure</h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Path</th>
                    <th className="px-4 py-3 text-left font-medium">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {scaffold.structure.map(({ path, description }) => (
                    <tr key={path} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-brand-700">{path}</td>
                      <td className="px-4 py-3 text-gray-500">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right column — generator */}
        <div>
          <div className="sticky top-24">
            <GeneratorWizard scaffoldId={scaffold.id} scaffoldName={scaffold.name} />

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
              <p className="font-medium text-gray-700">What you get</p>
              <p className="mt-1">
                A <code className="font-mono">.zip</code> with all files pre-configured and ready to{' '}
                <code className="font-mono">npm install</code> (or <code className="font-mono">poetry install</code>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
