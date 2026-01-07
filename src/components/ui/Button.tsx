// components/ui/Button.tsx

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled,
    children,
    style,
    className = '',
    ...props 
  }, ref) => {
    
    const getButtonStyles = () => {
      const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        borderRadius: '50px',
        border: 'none',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.5 : 1,
        transition: 'all 0.2s ease',
        outline: 'none'
      };

      const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
          backgroundColor: 'var(--brand-green)',
          color: 'var(--white)',
        },
        secondary: {
          backgroundColor: '#6b7280',
          color: 'var(--white)',
        },
        outline: {
          border: '2px solid var(--brand-green)',
          color: 'var(--brand-green)',
          backgroundColor: 'transparent',
        },
        ghost: {
          color: '#374151',
          backgroundColor: 'transparent',
        },
        danger: {
          backgroundColor: 'var(--brand-red)',
          color: 'var(--white)',
        },
      };

      const sizeStyles: Record<string, React.CSSProperties> = {
        sm: {
          padding: '6px 16px',
          fontSize: '14px',
        },
        md: {
          padding: '12px 24px',
          fontSize: '15px',
        },
        lg: {
          padding: '16px 32px',
          fontSize: '16px',
        },
      };

      return {
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style
      };
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={getButtonStyles()}
        className={className}
        {...props}
      >
        {isLoading && (
          <svg 
            style={{
              animation: 'spin 1s linear infinite',
              marginRight: '8px',
              width: '16px',
              height: '16px'
            }}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              style={{ opacity: 0.25 }}
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              style={{ opacity: 0.75 }}
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';