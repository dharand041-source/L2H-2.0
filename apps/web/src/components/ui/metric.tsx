import React from 'react';

export interface MetricProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  subtext,
  trend,
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/70">
        {label}
      </span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-brand-ink">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold ${
              trend.direction === 'up'
                ? 'text-brand-orange'
                : trend.direction === 'down'
                ? 'text-brand-rose'
                : 'text-brand-ink/60'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
          </span>
        )}
      </div>
      {subtext && (
        <span className="text-xs text-brand-ink/60 mt-1 font-medium">
          {subtext}
        </span>
      )}
    </div>
  );
};
