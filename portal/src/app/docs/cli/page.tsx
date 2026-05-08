import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CLI Reference',
  description: 'Full reference for the idp CLI — scaffold commands, blueprint commands, and configuration.',
};

const scaffoldCommands = [
  {
    command: 'idp scaffold list',
    description: 'List all available scaffolds with their version.',
    options: [],
    example: 'idp scaffold list',
  },
  {
    command: 'idp scaffold new',
    description: 'Generate a new service from a scaffold template.',
    options: [
      { flag: '--type, -t <type>', required: true, description: 'Scaffold type: nodejs | fastapi' },
      { flag: '--name, -n <name>', required: true, description: 'Service name. Used as the output folder name and as SERVICE_NAME token.' },
      { flag: '--output, -o <path>', required: false, description: 'Output directory. Defaults to current directory.' },
      { flag: '--description, -d <desc>', required: false, description: 'Service description. Defaults to "My service".' },
    ],
    example: 'idp scaffold new --type nodejs --name user-service --output ./services',
  },
  {
    command: 'idp scaffold check',
    description: 'Check if a generated service is up to date with the latest scaffold version. Reads .idp.json from the service directory.',
    options: [
      { flag: '--path, -p <path>', required: false, description: 'Path to the service directory. Defaults to current directory.' },
    ],
    example: 'idp scaffold check --path ./services/user-service',
  },
];

const blueprintCommands = [
  {
    command: 'idp blueprint list',
    description: 'List all available infrastructure blueprints.',
    options: [],
    example: 'idp blueprint list',
  },
  {
    command: 'idp blueprint info',
    description: 'Show details, resources, and configuration keys for a blueprint.',
    options: [
      { flag: '<blueprint-id>', required: true, description: 'Blueprint identifier (e.g. apigw-lambda-dynamodb).' },
    ],
    example: 'idp blueprint info apigw-lambda-dynamodb',
  },
  {
    command: 'idp blueprint deploy',
    description: 'Deploy a blueprint to AWS using CDK.',
    options: [
      { flag: '<blueprint-id>', required: true, description: 'Blueprint identifier.' },
      { flag: '--name <name>', required: true, description: 'Service name — used as the CDK serviceName context key.' },
      { flag: '--env <env>', required: true, description: 'Target environment: dev | staging | production.' },
      { flag: '--region <region>', required: false, description: 'AWS region. Defaults to AWS_DEFAULT_REGION.' },
    ],
    example: 'idp blueprint deploy apigw-lambda-dynamodb --name my-api --env dev --region us-east-1',
  },
];

export default function CliDocPage() {
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
          CLI Reference
        </div>
        <h1 className="text-3xl font-bold text-gray-900">IDP CLI reference</h1>
        <p className="mt-2 text-gray-500">
          Full reference for every <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">idp</code> command,
          flag, and option. For setup instructions see{' '}
          <Link href="/docs/getting-started" className="text-brand-600 hover:underline">Getting Started</Link>.
        </p>
      </div>

      <div className="space-y-12">

        {/* Global flags */}
        <section id="global">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Global flags</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Flag</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  { flag: '-V, --version', description: 'Print the CLI version and exit.' },
                  { flag: '-h, --help', description: 'Show help for the current command.' },
                ].map(({ flag, description }) => (
                  <tr key={flag} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-brand-700">{flag}</td>
                    <td className="px-4 py-3 text-gray-500">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scaffold commands */}
        <section id="scaffold">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">idp scaffold</h2>
          <div className="space-y-8">
            {scaffoldCommands.map(({ command, description, options, example }) => (
              <div key={command} id={command.replace(/\s+/g, '-')} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-semibold text-gray-900">
                      {command}
                    </code>
                    <p className="mt-2 text-sm text-gray-500">{description}</p>
                  </div>
                </div>

                {options.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Options</p>
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-400">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Flag</th>
                            <th className="px-3 py-2 text-left font-medium">Required</th>
                            <th className="px-3 py-2 text-left font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {options.map(({ flag, required, description: desc }) => (
                            <tr key={flag}>
                              <td className="px-3 py-2 font-mono text-xs text-brand-700">{flag}</td>
                              <td className="px-3 py-2 text-xs text-gray-400">{required ? 'Yes' : 'No'}</td>
                              <td className="px-3 py-2 text-xs text-gray-500">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Example</p>
                  <div className="rounded-lg bg-gray-900 px-4 py-3">
                    <code className="font-mono text-sm text-green-400">{example}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blueprint commands */}
        <section id="blueprint">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">idp blueprint</h2>
          <div className="space-y-8">
            {blueprintCommands.map(({ command, description, options, example }) => (
              <div key={command} id={command.replace(/\s+/g, '-')} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-3">
                  <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-semibold text-gray-900">
                    {command}
                  </code>
                  <p className="mt-2 text-sm text-gray-500">{description}</p>
                </div>

                {options.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Options</p>
                    <div className="overflow-hidden rounded-lg border border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-400">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium">Flag</th>
                            <th className="px-3 py-2 text-left font-medium">Required</th>
                            <th className="px-3 py-2 text-left font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {options.map(({ flag, required, description: desc }) => (
                            <tr key={flag}>
                              <td className="px-3 py-2 font-mono text-xs text-brand-700">{flag}</td>
                              <td className="px-3 py-2 text-xs text-gray-400">{required ? 'Yes' : 'No'}</td>
                              <td className="px-3 py-2 text-xs text-gray-500">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Example</p>
                  <div className="rounded-lg bg-gray-900 px-4 py-3">
                    <code className="font-mono text-sm text-green-400">{example}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* .idp.json reference */}
        <section id="idp-json">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">.idp.json manifest</h2>
          <p className="mb-4 text-sm text-gray-500">
            Written automatically into every generated service by{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">idp scaffold new</code>.
            Used by <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">idp scaffold check</code> to compare against the latest scaffold version.
          </p>
          <div className="rounded-xl bg-gray-900 px-4 py-4">
            <pre className="font-mono text-sm text-green-400">{`{
  "scaffold": "nodejs",
  "scaffoldVersion": "1.0.0",
  "generatedAt": "2026-05-07",
  "generatedBy": "idp-cli"
}`}</pre>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Commit this file to Git. It is the source of truth for which scaffold version the service was generated from.
          </p>
        </section>

        {/* Nav */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
          <Link href="/docs/pipelines" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Pipelines
          </Link>
          <Link href="/docs/contributing" className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            Contributing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
