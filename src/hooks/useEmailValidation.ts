import { useState, useEffect } from 'react';

interface EmailValidationResult {
  isValid: boolean;
  error: string;
}

export function useEmailValidation(email: string): EmailValidationResult {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmedEmail = email.trim();
    
    // Si está vacío, no mostrar error
    if (trimmedEmail.length === 0) {
      setError('');
      setIsValid(true);
      return;
    }

    // Regex estricto para email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      setError('Formato de correo inválido');
      setIsValid(false);
      return;
    }

    // Validar dominio común
    const domain = trimmedEmail.split('@')[1]?.toLowerCase();
    const commonDomains = [
      'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
      'live.com', 'icloud.com', 'hotmail.es', 'outlook.es'
    ];
    const hasValidDomain = domain && (commonDomains.includes(domain) || domain.includes('.'));
    
    if (!hasValidDomain) {
      setError('Dominio de correo no válido');
      setIsValid(false);
      return;
    }

    // Email válido
    setError('');
    setIsValid(true);
  }, [email]);

  return { isValid, error };
}
