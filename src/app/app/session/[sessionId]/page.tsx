import { InterviewSessionView } from '@/features/interview/InterviewSessionView';

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  
  return <InterviewSessionView sessionId={sessionId} />;
}