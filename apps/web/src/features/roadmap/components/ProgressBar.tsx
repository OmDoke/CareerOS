interface Props {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className = "" }: Props) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full bg-secondary rounded-full h-2.5 ${className}`}>
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
}
