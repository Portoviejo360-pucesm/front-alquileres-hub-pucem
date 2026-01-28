import { useState, useEffect, useCallback } from 'react';

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

interface PasswordValidationResult {
  validation: PasswordValidation;
  isValid: boolean;
  showValidation: boolean;
  setShowValidation: (show: boolean) => void;
}

export function usePasswordValidation(password: string): PasswordValidationResult {
  const [showValidation, setShowValidation] = useState(false);
  const [validation, setValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });

  useEffect(() => {
    const newValidation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
    
    setValidation(newValidation);

    // Cerrar la cajita si todos los requisitos se cumplen
    const allValid = newValidation.minLength && 
                     newValidation.hasUpperCase && 
                     newValidation.hasLowerCase && 
                     newValidation.hasNumber;
    
    if (allValid && showValidation) {
      const timer = setTimeout(() => {
        setShowValidation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [password, showValidation]);

  const isValid = validation.minLength && 
                  validation.hasUpperCase && 
                  validation.hasLowerCase && 
                  validation.hasNumber;

  return { 
    validation, 
    isValid, 
    showValidation, 
    setShowValidation 
  };
}
