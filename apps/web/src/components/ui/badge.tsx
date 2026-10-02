import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'orange' | 'rose' | 'yellow' | 'pink' | 'paper';
  level?: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  level,
  children,
  ...props
}) => {
  let badgeStyles = 'bg-brand-paper text-brand-ink';

  if (level) {
    switch (level) {
      case 'L0':
      case 'L1':
        badgeStyles = 'bg-brand-paper text-brand-ink';
        break;
      case 'L2':
        badgeStyles = 'bg-brand-pink text-brand-ink';
        break;
      case 'L3':
        badgeStyles = 'bg-brand-yellow text-brand-ink';
        break;
      case 'L4':
        badgeStyles = 'bg-brand-rose text-white';
        break;
      case 'L5':
        badgeStyles = 'bg-brand-orange text-white';
        break;
    }
  } else {
    const variants = {
      default: 'bg-brand-ink text-brand-paper',
      orange: 'bg-brand-orange text-white',
      rose: 'bg-brand-rose text-white',
      yellow: 'bg-brand-yellow text-brand-ink',
      pink: 'bg-brand-pink text-brand-ink',
      paper: 'bg-brand-paper text-brand-ink',
    };
    badgeStyles = variants[variant];
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border border-brand-ink',
          badgeStyles,
          className
        )
      )}
      {...props}
    >
      {level ? `${level} · ${children || 'Level'}` : children}
    </span>
  );
};
