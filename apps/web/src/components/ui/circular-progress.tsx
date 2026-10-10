import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
  fontSize?: string;
  className?: string;
  strokeClassName?: string;
  trackClassName?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  color = "currentColor",
  showValue = true,
  fontSize,
  className,
  strokeClassName,
  trackClassName,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (normalizedValue / 100) * circumference;

  // Choose color based on value if no fixed color provided
  let strokeColor = color;
  if (color === "currentColor") {
    if (value >= 80) strokeColor = "text-emerald-500";
    else if (value >= 50) strokeColor = "text-amber-500";
    else strokeColor = "text-primary";
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className={trackClassName || "text-slate-100"}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${strokeClassName || (color === "currentColor" ? strokeColor : "")}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color !== "currentColor" && !strokeClassName ? color : "currentColor"}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Value text inside */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={fontSize || (size < 70 ? "text-xs font-black text-slate-800" : "text-xl font-bold text-slate-900")}>
              {Math.round(value)}%
            </span>
          </div>
        )}
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-500">{label}</span>}
    </div>
  );
}
