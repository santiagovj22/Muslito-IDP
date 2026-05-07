import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Scaffold } from '@/data/catalog';

interface ScaffoldCardProps {
  scaffold: Scaffold;
}

export const ScaffoldCard = ({ scaffold }: ScaffoldCardProps) => (
  <Link
    href={`/scaffolds/${scaffold.id}`}
    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-400 hover:shadow-md"
  >
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
        <Code2 className="h-5 w-5 text-brand-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">{scaffold.name}</h3>
        <p className="text-xs text-gray-400">{scaffold.language} · {scaffold.framework}</p>
      </div>
    </div>

    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">{scaffold.description}</p>

    <div className="mb-4 flex flex-wrap gap-1.5">
      {scaffold.tags.map((tag) => (
        <Badge key={tag} label={tag} variant="default" />
      ))}
    </div>

    <div className="flex items-center text-sm font-medium text-brand-600 group-hover:gap-2">
      View scaffold <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);
