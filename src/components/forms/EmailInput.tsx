'use client';

import { useEmailValidation } from '@/hooks/useEmailValidation';
import '@/styles/components/auth-pages.css';

interface EmailInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export default function EmailInput({
  name,
  placeholder,
  value,
  onChange,
  required = true,
  className = 'auth-input'
}: EmailInputProps) {
  const { isValid, error } = useEmailValidation(value);

  return (
    <div className="input-wrapper">
      <input
        type="email"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`${className} ${!isValid && value ? 'password-mismatch' : ''}`}
      />
      {!isValid && value && (
        <div className="password-error-inline">
          <svg className="password-error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
