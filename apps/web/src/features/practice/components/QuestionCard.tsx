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

const DIFFICULTY_STYLES: Record<string, { bg: string; border: string; fg: string }> = {
  Advanced:     { bg: "var(--err-dim)",    border: "color-mix(in srgb, var(--err) 25%, transparent)",  fg: "var(--err)" },
  Intermediate: { bg: "var(--accent-dim)", border: "color-mix(in srgb, var(--accent) 25%, transparent)", fg: "var(--accent-hover)" },
  Beginner:     { bg: "var(--ok-dim)",     border: "color-mix(in srgb, var(--ok) 25%, transparent)",   fg: "var(--ok)" },
};

export function QuestionCard({
  question,
  type,
  difficulty,
  codeSnippet,
  options,
  onOptionSelect,
  selectedOption,
}: QuestionCardProps) {
  const diffStyle = DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.Beginner;

  return (
    <div className="card p-6 space-y-5">
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="badge"
          style={{
            backgroundColor: "var(--bg-sunken)",
            borderColor: "var(--border)",
            color: "var(--fg-secondary)",
          }}
        >
          {type}
        </span>
        <span
          className="badge"
          style={{
            backgroundColor: diffStyle.bg,
            borderColor: diffStyle.border,
            color: diffStyle.fg,
          }}
        >
          {difficulty}
        </span>
      </div>

      {/* Question text */}
      <div className="prose-careeros text-sm font-medium">
        <ReactMarkdown>{question}</ReactMarkdown>
      </div>

      {/* Code snippet */}
      {codeSnippet && (
        <div className="code-block">
          <code>{codeSnippet}</code>
        </div>
      )}

      {/* MCQ options */}
      {options && options.length > 0 && (
        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            return (
              <button
                key={index}
                onClick={() => onOptionSelect && onOptionSelect(option)}
                className="w-full text-left p-3.5 rounded-lg border text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: isSelected ? "var(--accent-dim)" : "var(--bg-surface)",
                  borderColor: isSelected
                    ? "color-mix(in srgb, var(--accent) 50%, transparent)"
                    : "var(--border)",
                  color: isSelected ? "var(--accent-hover)" : "var(--fg-primary)",
                  boxShadow: isSelected ? "0 0 0 2px color-mix(in srgb, var(--accent) 20%, transparent)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-5 w-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: isSelected ? "var(--accent)" : "var(--bg-sunken)",
                      color: isSelected ? "#fff" : "var(--fg-secondary)",
                      border: isSelected ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
