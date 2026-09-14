interface Props {
  level: string;
}

export function DifficultyBadge({ level }: Props) {
  const l = level.toLowerCase();
  let color = "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100";
  
  if (l.includes("beginner") || l.includes("easy")) {
    color = "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100";
  } else if (l.includes("intermediate") || l.includes("medium")) {
    color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100";
  } else if (l.includes("advanced") || l.includes("hard")) {
    color = "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100";
  }

  return (
    <span className={`${color} px-2.5 py-0.5 rounded-full text-xs font-medium border-none`}>
      {level}
    </span>
  );
}
