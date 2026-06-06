import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { FileText, Download, Sparkles, Users, Target, CheckSquare, Table, AlertTriangle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePrdPreviewProps {
  content: string;
  isGenerating?: boolean;
  sessionId?: string;
  completenessScore?: number;
}

export const LivePrdPreview: React.FC<LivePrdPreviewProps> = ({ 
  content, 
  isGenerating,
  sessionId,
  completenessScore = 0
}) => {
  const hasContent = content && content.trim().length > 0;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Live PRD Draft</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-500">Updates as you answer</span>
              {isGenerating && (
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center space-x-1"
                >
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <span className="text-[10px] text-blue-600 uppercase font-bold tracking-tight">Updating</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 text-xs border-zinc-300 hover:bg-zinc-50"
          disabled={!hasContent}
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {!hasContent ? (
          <div className="p-8 lg:p-12 space-y-6">
            {/* Document Preview State */}
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Header */}
              <div className="space-y-2 pb-6 border-b border-zinc-200">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Draft Preview</span>
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Product Requirements Document</h1>
                <p className="text-sm text-zinc-600">Your PRD will appear here as you complete the interview</p>
              </div>

              {/* Document Structure Preview */}
              <div className="space-y-6">
                {/* Product Brief */}
                <DocumentSection
                  icon={<FileText className="w-4 h-4" />}
                  title="Product Brief"
                  description="Overview of the product idea and vision"
                  isLocked={completenessScore < 10}
                />

                {/* Problem Statement */}
                <DocumentSection
                  icon={<Target className="w-4 h-4" />}
                  title="Problem Statement & Goals"
                  description="The problem being solved and key objectives"
                  isLocked={completenessScore < 20}
                />

                {/* Target Users */}
                <DocumentSection
                  icon={<Users className="w-4 h-4" />}
                  title="Target Users"
                  description="User personas and audience definition"
                  isLocked={completenessScore < 30}
                />

                {/* MVP Scope */}
                <DocumentSection
                  icon={<CheckSquare className="w-4 h-4" />}
                  title="MVP Scope"
                  description="Core features for minimum viable product"
                  isLocked={completenessScore < 40}
                />

                {/* User Stories */}
                <DocumentSection
                  icon={<FileText className="w-4 h-4" />}
                  title="User Stories"
                  description="Detailed user journeys and workflows"
                  isLocked={completenessScore < 50}
                  preview={
                    <div className="mt-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                        <span>Flow diagram preview:</span>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 space-y-1">
                        <div>Idea → Interview → PRD → Build</div>
                      </div>
                    </div>
                  }
                />

                {/* Feature Matrix */}
                <DocumentSection
                  icon={<Table className="w-4 h-4" />}
                  title="Feature Matrix"
                  description="Feature priority and complexity breakdown"
                  isLocked={completenessScore < 60}
                  preview={
                    <div className="mt-3 overflow-hidden border border-zinc-200 rounded-lg">
                      <table className="min-w-full text-xs">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-zinc-600 font-medium">Feature</th>
                            <th className="px-3 py-2 text-left text-zinc-600 font-medium">Priority</th>
                            <th className="px-3 py-2 text-left text-zinc-600 font-medium">Complexity</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          <tr className="border-b border-zinc-100">
                            <td className="px-3 py-2 text-zinc-400">Feature items will appear here</td>
                            <td className="px-3 py-2 text-zinc-400">—</td>
                            <td className="px-3 py-2 text-zinc-400">—</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                />

                {/* Technical Risks */}
                <DocumentSection
                  icon={<AlertTriangle className="w-4 h-4" />}
                  title="Technical Risks"
                  description="Potential challenges and mitigation strategies"
                  isLocked={completenessScore < 70}
                />

                {/* AI Coding Prompt */}
                <DocumentSection
                  icon={<Code className="w-4 h-4" />}
                  title="AI Coding Agent Prompt"
                  description="Implementation guidance for AI-assisted development"
                  isLocked={completenessScore < 80}
                />
              </div>

              {/* Progress Indicator */}
              <div className="pt-8 border-t border-zinc-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">Interview Progress</span>
                  <span className="font-semibold text-zinc-900">{completenessScore}%</span>
                </div>
                <div className="mt-2 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completenessScore}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-zinc prose-lg max-w-none 
                prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-zinc-900
                prose-h1:text-4xl prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-200 prose-h2:pb-3
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-zinc-900 prose-strong:font-semibold
                prose-ul:my-4 prose-li:text-zinc-700
                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:shadow-lg
                prose-table:border prose-table:border-zinc-200
                prose-th:bg-zinc-50 prose-th:border prose-th:border-zinc-200 prose-th:px-4 prose-th:py-2
                prose-td:border prose-td:border-zinc-200 prose-td:px-4 prose-td:py-2
                "
            >
              <ReactMarkdown>{content}</ReactMarkdown>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DocumentSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLocked: boolean;
  preview?: React.ReactNode;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ 
  icon, 
  title, 
  description, 
  isLocked,
  preview 
}) => {
  return (
    <div className={`space-y-2 ${isLocked ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg border ${isLocked ? 'bg-zinc-50 border-zinc-200 text-zinc-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            {title}
            {isLocked && (
              <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                Locked
              </span>
            )}
          </h3>
          <p className="text-sm text-zinc-600 mt-1">{description}</p>
          {preview && !isLocked && preview}
        </div>
      </div>
    </div>
  );
};