"use client";

import { useEffect, useRef, useState } from 'react';

interface MermaidBlockProps {
  content: string;
}

export function MermaidBlock({ content }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const renderDiagram = async () => {
      try {
        setError(false);
        const mermaid = (await import('mermaid')).default;
        
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        
        // Generate a unique ID for the diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, content);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError(true);
      }
    };

    renderDiagram();
  }, [content, mounted]);

  if (!mounted) {
    return (
      <div className="my-4 p-8 border border-border rounded-lg bg-muted/20 flex items-center justify-center animate-pulse">
        <span className="text-xs text-muted-foreground">Initializing diagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 border border-destructive/20 rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center justify-between">
          <span className="text-xs font-medium text-destructive uppercase tracking-wider">Diagram Render Failed</span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-muted/50 leading-relaxed">
          <code>{content}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden flex flex-col items-center">
      <div 
        ref={containerRef}
        className="mermaid-container w-full overflow-x-auto py-4 flex justify-center bg-white rounded-lg border border-border/50 shadow-sm"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
