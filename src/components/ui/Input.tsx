// components/ui/Input.tsx

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            {label}
            {props.required && <span style={{ color: 'var(--brand-red)', marginLeft: '4px' }}>*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`auth-input ${className}`}
          style={{
            ...(error ? { borderColor: 'var(--brand-red)' } : {})
          }}
          {...props}
        />
        
        {error && (
          <p style={{
            marginTop: '6px',
            fontSize: '13px',
            color: 'var(--brand-red)'
          }}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p style={{
            marginTop: '6px',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';