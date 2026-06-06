interface CompletenessProgressProps {
  score: number;
}

export function CompletenessProgress({ score }: CompletenessProgressProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-zinc-700 tracking-tight">Discovery Progress</span>
        <span className="text-xs font-semibold text-zinc-600">{normalizedScore}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-100 overflow-hidden rounded-full shadow-inner">
        <div 
          className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full shadow-sm"
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
}