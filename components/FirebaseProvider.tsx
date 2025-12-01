// components/FirebaseProvider.tsx
'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function FirebaseProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                const token = await user.getIdToken();
                Cookies.set('firebaseToken', token, {
                    expires: 1,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
                setUser(user);
            } else {
                // User is signed out
                Cookies.remove('firebaseToken');
                localStorage.removeItem('firebaseToken');
                localStorage.removeItem('firebaseUser');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
            Cookies.remove('firebaseToken');
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('firebaseUser');
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}