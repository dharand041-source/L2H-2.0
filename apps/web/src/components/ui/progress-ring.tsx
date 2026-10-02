import React from 'react';

export interface ProgressRingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label = 'Readiness',
}) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#E43D12'; // Orange
  if (normalizedScore >= 80) strokeColor = '#171714'; // Ink
  else if (normalizedScore >= 60) strokeColor = '#EFB11D'; // Yellow
  else if (normalizedScore >= 40) strokeColor = '#D6536D'; // Rose

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EBE9E1"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold tracking-tight text-brand-ink">
          {Math.round(normalizedScore)}%
        </span>
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/70">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
