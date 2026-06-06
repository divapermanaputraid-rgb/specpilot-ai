import Link from 'next/link';
import { ArrowRight, FileText, MessageSquare, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-dot-pattern">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Build Better PRDs with <span className="text-primary">SpecPilot AI</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stop starting with a blank page. Turn your vague app ideas into comprehensive, actionable Product Requirements Documents through an AI-guided discovery interview.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/app"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">1. Define the Core</h3>
              <p className="text-muted-foreground">
                Enter your initial rough idea. Whether it&apos;s a one-sentence elevator pitch or a few bullet points, SpecPilot AI takes it as the foundation.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">2. AI-Guided Discovery</h3>
              <p className="text-muted-foreground">
                Instead of guessing, the AI asks specific, contextual questions to clarify features, users, and technical constraints. One question at a time.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">3. Visual PRD Output</h3>
              <p className="text-muted-foreground">
                Receive a complete, professionally formatted PRD including Mermaid flowcharts, database schemas, and requirement matrices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section - Mock PRD feeling */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/40 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Premium Documentation Output</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-lg/relaxed">
              Beautifully rendered technical documents that developers and product managers actually want to read.
            </p>
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border shadow-2xl bg-background">
            <div className="bg-muted px-4 py-2 border-b border-border flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
              <div className="w-3 h-3 rounded-full bg-green-400/20" />
              <span className="ml-4 text-xs font-mono text-muted-foreground">specification.md</span>
            </div>
            <div className="p-8 font-serif leading-relaxed opacity-60">
              <h1 className="text-2xl font-bold mb-4">Project: StockFlow UMKM</h1>
              <h2 className="text-xl font-semibold mt-6 mb-2">1. Executive Summary</h2>
              <p className="mb-4">StockFlow is a mobile-first inventory management system designed specifically for small and medium enterprises (UMKM) in Indonesia...</p>
              <div className="my-8 p-4 bg-muted/50 rounded border border-dashed border-border flex justify-center italic text-sm">
                [ Mermaid Flowchart Renders Here ]
              </div>
              <h2 className="text-xl font-semibold mt-6 mb-2">2. Functional Requirements</h2>
              <table className="w-full border-collapse border border-border mt-4">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">ID</th>
                    <th className="border border-border p-2 text-left">Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">FR-01</td>
                    <td className="border border-border p-2">Real-time stock tracking with QR code scanning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to map out your next big idea?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Join product teams using SpecPilot AI to accelerate their discovery phase.
            </p>
            <Link
              href="/app"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-12 py-2 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
