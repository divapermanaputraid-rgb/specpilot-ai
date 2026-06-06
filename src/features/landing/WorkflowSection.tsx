import { MessageSquare, ListTodo, FileCheck } from 'lucide-react';

const STEPS = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Start messy",
    desc: "Describe your rough app idea in plain English. No formal structure required to begin."
  },
  {
    icon: ListTodo,
    step: "02",
    title: "Clarify with choices",
    desc: "SpecPilot asks guided discovery questions to reveal edge cases, tech stack, and logic gaps."
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Ship a build-ready spec",
    desc: "Export a comprehensive PRD with diagrams and prompts ready for developers or AI agents."
  }
];

export function WorkflowSection() {
  return (
    <section className="w-full py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((item, i) => (
            <div key={i} className="relative group">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold font-mono bg-background border border-border px-1.5 rounded-full">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 -right-6 w-12 h-px bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}