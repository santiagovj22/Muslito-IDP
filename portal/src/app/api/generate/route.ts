import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { getScaffold } from '@/data/catalog';

interface GenerateRequest {
  scaffoldId: string;
  name: string;
  description: string;
}

// Directories to skip when building the ZIP (never ship these)
const SKIP_DIRS = new Set([
  'node_modules',
  '.venv',
  'venv',
  'dist',
  '__pycache__',
  '.next',
  '.git',
  'coverage',
  '.mypy_cache',
  '.ruff_cache',
  '.pytest_cache',
]);

// Binary file extensions — copy as-is, skip token replacement
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot',
  '.zip', '.tar', '.gz',
  '.pdf', '.bin',
]);

/**
 * Recursively collect all files under `dir`.
 * Returns paths relative to the scaffold root.
 */
async function collectFiles(dir: string, base: string = dir): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectFiles(fullPath, base);
      results.push(...nested);
    } else {
      results.push(path.relative(base, fullPath));
    }
  }

  return results;
}

/**
 * Replace scaffold template tokens in a text string.
 */
function applyTokens(content: string, name: string, description: string): string {
  return content
    .replaceAll('{{SERVICE_NAME}}', name)
    .replaceAll('{{SERVICE_DESCRIPTION}}', description);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Partial<GenerateRequest>;
    const { scaffoldId, name, description } = body;

    if (!scaffoldId || !name || !description) {
      return NextResponse.json(
        { error: 'scaffoldId, name, and description are required' },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]{2,50}$/.test(name)) {
      return NextResponse.json(
        { error: 'name must be 2–50 chars, lowercase letters, numbers, hyphens only' },
        { status: 400 },
      );
    }

    const scaffold = getScaffold(scaffoldId);
    if (!scaffold) {
      return NextResponse.json({ error: `Unknown scaffold: ${scaffoldId}` }, { status: 404 });
    }

    // Resolve scaffold directory relative to the Next.js project root.
    // Portal lives at  idp/portal/   → process.cwd() = .../idp/portal
    // Scaffolds live at idp/scaffolds/<id>/
    const scaffoldDir = path.join(process.cwd(), '..', 'scaffolds', scaffoldId);

    // Verify the directory exists
    try {
      const info = await stat(scaffoldDir);
      if (!info.isDirectory()) throw new Error('not a directory');
    } catch {
      return NextResponse.json(
        { error: `Scaffold source directory not found for "${scaffoldId}"` },
        { status: 500 },
      );
    }

    // Collect all file paths (relative to scaffold root)
    const filePaths = await collectFiles(scaffoldDir);

    // Build ZIP
    const zip = new JSZip();
    const folder = zip.folder(name)!;

    for (const relativePath of filePaths) {
      const fullPath = path.join(scaffoldDir, relativePath);
      const ext = path.extname(relativePath).toLowerCase();

      if (BINARY_EXTENSIONS.has(ext)) {
        // Binary — copy raw bytes
        const bytes = await readFile(fullPath);
        folder.file(relativePath, bytes);
      } else {
        // Text — apply token replacement
        const text = await readFile(fullPath, 'utf8');
        folder.file(relativePath, applyTokens(text, name, description));
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${name}.zip"`,
      },
    });
  } catch (err) {
    console.error('Generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
