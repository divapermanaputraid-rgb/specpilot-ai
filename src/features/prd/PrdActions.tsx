"use client";

import { useState } from 'react';
import { Copy, Download, Check, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrdActionsProps {
  content: string;
  sessionId: string;
}

export function PrdActions({ content, sessionId }: PrdActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy PRD to clipboard:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRD_${sessionId.substring(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    router.push('/app');
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md font-medium text-sm transition-colors border border-border"
      >
        {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy Markdown'}
      </button>
      
      <button
        onClick={handleDownload}
        className="flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md font-medium text-sm transition-colors border border-border"
      >
        <Download className="mr-2 h-4 w-4" />
        Download .md
      </button>

      <div className="flex-1 min-w-[20px]" /> {/* Spacer */}

      <button
        onClick={handleStartOver}
        className="flex items-center justify-center px-4 py-2 bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm transition-colors border border-transparent"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Start Over
      </button>
    </div>
  );
}
