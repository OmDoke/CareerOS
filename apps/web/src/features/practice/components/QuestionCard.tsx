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
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {type}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
          difficulty === "Advanced" ? "bg-red-100 text-red-800" :
          difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
          "bg-green-100 text-green-800"
        }`}>
          {difficulty}
        </span>
      </div>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <ReactMarkdown>{question}</ReactMarkdown>
      </div>

      {codeSnippet && (
        <div className="mt-4">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
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
              className={`w-full text-left p-4 rounded-md border transition-colors ${
                selectedOption === option
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
