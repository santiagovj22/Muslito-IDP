import Link from 'next/link';
import { ArrowRight, Code2, Box, BookOpen, Zap, Shield, GitBranch } from 'lucide-react';
import { scaffolds, blueprints } from '@/data/catalog';
import { ScaffoldCard } from '@/components/catalog/ScaffoldCard';
import { BlueprintCard } from '@/components/catalog/BlueprintCard';

const features = [
  {
    icon: Zap,
    title: 'Zero setup time',
    description: 'Get a production-ready service running locally in under 5 minutes. No more fighting with boilerplate.',
  },
  {
    icon: Shield,
    title: 'Security baked in',
    description: 'CORS, rate limiting, XSS protection, input sanitization, and Helmet headers — all pre-configured.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD out of the box',
    description: 'GitHub Actions and GitLab CI pipelines for lint, test, security scan, build, and deploy.',
  },
] as const;

export default function HomePage() {
  const featuredScaffolds = scaffolds.slice(0, 2);
  const featuredBlueprints = blueprints.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-gray-900 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-200 ring-1 ring-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Muslitos Internal Developer Platform
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Ship faster with{' '}
            <span className="bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">
              golden paths
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-100">
            Stop wasting time configuring things, while Muslitos handles the heavy lifting.
            eat fried chicken meanwhile you ship
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/scaffolds"
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl"
            >
              <Code2 className="h-4 w-4" />
              Browse Scaffolds
            </Link>
            <Link
              href="/blueprints"
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Box className="h-4 w-4" />
              View Blueprints
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-brand-200">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">{scaffolds.length}</span> scaffolds
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">{blueprints.length}</span> blueprints
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-white">2</span> CI/CD platforms
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scaffolds section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Scaffolds</h2>
              <p className="mt-1 text-sm text-gray-500">
                Production-ready starting points for backend services.
              </p>
            </div>
            <Link
              href="/scaffolds"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {featuredScaffolds.map((s) => (
              <ScaffoldCard key={s.id} scaffold={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Blueprints section */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Infrastructure Blueprints</h2>
              <p className="mt-1 text-sm text-gray-500">
                AWS CDK patterns, ready to deploy.
              </p>
            </div>
            <Link
              href="/blueprints"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBlueprints.map((b) => (
              <BlueprintCard key={b.id} blueprint={b} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl bg-brand-700 px-8 py-12 text-center text-white">
            <BookOpen className="mx-auto mb-4 h-8 w-8 text-brand-300" />
            <h2 className="text-2xl font-bold">New to the IDP?</h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-200">
              Check out the docs to learn how to use scaffolds, deploy blueprints with the CLI, and contribute
              new golden paths to the platform.
            </p>
            <Link
              href="/docs"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
