import { useState, useEffect } from 'react';

interface PasswordMatchResult {
  passwordMismatch: boolean;
}

export function usePasswordMatch(password: string, confirmPassword: string): PasswordMatchResult {
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordMismatch(password !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  return { passwordMismatch };
}
