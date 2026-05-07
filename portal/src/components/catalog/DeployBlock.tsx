'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const DeployBlock = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-gray-900 px-3 py-2.5 pr-10">
      <code className="block break-all font-mono text-xs text-green-400">{command}</code>
      <button
        onClick={handleCopy}
        title="Copy command"
        className="absolute right-2 top-2 rounded p-1 text-gray-400 transition hover:bg-gray-700 hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};
