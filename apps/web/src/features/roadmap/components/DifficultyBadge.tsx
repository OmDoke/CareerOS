interface Props {
  level: string;
}

export function DifficultyBadge({ level }: Props) {
  const l = level.toLowerCase();
  let color = "bg-slate-100 text-slate-800 hover:bg-slate-200";
  
  if (l.includes("beginner") || l.includes("easy")) {
    color = "bg-emerald-50 text-emerald-800 border border-emerald-200";
  } else if (l.includes("intermediate") || l.includes("medium")) {
    color = "bg-amber-50 text-amber-800 border border-amber-200";
  } else if (l.includes("advanced") || l.includes("hard")) {
    color = "bg-rose-50 text-rose-800 border border-rose-200";
  }

  return (
    <span className={`${color} px-2.5 py-0.5 rounded-full text-xs font-medium border-none`}>
      {level}
    </span>
  );
}
