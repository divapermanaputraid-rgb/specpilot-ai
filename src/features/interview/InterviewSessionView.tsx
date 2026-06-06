"use client";

import React, { useState } from 'react';
import { InterviewWizard } from '@/features/interview/InterviewWizard';
import { LivePrdPreview } from '@/components/interview/LivePrdPreview';

interface InterviewSessionViewProps {
  sessionId: string;
}

export const InterviewSessionView: React.FC<InterviewSessionViewProps> = ({ sessionId }) => {
  const [prdContent, setPrdContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <main className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0a]">
      {/* Left Panel: Editorial Interview */}
      <div className="flex-1 overflow-y-auto border-r border-white/5 custom-scrollbar">
        <div className="max-w-3xl mx-auto py-12 px-8">
          <InterviewWizard 
            sessionId={sessionId} 
            onUpdatePrd={setPrdContent}
            onUpdateGenerating={setIsGenerating}
          />
        </div>
      </div>

      {/* Right Panel: Live PRD Preview (Editorial Style) */}
      <div className="hidden lg:flex flex-1 flex-col bg-[#0f0f0f] overflow-hidden">
        <LivePrdPreview content={prdContent} isGenerating={isGenerating} />
      </div>
    </main>
  );
};