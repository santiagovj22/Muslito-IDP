import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-brand-100 text-brand-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
} as const;

interface BadgeProps {
  label: string;
  variant?: keyof typeof variants;
  className?: string;
}

export const Badge = ({ label, variant = 'default', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className,
    )}
  >
    {label}
  </span>
);
