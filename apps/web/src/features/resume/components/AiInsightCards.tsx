import { FileText, Target, AlertTriangle, Lightbulb } from "lucide-react";

interface Props {
  title: string;
  items: string[];
  icon: React.ReactNode;
  colorClass: string;
}

export function AiListCard({ title, items, icon, colorClass }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200/80 p-6 bg-white/85 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-2xl ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-1 text-primary">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResumeSummaryCard({ summary }: { summary?: string | null }) {
  if (!summary) return null;
  return (
    <div className="rounded-3xl border border-slate-200/80 p-6 bg-white/85 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">AI Summary</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
    </div>
  );
}

export function StrengthsCard({ strengths }: { strengths: string[] }) {
  return (
    <AiListCard 
      title="Strengths" 
      items={strengths} 
      icon={<Target className="h-5 w-5" />} 
      colorClass="bg-emerald-50 text-emerald-700 border border-emerald-200"
    />
  );
}

export function WeaknessesCard({ weaknesses }: { weaknesses: string[] }) {
  return (
    <AiListCard 
      title="Areas for Improvement" 
      items={weaknesses} 
      icon={<AlertTriangle className="h-5 w-5" />} 
      colorClass="bg-rose-50 text-rose-700 border border-rose-200"
    />
  );
}

export function SuggestedSkillsCard({ skills }: { skills: string[] }) {
  return (
    <AiListCard 
      title="Suggested Skills" 
      items={skills} 
      icon={<Lightbulb className="h-5 w-5" />} 
      colorClass="bg-amber-50 text-amber-700 border border-amber-200"
    />
  );
}
