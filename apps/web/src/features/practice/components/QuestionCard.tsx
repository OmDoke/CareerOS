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
    <div className="rounded-3xl border border-slate-200/80 p-6 md:p-8 bg-white/85 backdrop-blur-xl shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)] space-y-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          {type}
        </span>
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
          difficulty === "Advanced" ? "bg-rose-50 border-rose-200 text-rose-700" :
          difficulty === "Intermediate" ? "bg-amber-50 border-amber-200 text-amber-700" :
          "bg-emerald-50 border-emerald-200 text-emerald-700"
        }`}>
          {difficulty}
        </span>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none text-slate-900 leading-relaxed font-medium">
        <ReactMarkdown>{question}</ReactMarkdown>
      </div>

      {codeSnippet && (
        <div className="mt-4">
          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-2xl overflow-x-auto text-sm font-mono text-emerald-300 shadow-inner">
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
                  ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/30 font-semibold"
                  : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedOption === option ? "bg-primary text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
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
