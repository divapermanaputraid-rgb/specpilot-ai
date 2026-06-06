import { CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnswerOptionCardProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  isCustom?: boolean;
}

export function AnswerOptionCard({ label, value, selected, onClick, isCustom }: AnswerOptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col p-6 rounded-xl border-2 transition-all duration-200",
        selected 
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]" 
          : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col space-y-1">
          {isCustom && <span className="text-xs font-semibold uppercase tracking-wider text-primary">Custom Input</span>}
          <span className={cn("text-base font-medium leading-snug", selected ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
        </div>
        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border", selected ? "border-primary bg-primary" : "border-muted-foreground/30")}>
          {selected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
        </div>
      </div>
    </div>
  );
}
