import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Code2, Box, Terminal, GitBranch, ArrowRight, Puzzle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Docs',
  description: 'Internal Developer Platform documentation — getting started, scaffolds, blueprints, and CLI.',
};

const sections = [
  {
    icon: Terminal,
    title: 'Getting Started',
    href: '/docs/getting-started',
    description: 'Install the IDP CLI, generate your first scaffold, and deploy a blueprint in under 10 minutes.',
  },
  {
    icon: Code2,
    title: 'Scaffolds',
    href: '/docs/scaffolds',
    description: 'Learn the layered architecture used in every scaffold, how to extend it, and how to add new routes.',
  },
  {
    icon: Box,
    title: 'Blueprints',
    href: '/docs/blueprints',
    description: 'Understand the CDK patterns, environment-specific behaviour, and how to pass context keys.',
  },
  {
    icon: GitBranch,
    title: 'CI/CD Pipelines',
    href: '/docs/pipelines',
    description: 'How the GitHub Actions and GitLab CI pipelines work, what secrets to set, and how to extend them.',
  },
  {
    icon: Terminal,
    title: 'IDP CLI',
    href: '/docs/cli',
    description: 'Full reference for the idp CLI — scaffold commands, blueprint commands, and configuration.',
  },
  {
    icon: Puzzle,
    title: 'Contributing',
    href: '/docs/contributing',
    description: 'How to propose new scaffolds or blueprints, the review process, and coding conventions.',
  },
] as const;

const quickLinks = [
  { label: 'idp scaffold new', href: '/docs/cli#scaffold-new' },
  { label: 'idp blueprint deploy', href: '/docs/cli#blueprint-deploy' },
  { label: 'Environment variables', href: '/docs/scaffolds#env-vars' },
  { label: 'Adding a route', href: '/docs/scaffolds#adding-routes' },
  { label: 'CDK context keys', href: '/docs/blueprints#context' },
  { label: 'Pipeline secrets', href: '/docs/pipelines#secrets' },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-brand-600">
          <BookOpen className="h-4 w-4" />
          Documentation
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Everything you need to ship faster</h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">
          Learn how to use scaffolds, deploy blueprints, configure CI/CD, and contribute new golden paths
          to the platform.
        </p>
      </div>

      {/* Quick links */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white px-6 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick links</p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-gray-200 px-3 py-1.5 font-mono text-xs text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Doc sections */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ icon: Icon, title, href, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-400 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <Icon className="h-5 w-5 text-brand-600" />
            </div>
            <h2 className="mb-1 font-semibold text-gray-900 group-hover:text-brand-700">{title}</h2>
            <p className="flex-1 text-sm leading-relaxed text-gray-500">{description}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600">
              Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Getting started callout */}
      <div className="mt-12 rounded-2xl bg-gray-900 px-8 py-10 text-white">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">New here? Start in 5 minutes.</h2>
            <p className="mt-1 text-sm text-gray-400">
              Install the CLI, generate a Node.js scaffold, and have a running API with a health endpoint.
            </p>
          </div>
          <div className="shrink-0 space-y-2">
            <div className="rounded-lg bg-gray-800 px-4 py-2.5">
              <code className="font-mono text-xs text-green-400">npm install -g @company/idp</code>
            </div>
            <div className="rounded-lg bg-gray-800 px-4 py-2.5">
              <code className="font-mono text-xs text-green-400">idp scaffold new</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
