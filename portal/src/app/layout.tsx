import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/ui/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'IDP — Muslitos plataforma de desarrollo interno',
    template: '%s | IDP',
  },
  description: 'Golden paths and paved roads for engineering teams. Scaffolds, blueprints, and one-click infrastructure.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
