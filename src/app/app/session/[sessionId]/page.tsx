import { InterviewWizard } from '@/features/interview/InterviewWizard';

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const resolvedParams = await params;
  
  return (
    <div className="flex flex-col items-center pt-16 pb-12 px-4 md:px-6">
      <InterviewWizard sessionId={resolvedParams.sessionId} />
    </div>
  );
}