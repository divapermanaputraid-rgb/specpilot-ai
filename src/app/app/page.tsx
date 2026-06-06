import { IdeaInputForm } from '@/features/interview/IdeaInputForm';

export default function AppIndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150">
            BUILD THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">IMPOSSIBLE.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Deconstruct your vision into a production-ready PRD using First-Principles AI.
          </p>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <IdeaInputForm />
        </div>
      </div>
    </div>
  );
}