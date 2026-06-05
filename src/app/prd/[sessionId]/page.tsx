export default async function PrdPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold">Generated PRD</h1>
      <p className="mt-4 text-muted-foreground">Session ID: {resolvedParams.sessionId}</p>
      {/* TODO: Implement markdown viewer for PRD */}
    </main>
  );
}