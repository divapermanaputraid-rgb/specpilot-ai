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
        "relative flex cursor-pointer flex-col p-5 rounded-xl border-2 transition-all duration-200 shadow-sm",
        selected 
          ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100 scale-[1.02]" 
          : "border-zinc-200 bg-white hover:border-blue-300 hover:bg-zinc-50 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col space-y-1">
          {isCustom && (
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Custom Input
            </span>
          )}
          <span className={cn(
            "text-base font-medium leading-snug", 
            selected ? "text-zinc-900" : "text-zinc-700"
          )}>
            {label}
          </span>
        </div>
        <div className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected 
            ? "border-blue-600 bg-blue-600" 
            : "border-zinc-300 bg-white"
        )}>
          {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
        </div>
      </div>
    </div>
  );
}