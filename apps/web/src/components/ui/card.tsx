import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  accentBorder?: 'orange' | 'rose' | 'yellow' | 'pink' | 'none';
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  accentBorder = 'none',
  children,
  ...props
}) => {
  const accentStyles = {
    none: '',
    orange: 'border-t-4 border-t-brand-orange',
    rose: 'border-t-4 border-t-brand-rose',
    yellow: 'border-t-4 border-t-brand-yellow',
    pink: 'border-t-4 border-t-brand-pink',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial p-6',
          accentStyles[accentBorder],
          hoverable && 'editorial-shadow-hover cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
