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
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-full ${colorClass}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
    <div className="border rounded-lg p-6 bg-card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">AI Summary</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

export function StrengthsCard({ strengths }: { strengths: string[] }) {
  return (
    <AiListCard 
      title="Strengths" 
      items={strengths} 
      icon={<Target className="h-5 w-5" />} 
      colorClass="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
    />
  );
}

export function WeaknessesCard({ weaknesses }: { weaknesses: string[] }) {
  return (
    <AiListCard 
      title="Areas for Improvement" 
      items={weaknesses} 
      icon={<AlertTriangle className="h-5 w-5" />} 
      colorClass="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
    />
  );
}

export function SuggestedSkillsCard({ skills }: { skills: string[] }) {
  return (
    <AiListCard 
      title="Suggested Skills" 
      items={skills} 
      icon={<Lightbulb className="h-5 w-5" />} 
      colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
    />
  );
}
