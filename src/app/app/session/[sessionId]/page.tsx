export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const resolvedParams = await params;
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Interview Session</h1>
      <p className="mt-4">Session ID: {resolvedParams.sessionId}</p>
      {/* TODO: Implement chat interface */}
    </main>
  );
}