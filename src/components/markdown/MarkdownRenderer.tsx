"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidBlock } from './MermaidBlock';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-a:text-primary prose-img:rounded-3xl ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && language === 'mermaid') {
              return <MermaidBlock content={codeContent} />;
            }

            if (!inline) {
              return <CodeBlock className={className}>{codeContent}</CodeBlock>;
            }

            return (
              <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted/50 border-b border-border">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-3 text-left font-semibold text-foreground/80">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 border-t border-border/50">{children}</td>;
          },
          h1({ children }) {
            return <h1 className="text-4xl md:text-6xl font-black mt-20 mb-10 pb-4 border-b-4 border-primary/20 tracking-tighter uppercase">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-2xl md:text-4xl font-black mt-16 mb-8 tracking-tight border-l-8 border-primary/40 pl-6 py-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-xl md:text-2xl font-black mt-12 mb-6 tracking-tight text-primary/80">{children}</h3>;
          },
          p({ children }) {
            return <p className="leading-relaxed mb-6 text-foreground/90 font-medium text-lg">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-none ml-0 mb-8 space-y-4 text-foreground/90 font-medium">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside ml-6 mb-8 space-y-4 text-foreground/90 font-medium">{children}</ol>;
          },
          li({ children }) {
            return (
              <li className="group flex items-start space-x-3">
                <span className="mt-2.5 h-2 w-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform" />
                <span className="flex-1">{children}</span>
              </li>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic text-muted-foreground bg-muted/20 rounded-r-lg my-6">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
