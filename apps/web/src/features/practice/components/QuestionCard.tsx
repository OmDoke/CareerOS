import ReactMarkdown from "react-markdown";

interface QuestionCardProps {
  question: string;
  type: string;
  difficulty: string;
  codeSnippet: string | null;
  options: string[] | null;
  onOptionSelect?: (option: string) => void;
  selectedOption?: string | null;
}

export function QuestionCard({
  question,
  type,
  difficulty,
  codeSnippet,
  options,
  onOptionSelect,
  selectedOption,
}: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 p-6 md:p-8 bg-white/[0.035] backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] space-y-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
          {type}
        </span>
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
          difficulty === "Advanced" ? "bg-rose-500/15 border-rose-500/30 text-rose-300" :
          difficulty === "Intermediate" ? "bg-amber-500/15 border-amber-500/30 text-amber-300" :
          "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
        }`}>
          {difficulty}
        </span>
      </div>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-white leading-relaxed">
        <ReactMarkdown>{question}</ReactMarkdown>
      </div>

      {codeSnippet && (
        <div className="mt-4">
          <pre className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl overflow-x-auto text-sm font-mono text-purple-200 shadow-inner">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      )}

      {options && options.length > 0 && (
        <div className="mt-6 space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionSelect && onOptionSelect(option)}
              className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium ${
                selectedOption === option
                  ? "border-primary/60 bg-primary/20 text-white shadow-md shadow-primary/25 ring-2 ring-primary/40"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedOption === option ? "bg-primary text-white" : "bg-white/10 text-slate-400"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
