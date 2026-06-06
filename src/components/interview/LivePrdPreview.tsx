import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePrdPreviewProps {
  content: string;
  isGenerating?: boolean;
}

export const LivePrdPreview: React.FC<LivePrdPreviewProps> = ({ content, isGenerating }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold">Live PRD Draft</h2>
          {isGenerating && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-1"
            >
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span className="text-[10px] text-primary uppercase font-bold tracking-tighter">Updating</span>
            </motion.div>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar bg-white dark:bg-zinc-950">
        {!content ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Sparkles className="w-12 h-12 stroke-[1px]" />
            <p className="text-sm max-w-[200px]">
              Complete the interview to generate your technical specification.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-zinc prose-lg dark:prose-invert max-w-none 
              prose-headings:font-serif prose-headings:tracking-tight
              prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b prose-h2:pb-3
              prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/5
              "
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
};