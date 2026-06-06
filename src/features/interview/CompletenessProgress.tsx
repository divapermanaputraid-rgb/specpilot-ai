interface CompletenessProgressProps {
  score: number;
}

export function CompletenessProgress({ score }: CompletenessProgressProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-foreground tracking-tight">Discovery Progress</span>
        <span className="text-xs font-semibold text-muted-foreground">{normalizedScore}%</span>
      </div>
      <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
        <div 
          className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
}
