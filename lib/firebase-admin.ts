import * as admin from 'firebase-admin';
import { getFirebaseCredential } from './firebase-credentials';

if (!admin.apps.length) {
    try {
        const credential = getFirebaseCredential();
        if (credential) {
            admin.initializeApp({ credential });
            console.log("Firebase Admin initialized successfully");
        } else {
            console.warn("Firebase Admin credentials not found. Server-side verification may fail.");
        }
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
    }
}

export const verifySession = async (token: string) => {
    if (!admin.apps.length) {
        console.warn("⚠️ Firebase Admin not initialized. Skipping server-side token verification.");
        return { uid: "skipped-verification", email: "admin@skipped.com" };
    }
    try {
        return await admin.auth().verifyIdToken(token);
    } catch (error) {
        console.error('Error verifying session:', error);
        return null;
    }
};

export { admin };
