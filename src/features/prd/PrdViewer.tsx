"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { PrdActions } from './PrdActions';
import { Loader2, FileWarning, Sparkles, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

interface PrdViewerProps {
  sessionId: string;
}

export function PrdViewer({ sessionId }: PrdViewerProps) {
  const [content, setContent] = useState<string>('');
  const [quality, setQuality] = useState<{ valid: boolean; missing: string[]; score: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrd = async () => {
      try {
        const response = await apiClient.getPrd(sessionId);
        setContent(response.prd);
        setQuality(response.quality);
      } catch (err: any) {
        console.error('Failed to fetch PRD:', err);
        setError(err.message || 'Could not load the PRD. It may have expired or the session ID is invalid.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrd();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <BrainCircuit className="h-16 w-16 text-primary animate-spin-slow relative" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter">RETRIEVING SPECIFICATIONS</h2>
          <p className="text-muted-foreground font-medium max-w-xs mx-auto animate-pulse">
            Connecting to the secure vault to manifest your vision...
          </p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 border border-destructive/20 bg-destructive/5 rounded-2xl text-center mt-12">
        <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <FileWarning className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Document Not Found</h2>
        <p className="text-muted-foreground mb-8">{error || 'The requested PRD could not be found.'}</p>
        <Link
          href="/app"
          className="h-11 px-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90"
        >
          Start a New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {quality && !quality.valid && (
        <div className="mb-8 p-6 rounded-2xl border border-warning/20 bg-warning/5 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
              <FileWarning className="h-5 w-5 text-warning" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight text-warning-foreground">Quality Check Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This PRD was generated, but it missed some quality checks. Score: <span className="font-bold text-warning-foreground">{quality.score}/100</span>
              </p>
              {quality.missing.length > 0 && (
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  {quality.missing.map((item, i) => (
                    <li key={i} className="text-[11px] font-medium text-muted-foreground flex items-center">
                      <span className="h-1 w-1 rounded-full bg-warning/40 mr-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-12 sticky top-14 z-40 bg-background/80 backdrop-blur-xl py-6 px-4 md:px-8 -mx-4 md:-mx-8 border-b border-border/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Manifested Vision</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none">PRD_SPEC_V1.MD</h1>
        </div>
        <PrdActions content={content} sessionId={sessionId} />
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-2xl opacity-50 transition-opacity group-hover:opacity-75" />
        <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl rounded-[1.5rem] p-8 md:p-16 min-h-screen overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BrainCircuit className="h-64 w-64 -mr-20 -mt-20" />
          </div>
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
