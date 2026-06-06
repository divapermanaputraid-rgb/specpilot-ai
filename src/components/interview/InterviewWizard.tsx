import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  fetchQuestion, 
  submitAnswer, 
  fetchPrd,
  generatePrd,
  InterviewQuestionData, 
  InterviewMessage 
} from '@/lib/api-client';
import { InterviewThread } from './InterviewThread';
import { LivePrdPreview } from './LivePrdPreview';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InterviewWizard: React.FC = () => {
  const { sessionId } = useParams() as { sessionId: string };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<InterviewMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionData | null>(null);
  const [prdContent, setPrdContent] = useState("");
  const [answer, setAnswer] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentQuestion]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const [question, prd] = await Promise.all([
        fetchQuestion(sessionId, []),
        fetchPrd(sessionId)
      ]);
      
      setCurrentQuestion(question);
      setPrdContent(prd?.prd || "");
    } catch (err) {
      console.error("Failed to load session", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (selectedLabel?: string) => {
    const isOptionClick = !!selectedLabel;
    const textToSend = selectedLabel || answer;
    if (!textToSend.trim() || submitting || !currentQuestion) return;

    setSubmitting(true);
    
    // Add assistant question and user answer to history for display
    const assistantMsg: InterviewMessage = { role: 'assistant', content: currentQuestion.question };
    const userMsg: InterviewMessage = { role: 'user', content: textToSend };
    const newHistory = [...history, assistantMsg, userMsg];
    
    setHistory(newHistory);
    setAnswer("");

    const optionIndex = isOptionClick ? currentQuestion.options.findIndex(o => o.label === selectedLabel) : -1;
    const mappedSelectedOption = optionIndex === 0 ? 'option_a' :
                                  optionIndex === 1 ? 'option_b' :
                                  optionIndex === 2 ? 'option_c' : 
                                  isOptionClick ? `option_${optionIndex + 1}` : 'custom';

    const payload = {
      sessionId,
      projectId: sessionId,
      sequenceNumber: Math.floor(history.length / 2) + 1,
      stage: currentQuestion.currentStage || "discovery",
      question: currentQuestion.question,
      aiReason: currentQuestion.reason || "",
      selectedOption: mappedSelectedOption,
      answerValue: textToSend,
      completenessScore: currentQuestion.completenessScore || 10,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[InterviewWizard] Submitting answer:', payload);
    }

    try {
      // Submit answer to backend
      await submitAnswer(payload);

      // Get next question and trigger PRD generation
      const [nextQuestion, updatedPrd] = await Promise.all([
        fetchQuestion(sessionId, newHistory),
        generatePrd(sessionId)
      ]);

      setCurrentQuestion(nextQuestion);
      setPrdContent(updatedPrd?.prd || "");
    } catch (err: any) {
      console.error("Submission failed", err);
      // Optional: show error toast or message
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel: Interview */}
      <div className="flex-1 flex flex-col min-w-[400px] border-r border-border relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar pb-32"
        >
          <InterviewThread history={history} />
          
          {currentQuestion && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 py-6 space-y-6"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {currentQuestion.currentStage || 'Next Question'}
                </p>
                <h2 className="text-xl font-medium tracking-tight leading-tight">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.reason && (
                  <p className="text-sm text-muted-foreground italic">
                    {currentQuestion.reason}
                  </p>
                )}
              </div>

              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4 border-primary/20 hover:border-primary hover:bg-primary/5"
                      onClick={() => handleSend(opt.label)}
                      disabled={submitting}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-2xl mx-auto relative group">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[60px] max-h-[200px] pr-12 py-4 rounded-2xl border-border/50 bg-background/80 backdrop-blur-md shadow-2xl transition-all focus:ring-1 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              className={cn(
                "absolute right-2 bottom-2 rounded-xl transition-all",
                answer.trim() ? "scale-100 opacity-100" : "scale-90 opacity-0"
              )}
              onClick={() => handleSend()}
              disabled={submitting || !answer.trim()}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="hidden lg:block w-[45%] xl:w-[50%] h-full">
        <LivePrdPreview content={prdContent} isGenerating={submitting} />
      </div>
    </div>
  );
};