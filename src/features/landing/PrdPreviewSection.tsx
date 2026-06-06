import { FileText, Table, BarChart3, Terminal, Share2, Zap } from 'lucide-react';

const SECTIONS = [
  { icon: FileText, title: "Executive Summary", desc: "High-level vision and business goals." },
  { icon: Table, title: "Feature Matrix", desc: "Prioritized list of MVP requirements." },
  { icon: Share2, title: "User Flows", desc: "Logic mapped out with Mermaid.js." },
  { icon: Terminal, title: "AI Coding Prompt", desc: "Copy-paste ready agent instructions." },
];

export function PrdPreviewSection() {
  return (
    <section id="preview" className="w-full py-24 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Premium Artifact Output
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            SpecPilot generates a structured workspace that feels like a professional product document, not a generic chat transcript.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="bg-muted/50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10 text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm tracking-tight">Project: StockFlow UMKM</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">v1.0.4-beta</span>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-l-4 border-primary pl-4">1. Executive Summary</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {`"StockFlow is a mobile-first inventory management system designed specifically for small and medium enterprises (UMKM) in Indonesia. The primary goal is to replace manual paper-based tracking with a resilient, offline-first digital solution."`}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-l-4 border-primary pl-4">2. Feature Matrix (MVP)</h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 text-left border-b border-border">
                        <tr>
                          <th className="p-3 font-semibold">Requirement</th>
                          <th className="p-3 font-semibold">Priority</th>
                          <th className="p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-3 font-medium">QR Code Inventory Scanning</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">P0</span></td>
                          <td className="p-3 text-muted-foreground">Ready</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Low Stock Alerts (WhatsApp)</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">P1</span></td>
                          <td className="p-3 text-muted-foreground">Drafted</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold border-l-4 border-primary pl-4">3. AI Coding Agent Prompt</h3>
                     <button className="text-[10px] font-mono bg-primary text-primary-foreground px-2 py-1 rounded hover:opacity-90 transition-opacity flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> COPY PROMPT
                     </button>
                   </div>
                    <div className="bg-zinc-950 text-zinc-300 p-4 rounded-lg font-mono text-xs border border-zinc-800 leading-relaxed">
                       <span className="text-zinc-500">{`// System Prompt for v0/Bolt/Windsurf`}</span><br />
                       {`"Build a Next.js application using Tailwind CSS and Supabase. Implement a multi-tenant inventory dashboard. The database schema should include 'products', 'transactions', and 'suppliers'. Use Lucide icons and ensure a high-contrast UI for warehouse environments..."`}
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">PRD Components</h4>
            <div className="grid grid-cols-1 gap-4">
              {SECTIONS.map((section, i) => (
                <div key={i} className="group p-4 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm">{section.title}</h5>
                      <p className="text-xs text-muted-foreground leading-snug">{section.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 relative overflow-hidden">
               <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-primary/5 rotate-12" />
               <div className="relative z-10 space-y-2">
                 <h5 className="font-bold text-sm">Visual Discovery</h5>
                 <p className="text-xs text-muted-foreground">Automatically includes Mermaid logic diagrams for complex user flows and database relations.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}