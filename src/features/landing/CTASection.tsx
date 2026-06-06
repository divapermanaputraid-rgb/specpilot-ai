import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center bg-zinc-900 text-white rounded-3xl p-12 md:p-20 shadow-2xl">
          <div className="space-y-4 max-w-[800px]">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to ship your next <br className="hidden sm:block" /> build-ready specification?
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl">
              No sign-up required. Start for free in the public beta today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/app" 
              className="inline-flex items-center justify-center rounded-full h-14 px-10 text-lg font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Start Your Free PRD <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="text-zinc-500 text-sm font-mono tracking-tighter">
            FREE PUBLIC BETA · UNLIMITED EXPORTS
          </p>
        </div>
      </div>
      
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[160px] -z-10" />
    </section>
  );
}