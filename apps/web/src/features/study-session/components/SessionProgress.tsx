"use client";

interface Props {
  completed: number;
  total: number;
}

export function SessionProgress({ completed, total }: Props) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center text-sm mb-2 font-medium">
        <span>Session Progress</span>
        <span className="text-muted-foreground">{completed} of {total} tasks done ({percentage}%)</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
