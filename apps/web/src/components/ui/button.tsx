import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-ink focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:translate-x-[1px] active:translate-y-[1px]';

    const variants = {
      primary:
        'bg-brand-orange text-white border-[1.5px] border-brand-ink shadow-editorial hover:shadow-editorial-hover hover:-translate-x-[2px] hover:-translate-y-[2px]',
      secondary:
        'bg-brand-rose text-white border-[1.5px] border-brand-ink shadow-editorial hover:shadow-editorial-hover hover:-translate-x-[2px] hover:-translate-y-[2px]',
      accent:
        'bg-brand-yellow text-brand-ink border-[1.5px] border-brand-ink shadow-editorial hover:shadow-editorial-hover hover:-translate-x-[2px] hover:-translate-y-[2px]',
      outline:
        'bg-brand-paper text-brand-ink border-[1.5px] border-brand-ink shadow-editorial hover:bg-brand-cream hover:shadow-editorial-hover hover:-translate-x-[2px] hover:-translate-y-[2px]',
      ghost:
        'bg-transparent text-brand-ink hover:bg-black/5 border border-transparent',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
