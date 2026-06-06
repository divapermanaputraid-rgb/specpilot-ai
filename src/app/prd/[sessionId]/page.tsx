import { PrdViewer } from '@/features/prd/PrdViewer';

export default async function PrdPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="flex flex-col items-center pt-8 pb-24 px-4 md:px-6">
      <PrdViewer sessionId={resolvedParams.sessionId} />
    </div>
  );
}