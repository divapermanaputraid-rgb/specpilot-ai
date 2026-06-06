"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, InterviewQuestionData } from '@/lib/api-client';
import { AnswerOptionCard } from './AnswerOptionCard';
import { CompletenessProgress } from './CompletenessProgress';
import { Loader2, ArrowRight, CheckCircle, FileText, Sparkles, BrainCircuit } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InterviewWizardProps {
  sessionId: string;
}

export function InterviewWizard({ sessionId }: InterviewWizardProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<InterviewQuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState(1);

  const customInputRef = useRef<HTMLTextAreaElement>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setCustomAnswer('');
    
    try {
      const response = await apiClient.getInterviewQuestion({
        sessionId,
        conversationHistory: [] // Keeping for compatibility as instructed
      });
      
      setData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch question:', err);
      setError(err.message || 'Failed to connect to AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Focus custom input when selected
  useEffect(() => {
    if (selectedOption === 'custom' && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [selectedOption]);

  const handleSubmit = async () => {
    if (!data || !selectedOption) return;
    
    const isCustom = selectedOption === 'custom';
    if (isCustom && customAnswer.trim().length < 5) {
      setError("Please provide a more detailed custom answer.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const answerValue = isCustom 
      ? customAnswer 
      : data.options.find(o => o.value === selectedOption)?.label || '';

    try {
      await apiClient.submitInterviewAnswer({
        sessionId,
        projectId: sessionId, // Assuming project ID is the same as session ID for this demo, or handled by backend
        sequenceNumber,
        stage: data.currentStage,
        question: data.question,
        aiReason: data.reason,
        selectedOption,
        answerValue,
        completenessScore: data.completenessScore,
      });

      setSequenceNumber(prev => prev + 1);
      await fetchQuestion();
    } catch (err: any) {
      console.error('Failed to submit answer:', err);
      setError(err.message || 'Failed to submit your answer. Please try again.');
      setSubmitting(false);
    }
  };

  const handleGeneratePrd = async () => {
    setGenerating(true);
    setError(null);
    try {
      await apiClient.generatePrd({ sessionId });
      router.push(`/prd/${sessionId}`);
    } catch (err: any) {
      console.error('Failed to generate PRD:', err);
      setError(err.message || 'Failed to generate PRD. Please try again.');
      setGenerating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <BrainCircuit className="h-16 w-16 text-primary animate-pulse relative" />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold tracking-tight">AI is Thinking...</h3>
          <p className="text-sm text-muted-foreground animate-pulse">Analyzing your vision to generate the next logical question</p>
        </div>
        <div className="w-full max-w-md space-y-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 border border-destructive/20 bg-destructive/10 rounded-xl text-center">
        <h3 className="text-xl font-bold text-destructive mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
          onClick={fetchQuestion}
          className="px-6 py-2 bg-background border border-border rounded-md hover:bg-muted font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  if (data.status === 'ready_to_generate' || generating) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-12 space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className={cn(
            "h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-1000",
            generating ? "bg-primary animate-pulse rotate-180" : "bg-green-500"
          )}>
            {generating ? (
              <BrainCircuit className="h-12 w-12 text-primary-foreground" />
            ) : (
              <CheckCircle className="h-12 w-12 text-white" />
            )}
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Sparkles className="h-4 w-4 text-secondary-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-black tracking-tighter">
            {generating ? 'SYNTHESIZING VISION' : 'DISCOVERY COMPLETE'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            {generating 
              ? 'Our AI is drafting technical architecture, user stories, and Mermaid diagrams. Precision takes time.' 
              : 'The core foundations are established. We are ready to manifest your idea into a production-grade specification.'}
          </p>
        </div>
        
        {error && (
          <div className="w-full p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-destructive animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {!generating && (
          <button
            onClick={handleGeneratePrd}
            className="group relative h-20 px-12 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-2xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 active:translate-y-0 transition-all"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <FileText className="mr-4 h-8 w-8" />
            MANIFEST PRD
          </button>
        )}

        {generating && (
          <div className="w-full max-w-sm space-y-3">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-fast" />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <span>Generating Diagrams</span>
              <span>85% Complete</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isNextDisabled = !selectedOption || (selectedOption === 'custom' && customAnswer.trim().length < 5) || submitting;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-4">
        <CompletenessProgress score={data.completenessScore} />
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <span>{data.currentStage.replace(/_/g, ' ')}</span>
          <span>Vision Completeness</span>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter text-foreground">
          {data.question}
        </h2>
        {data.reason && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent rounded-lg blur opacity-50" />
            <p className="relative text-base text-muted-foreground font-medium leading-relaxed border-l-4 border-primary pl-6 py-2">
              {data.reason}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.options.map((option) => (
          <AnswerOptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            selected={selectedOption === option.value}
            onClick={() => setSelectedOption(option.value)}
            isCustom={option.value === 'custom'}
          />
        ))}
        {data.allowCustom && !data.options.some(o => o.value === 'custom') && (
          <AnswerOptionCard
            label="Type your own answer..."
            value="custom"
            selected={selectedOption === 'custom'}
            onClick={() => setSelectedOption('custom')}
            isCustom={true}
          />
        )}
      </div>

      {selectedOption === 'custom' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <textarea
            ref={customInputRef}
            value={customAnswer}
            onChange={(e) => setCustomAnswer(e.target.value)}
            placeholder="Type your specific requirements here..."
            className="w-full min-h-[120px] p-4 rounded-xl border border-primary/50 bg-background shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            disabled={submitting}
          />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          onClick={handleSubmit}
          disabled={isNextDisabled}
          className="h-12 px-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
