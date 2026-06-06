import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            href="/"
            className="mr-6 inline-flex items-baseline gap-1 rounded-sm font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            <span className="text-xl">SpecPilot</span>
            <span className="text-xl text-primary">AI</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/app"
              className="transition-colors hover:text-foreground/80 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-sm"
            >
              Workspace
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                Free
              </span>
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-foreground/60 transition-colors hover:text-foreground/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-sm"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
