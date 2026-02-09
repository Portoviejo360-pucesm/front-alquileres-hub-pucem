// lib/hooks/useVerification.ts

import { useAuthStore } from '@/store/auth.store';

/**
 * Hook para verificar el estado de verificación del usuario
 */
export function useVerification() {
    const user = useAuthStore(state => state.user);

    const isVerified = user?.perfilVerificado?.estaVerificado || false;
    const hasVerificationProfile = !!user?.perfilVerificado;
    const verificationPending = hasVerificationProfile && !isVerified;

    return {
        isVerified,
        hasVerificationProfile,
        verificationPending,
        user
    };
}
