"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { apiClient, type OutputLanguage } from '@/lib/api-client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IdeaInputForm() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('id');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim().length < 20 || idea.length > 2000) return;

    setLoading(true);
    setError(null);

    try {
      const sessionId = uuidv4();
      await apiClient.createProject({
        sessionId,
        rawIdea: idea,
        outputLanguage,
      });

      router.push(`/app/session/${sessionId}`);
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const isInvalid = idea.trim().length < 20 || idea.length > 2000;

  const examples = [
    { title: "SaaS Platform", text: "A multi-tenant B2B platform for property management including automated billing and maintenance tracking." },
    { title: "Mobile App", text: "A fitness app that uses computer vision to track workout form and provides real-time audio corrections." },
    { title: "Marketplace", text: "A hyper-local marketplace for renting high-end photography equipment between verified professionals." }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Start typing your vision..."
              className="w-full min-h-[240px] p-8 rounded-2xl border border-border bg-background shadow-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-xl leading-relaxed placeholder:text-muted-foreground/40"
              disabled={loading}
            />
            <div className="absolute bottom-6 right-6 flex items-center space-x-4">
              {idea.trim().length > 0 && idea.trim().length < 20 && (
                <span className="text-xs font-medium text-destructive animate-pulse">
                  Need {20 - idea.trim().length} more chars
                </span>
              )}
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                isInvalid ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              )}>
                {idea.length} / 2000
              </div>
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label htmlFor="output-language" className="text-sm font-semibold text-foreground/80">
              Output language
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              SpecPilot will ask questions and generate the PRD in this language.
            </p>
          </div>
          <select
            id="output-language"
            value={outputLanguage}
            onChange={(event) => setOutputLanguage(event.target.value as OutputLanguage)}
            disabled={loading}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isInvalid}
          className="w-full h-16 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
        >
          {loading ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : (
            <>
              Launch AI Discovery <ArrowRight className="ml-3 h-6 w-6" />
            </>
          )}
        </button>
      </form>
      
      <div className="mt-16 space-y-8">
        <div className="flex items-center space-x-4">
          <div className="h-px flex-1 bg-border/60" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Need inspiration?</h3>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdea(ex.text)}
              className="group p-6 rounded-2xl border border-border bg-muted/20 text-left hover:border-primary/50 hover:bg-background transition-all"
            >
              <h4 className="text-xs font-black uppercase text-primary mb-2 group-hover:tracking-wider transition-all">{ex.title}</h4>
              <p className="text-sm text-foreground/60 line-clamp-3 leading-relaxed">{'"'}{ex.text}{'"'}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1 p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <h4 className="text-[10px] font-black uppercase tracking-tighter text-primary/60 mb-2">Methodology</h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">Our First-Principles AI interview decomposes your idea into core business logic and technical requirements.</p>
          </div>
          <div className="flex-1 p-5 rounded-2xl bg-secondary/5 border border-secondary/10">
            <h4 className="text-[10px] font-black uppercase tracking-tighter text-secondary/60 mb-2">Output</h4>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">Receive a comprehensive PRD including User Stories, Technical Architecture, and Mermaid Diagrams.</p>
          </div>
        </div>
      </div>
    </div>
  );
}