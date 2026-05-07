import Link from 'next/link';
import { Code2, Box, BookOpen, Terminal, Drumstick } from 'lucide-react';

const navLinks = [
  { href: '/scaffolds', label: 'Scaffolds', icon: Code2 },
  { href: '/blueprints', label: 'Blueprints', icon: Box },
  { href: '/docs', label: 'Docs', icon: BookOpen },
] as const;


export const Navbar = () => (
  <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
        <Drumstick className="h-5 w-5 text-brand-600" />
        <span>IDP</span>
        <span className="text-xs font-normal text-gray-400">Muslitos self service</span>
      </Link>

      <div className="flex items-center gap-6">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-brand-600"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  </nav>
);
