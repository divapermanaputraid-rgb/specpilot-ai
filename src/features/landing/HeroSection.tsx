import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const prdSections = [
  { name: 'MVP Scope', emoji: '🎯' },
  { name: 'User Stories', emoji: '👤' },
  { name: 'Technical Specs', emoji: '⚙️' },
  { name: 'Data Model', emoji: '🗄️' },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-24">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="flex flex-col space-y-7 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="inline-flex w-fit items-center rounded-full border border-border bg-background/80 px-3 py-1 text-sm font-medium text-foreground shadow-sm">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary" />
              Free public beta · No sign-up required
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Turn rough ideas into{' '}
                <span className="font-serif italic tracking-[-0.02em] text-foreground/85">
                  build-ready
                </span>{' '}
                PRDs
              </h1>
              <p className="max-w-[620px] text-lg leading-relaxed text-muted-foreground md:text-xl">
                SpecPilot AI guides you through focused product questions, then
                generates a structured PRD with user stories, feature matrices,
                Mermaid diagrams, risks, and an AI coding prompt.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-base font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:bg-foreground/90 active:translate-y-0"
              >
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#preview"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background/80 px-7 text-base font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                See output format
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="relative mx-auto max-w-2xl">
              {/* Simplified preview card */}
              <div className="relative rounded-2xl border border-border bg-background shadow-xl">
                {/* Header */}
                <div className="border-b border-border/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Building your PRD
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6 space-y-6">
                  {/* User input */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Your idea
                    </div>
                    <div className="rounded-lg bg-muted/40 p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        An inventory management system for small businesses
                        with stock tracking, supplier management, and automated
                        reorder alerts...
                      </p>
                    </div>
                  </div>

                  {/* AI Question */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Clarifying question
                    </div>
                    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        Who will be the primary users of this system?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors">
                          Store Owners
                        </button>
                        <button className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                          Staff Members
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Generated sections preview */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      PRD Sections
                    </div>
                    <div className="space-y-2">
                      {prdSections.map((section, index) => (
                        <div
                          key={section.name}
                          className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
                        >
                          <span className="text-lg">{section.emoji}</span>
                          <span className="flex-1 text-sm font-medium text-foreground">
                            {section.name}
                          </span>
                          {index < 2 ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              ✓
                            </span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                              <div className="h-1 w-1 rounded-full bg-primary animate-pulse delay-75" />
                              <div className="h-1 w-1 rounded-full bg-primary animate-pulse delay-150" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer hint */}
                <div className="border-t border-border/50 px-6 py-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground text-center">
                    Interactive interview → Structured PRD in minutes
                  </p>
                </div>
              </div>

              {/* Subtle bottom glow */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Simplified background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      </div>
    </section>
  );
}