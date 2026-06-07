"use client";

import React from 'react';
import { InterviewWizard } from '@/features/interview/InterviewWizard';

interface InterviewSessionViewProps {
  sessionId: string;
}

export const InterviewSessionView: React.FC<InterviewSessionViewProps> = ({ sessionId }) => {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <InterviewWizard sessionId={sessionId} />
      </div>
    </main>
  );
};