import Link from 'next/link';
import { ArrowRight, Box, Layers, Puzzle, Database } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Blueprint } from '@/data/catalog';
import { cn } from '@/lib/utils';

const categoryConfig = {
  serverless: { icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'purple' as const },
  containers:  { icon: Box,    color: 'text-brand-600',  bg: 'bg-brand-50',  badge: 'default' as const },
  addon:       { icon: Puzzle, color: 'text-amber-600',  bg: 'bg-amber-50',  badge: 'amber' as const },
  data:        { icon: Database, color: 'text-green-600', bg: 'bg-green-50', badge: 'green' as const },
} as const;

interface BlueprintCardProps {
  blueprint: Blueprint;
}

export const BlueprintCard = ({ blueprint }: BlueprintCardProps) => {
  const { icon: Icon, color, bg, badge } = categoryConfig[blueprint.category];
  return (
    <Link
      href={`/blueprints/${blueprint.id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-400 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bg)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">{blueprint.name}</h3>
          <Badge label={blueprint.category} variant={badge} className="mt-0.5" />
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{blueprint.description}</p>

      <ul className="mb-4 space-y-1 text-xs text-gray-500">
        {blueprint.resources.slice(0, 3).map((r) => (
          <li key={r} className="flex items-start gap-1.5">
            <span className="mt-0.5 text-green-500">✓</span> {r}
          </li>
        ))}
        {blueprint.resources.length > 3 && (
          <li className="text-gray-400">+ {blueprint.resources.length - 3} more resources</li>
        )}
      </ul>

      <div className="flex items-center text-sm font-medium text-brand-600">
        View blueprint <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};
