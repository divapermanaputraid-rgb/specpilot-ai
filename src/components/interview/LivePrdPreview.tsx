import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { FileText, Download, Sparkles, Users, Target, CheckSquare, Table, AlertTriangle, Code, Lock, CheckCircle2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InterviewQuestionData } from '@/lib/api-client';
import { InterviewAnswer } from './InterviewWizard';

interface LivePrdPreviewProps {
  content: string;
  isGenerating?: boolean;
  sessionId?: string;
  completenessScore?: number;
  answers?: InterviewAnswer[];
  currentQuestion?: InterviewQuestionData | null;
  currentStage?: string;
  rawIdea?: string;
}

type SectionStatus = 'locked' | 'drafting' | 'captured' | 'ready';

interface SectionState {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  status: SectionStatus;
  content?: string;
  unlockThreshold: number;
}

export const LivePrdPreview: React.FC<LivePrdPreviewProps> = ({ 
  content, 
  isGenerating,
  sessionId,
  completenessScore = 0,
  answers = [],
  currentQuestion,
  currentStage,
  rawIdea
}) => {
  const hasContent = content && content.trim().length > 0;

  // Add debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[LivePrdPreview props]', {
      answersCount: answers.length,
      completenessScore,
      currentStage,
      currentQuestionStatus: currentQuestion?.status
    });
  }

  // Derive section states from interview progress
  const sections = useMemo((): SectionState[] => {
    const answersCount = answers.length;
    const isReadyToGenerate = currentQuestion?.status === 'ready_to_generate' || completenessScore >= 85;

    // Extract answer values for content preview
    const answerValues = answers.map(a => a.answerValue);
    
    // Fallback unlock logic: use both completenessScore and answersCount
    const isSectionUnlocked = (threshold: number, minAnswers: number) => {
      return completenessScore >= threshold || answersCount >= minAnswers;
    };
    
    return [
      {
        id: 'brief',
        title: 'Product Brief',
        icon: <FileText className="w-4 h-4" />,
        description: 'Overview of the product idea and vision',
        status: isSectionUnlocked(10, 1) ? 'captured' : 'locked',
        content: rawIdea || answerValues[0] || undefined,
        unlockThreshold: 10
      },
      {
        id: 'problem',
        title: 'Problem Statement & Goals',
        icon: <Target className="w-4 h-4" />,
        description: 'The problem being solved and key objectives',
        status: isSectionUnlocked(20, 2) ? 'captured' : 'locked',
        content: answerValues[1] || undefined,
        unlockThreshold: 20
      },
      {
        id: 'users',
        title: 'Target Users',
        icon: <Users className="w-4 h-4" />,
        description: 'User personas and audience definition',
        status: isSectionUnlocked(30, 3) ? 'captured' : 'locked',
        content: answerValues[2] || undefined,
        unlockThreshold: 30
      },
      {
        id: 'scope',
        title: 'MVP Scope',
        icon: <CheckSquare className="w-4 h-4" />,
        description: 'Core features for minimum viable product',
        status: isSectionUnlocked(40, 4) ? 'captured' : 'locked',
        content: answerValues[3] || undefined,
        unlockThreshold: 40
      },
      {
        id: 'stories',
        title: 'User Stories',
        icon: <FileText className="w-4 h-4" />,
        description: 'Detailed user journeys and workflows',
        status: isSectionUnlocked(55, 5) ? 'captured' : 'locked',
        content: answerValues[4] || undefined,
        unlockThreshold: 55
      },
      {
        id: 'features',
        title: 'Feature Matrix',
        icon: <Table className="w-4 h-4" />,
        description: 'Feature priority and complexity breakdown',
        status: isSectionUnlocked(65, 6) ? 'captured' : 'locked',
        content: answerValues[5] || undefined,
        unlockThreshold: 65
      },
      {
        id: 'risks',
        title: 'Technical Risks',
        icon: <AlertTriangle className="w-4 h-4" />,
        description: 'Potential challenges and mitigation strategies',
        status: isSectionUnlocked(75, 7) ? 'captured' : 'locked',
        content: answerValues[6] || undefined,
        unlockThreshold: 75
      },
      {
        id: 'prompt',
        title: 'AI Coding Agent Prompt',
        icon: <Code className="w-4 h-4" />,
        description: 'Implementation guidance for AI-assisted development',
        status: isReadyToGenerate ? 'ready' : completenessScore >= 85 ? 'captured' : 'locked',
        content: isReadyToGenerate ? 'Ready to generate comprehensive PRD' : undefined,
        unlockThreshold: 85
      }
    ];
  }, [completenessScore, answers, currentQuestion, rawIdea]);

  const capturedCount = sections.filter(s => s.status === 'captured' || s.status === 'ready').length;

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

              {/* Progress Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-900 font-medium">Captured Answers</span>
                  <span className="text-blue-700 font-semibold">{capturedCount} / {sections.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-900 font-medium">Completeness</span>
                  <span className="text-blue-700 font-semibold">{completenessScore}%</span>
                </div>
                {currentQuestion?.status === 'ready_to_generate' && (
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-900 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Ready to Generate PRD</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Structure Preview */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <DocumentSection
                    key={section.id}
                    icon={section.icon}
                    title={section.title}
                    description={section.description}
                    status={section.status}
                    content={section.content}
                  />
                ))}
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
  status: SectionStatus;
  content?: string;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ 
  icon, 
  title, 
  description, 
  status,
  content 
}) => {
  const isLocked = status === 'locked';
  const isCaptured = status === 'captured' || status === 'ready';
  
  const statusConfig = {
    locked: { label: 'Locked', icon: <Lock className="w-3 h-3" />, bg: 'bg-zinc-100', text: 'text-zinc-500', border: 'border-zinc-200' },
    drafting: { label: 'Drafting', icon: <Edit3 className="w-3 h-3" />, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    captured: { label: 'Captured', icon: <CheckCircle2 className="w-3 h-3" />, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    ready: { label: 'Ready', icon: <CheckCircle2 className="w-3 h-3" />, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };

  const config = statusConfig[status];

  return (
    <div className={`space-y-2 transition-opacity duration-300 ${isLocked ? 'opacity-40' : 'opacity-100'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg border transition-colors ${
          isLocked 
            ? 'bg-zinc-50 border-zinc-200 text-zinc-400' 
            : 'bg-blue-50 border-blue-200 text-blue-600'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-zinc-900">
              {title}
            </h3>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
              {config.icon}
              {config.label}
            </span>
          </div>
          <p className="text-sm text-zinc-600">{description}</p>
          
          {/* Show captured content preview */}
          {isCaptured && content && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">Preview</span>
              </div>
              <p className="text-sm text-zinc-700 line-clamp-3">
                {content}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
