import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  color = "currentColor",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Choose color based on value if no fixed color provided
  let strokeColor = color;
  if (color === "currentColor") {
    if (value >= 80) strokeColor = "text-green-500";
    else if (value >= 50) strokeColor = "text-yellow-500";
    else strokeColor = "text-red-500";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-muted/20"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${color === "currentColor" ? strokeColor : ""}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color !== "currentColor" ? color : "currentColor"}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Value text inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{Math.round(value)}%</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}
