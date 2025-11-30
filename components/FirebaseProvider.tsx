// components/FirebaseProvider.tsx
'use client';

import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';

export default function FirebaseProvider({
    children
}: {
    children: React.ReactNode
}) {
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
            } else {
                // User is signed out
                Cookies.remove('firebaseToken');
            }
        });

        return () => unsubscribe();
    }, []);

    return <>{children}</>;
}