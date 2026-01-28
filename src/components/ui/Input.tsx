// components/ui/Input.tsx

import React from 'react';
import '@/styles/components/forms.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="input-container">
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="input-required-mark">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`auth-input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        
        {error && (
          <p className="input-error-message">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="input-helper-text">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';