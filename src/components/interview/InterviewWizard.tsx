import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { AnswerOptionCard } from '@/features/interview/AnswerOptionCard';
import { CompletenessProgress } from '@/features/interview/CompletenessProgress';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InterviewAnswer {
  stage: string;
  question: string;
  answerValue: string;
  selectedOption: string;
  completenessScore: number;
}

export const InterviewWizard: React.FC = () => {
  const { sessionId } = useParams() as { sessionId: string };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<InterviewMessage[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestionData | null>(null);
  const [prdContent, setPrdContent] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [rawIdea, setRawIdea] = useState<string>("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [question, prd] = await Promise.all([
        fetchQuestion(sessionId, []),
        fetchPrd(sessionId)
      ]);
      
      setCurrentQuestion(question);
      setPrdContent(prd?.prd || "");
      
      // Try to extract raw idea from session storage or first question context
      const storedIdea = sessionStorage.getItem(`project_idea_${sessionId}`);
      if (storedIdea) {
        setRawIdea(storedIdea);
      }
    } catch (err) {
      console.error("Failed to load session", err);
      setError("Failed to load interview session. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId, loadSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentQuestion]);

  const handleOptionSelect = (optionValue: string) => {
    setSelectedOption(optionValue);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedOption || submitting || !currentQuestion) return;

    const isCustomAnswer = selectedOption === 'custom';
    const selectedPredefinedOption = currentQuestion.options.find(
      (option) => option.value === selectedOption
    );
    const textToSend = isCustomAnswer
      ? customAnswer.trim()
      : selectedPredefinedOption?.label ?? "";

    if (isCustomAnswer && textToSend.length < 2) {
      setError("Custom answer must be at least 2 characters.");
      return;
    }

    if (!textToSend) {
      setError("Please select or enter an answer.");
      return;
    }

    const selectedOptionToSend = isCustomAnswer ? 'custom' : selectedOption;
    const sequenceNumber = answers.length + 1;

    setSubmitting(true);
    setError(null);

    // Add assistant question and user answer to history for display
    const assistantMsg: InterviewMessage = { role: 'assistant', content: currentQuestion.question };
    const userMsg: InterviewMessage = { role: 'user', content: textToSend };
    const newHistory = [...history, assistantMsg, userMsg];

    const payload = {
      sessionId,
      projectId: sessionId,
      sequenceNumber,
      stage: currentQuestion.currentStage || "discovery",
      question: currentQuestion.question,
      aiReason: currentQuestion.reason || "",
      selectedOption: selectedOptionToSend,
      answerValue: textToSend,
      completenessScore: currentQuestion.completenessScore || 10,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[InterviewWizard] Submitting answer:', {
        selectedOption: payload.selectedOption,
        answerValue: payload.answerValue,
        sequenceNumber: payload.sequenceNumber,
        payload,
      });
    }

    try {
      // Submit answer to backend
      await submitAnswer(payload);

      // Immediately add to answers array for live preview
      const newAnswer: InterviewAnswer = {
        stage: currentQuestion.currentStage,
        question: currentQuestion.question,
        answerValue: textToSend,
        selectedOption: selectedOptionToSend,
        completenessScore: currentQuestion.completenessScore || 10,
      };

      const nextAnswers = [...answers, newAnswer];
      setAnswers(nextAnswers);
      setHistory(newHistory);
      setSelectedOption(null);
      setCustomAnswer("");

      if (process.env.NODE_ENV === 'development') {
        console.log('[InterviewWizard] Answer captured:', {
          selectedOption: newAnswer.selectedOption,
          answerValue: newAnswer.answerValue,
          sequenceNumber,
          answersLengthBeforeSave: answers.length,
          answersLengthAfterSave: nextAnswers.length,
        });
      }

      // Get next question and trigger PRD generation
      const [nextQuestion, updatedPrd] = await Promise.all([
        fetchQuestion(sessionId, newHistory),
        generatePrd(sessionId)
      ]);

      setCurrentQuestion(nextQuestion);
      setPrdContent(updatedPrd?.prd || "");

      if (process.env.NODE_ENV === 'development') {
        console.log('[InterviewWizard] Next question:', {
          completenessScore: nextQuestion.completenessScore,
          stage: nextQuestion.currentStage,
          status: nextQuestion.status
        });
      }
    } catch (err: any) {
      console.error("Submission failed", err);
      setError(err?.message || "Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-zinc-600">Loading interview session...</p>
        </div>
      </div>
    );
  }

  const completenessScore = currentQuestion?.completenessScore || 0;
  const currentStage = currentQuestion?.currentStage || 'Discovery';

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-zinc-50">
      {/* Left Panel: Discovery Interview - 45% */}
      <div className="flex flex-col w-full lg:w-[45%] border-r border-zinc-200 bg-white">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-zinc-200 bg-white px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-zinc-900">Discovery Interview</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {currentStage}
                </span>
                <span className="text-xs text-zinc-500">
                  {completenessScore}% complete
                </span>
              </div>
            </div>
          </div>
          
          <CompletenessProgress score={completenessScore} />
        </div>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <InterviewThread history={history} />
          
          {currentQuestion && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-8 space-y-6"
            >
              {/* Question Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-3 shadow-sm">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900 leading-tight">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.reason && (
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {currentQuestion.reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Answer Options Grid */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-zinc-700">Select an option:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.options.map((opt) => (
                      <AnswerOptionCard
                        key={opt.value}
                        label={opt.label}
                        value={opt.value}
                        selected={selectedOption === opt.value}
                        onClick={() => handleOptionSelect(opt.value)}
                      />
                    ))}
                    <AnswerOptionCard
                      label="Custom answer"
                      value="custom"
                      selected={selectedOption === 'custom'}
                      onClick={() => handleOptionSelect('custom')}
                      isCustom
                    />
                  </div>
                </div>
              )}

              {/* Custom Answer Textarea */}
              {selectedOption === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-zinc-700">
                    Enter your answer:
                  </label>
                  <Textarea
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="Type your custom answer here..."
                    className="min-h-[120px] border-zinc-300 bg-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleSubmit}
                  disabled={
                    submitting || 
                    !selectedOption || 
                    (selectedOption === 'custom' && customAnswer.trim().length < 2)
                  }
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500 shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Panel: Live PRD Draft - 55% */}
      <div className="hidden lg:block w-full lg:w-[55%] h-full">
        <LivePrdPreview 
          content={prdContent} 
          isGenerating={submitting}
          sessionId={sessionId}
          completenessScore={completenessScore}
          answers={answers}
          currentQuestion={currentQuestion}
          currentStage={currentStage}
          rawIdea={rawIdea}
        />
      </div>
    </div>
  );
};