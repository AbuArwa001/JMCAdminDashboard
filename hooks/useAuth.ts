// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/components/FirebaseProvider';

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within FirebaseProvider');
    }

    return context;
}
