'use client';

import { useState } from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratorWizardProps {
  scaffoldId: string;
  scaffoldName: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export const GeneratorWizard = ({ scaffoldId, scaffoldName }: GeneratorWizardProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isValid = name.trim().length >= 2 && /^[a-z0-9-]+$/.test(name.trim());

  const handleGenerate = async () => {
    if (!isValid) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scaffoldId,
          name: name.trim(),
          description: description.trim() || `${name.trim()} service`,
        }),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? 'Generation failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.trim()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-gray-900">Generate this scaffold</h2>
      <p className="mb-5 text-sm text-gray-500">
        Fill in the details and download a ready-to-use ZIP.
      </p>

      <div className="space-y-4">
        {/* Service name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Service name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="my-service"
            value={name}
            onChange={(e) => { setName(e.target.value); setStatus('idle'); }}
            className={cn(
              'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
              'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
              !isValid && name.length > 0 ? 'border-red-300' : 'border-gray-300',
            )}
          />
          {name.length > 0 && !isValid && (
            <p className="mt-1 text-xs text-red-500">
              Use lowercase letters, numbers, and hyphens only (min 2 chars)
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            placeholder={`${scaffoldName} backend service`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!isValid || status === 'loading'}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
            isValid && status !== 'loading'
              ? 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
              : 'cursor-not-allowed bg-gray-100 text-gray-400',
          )}
        >
          {status === 'loading' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
          ) : status === 'success' ? (
            <><CheckCircle className="h-4 w-4 text-green-400" /> Downloaded!</>
          ) : (
            <><Download className="h-4 w-4" /> Download ZIP</>
          )}
        </button>

        {status === 'error' && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMsg}</p>
        )}

        {status === 'success' && (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            <strong>{name}.zip</strong> downloaded. Run <code className="font-mono">npm install</code> (or <code className="font-mono">poetry install</code>) to get started.
          </div>
        )}
      </div>
    </div>
  );
};
